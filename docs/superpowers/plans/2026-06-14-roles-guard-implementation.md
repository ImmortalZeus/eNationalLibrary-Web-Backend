# RolesGuard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement role-based access control (RBAC) to restrict certain endpoints to Admin users only, while allowing Reader users access to authenticated endpoints.

**Architecture:** Create a `Roles` decorator that stores role requirements in metadata, and a `RolesGuard` that reads the metadata and validates the user's role from the JWT payload against the required roles.

**Tech Stack:** NestJS, TypeScript, Passport JWT

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/modules/auth/roles.decorator.ts` | Create | Decorator `@Roles()` to mark endpoints with required roles |
| `src/modules/auth/roles.guard.ts` | Create | Guard that validates user role against decorator metadata |
| `src/modules/auth/auth.module.ts` | Modify | Add `RolesGuard` to providers and exports |
| `src/modules/book/book.controller.ts` | Modify | Apply guards and decorators to demonstrate usage |

---

## Task 1: Create Roles Decorator

**Files:**
- Create: `src/modules/auth/roles.decorator.ts`
- Reference: `src/common/enums/user/userRole.enum.ts`

- [ ] **Step 1: Create the decorator file**

Create file: `src/modules/auth/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user/userRole.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/auth/roles.decorator.ts
git commit -m "feat: add Roles decorator for role-based access control"
```

---

## Task 2: Create Roles Guard

**Files:**
- Create: `src/modules/auth/roles.guard.ts`
- Dependencies: `src/modules/auth/roles.decorator.ts`, `src/common/enums/user/userRole.enum.ts`

- [ ] **Step 1: Create the guard file**

Create file: `src/modules/auth/roles.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enums/user/userRole.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles specified → allow all authenticated users
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = user?.role;

    if (!userRole) {
      return false;
    }

    return requiredRoles.some((role) => userRole === role);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/auth/roles.guard.ts
git commit -m "feat: add RolesGuard for admin-only endpoint protection"
```

---

## Task 3: Update AuthModule

**Files:**
- Modify: `src/modules/auth/auth.module.ts`

- [ ] **Step 1: Add RolesGuard to providers and exports**

Read the current auth.module.ts content and modify:

In the `providers` array, add `RolesGuard`:
```typescript
providers: [AuthService, JwtStrategy, RolesGuard],
```

In the `exports` array, add `RolesGuard`:
```typescript
exports: [AuthService, RolesGuard],
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/auth/auth.module.ts
git commit -m "feat: register RolesGuard in AuthModule"
```

---

## Task 4: Update BookController to Demonstrate Usage

**Files:**
- Modify: `src/modules/auth/auth.module.ts`
- Modify: `src/modules/book/book.controller.ts`

- [ ] **Step 1: Import RolesGuard and Roles in BookController**

Add imports at the top of `src/modules/book/book.controller.ts`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from 'src/common/enums/user/userRole.enum';
```

- [ ] **Step 2: Add public search endpoint (no guards)**

Add this method to BookController (before findAll):

```typescript
// PUBLIC - guest can search
@Get('search')
async search(@Query('q') q: string): Promise<BookPublicDto[]> {
  const books = await this.bookService.search(q);
  return books.map(book => BookMapper.toBookPublicDto(book));
}
```

- [ ] **Step 3: Add login-only findAll (JwtAuthGuard only)**

Modify the existing findAll method to add `@UseGuards(JwtAuthGuard)`:

```typescript
// LOGIN REQUIRED - any logged-in user (Admin OR Reader)
@UseGuards(JwtAuthGuard)
@Get()
async findAll(
  @Query('relations', ParseRelationsPipe) relations: string[]
): Promise<BookPublicDto[]> {
  const books = await this.bookService.findAll(relations);
  return books.map(book => BookMapper.toBookPublicDto(book));
}
```

- [ ] **Step 4: Add admin-only create (both guards)**

Modify the create method:

```typescript
// ADMIN ONLY - JWT + Admin role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Post()
async create(
  @Body() createBookDto: CreateBookDto
): Promise<string> {
  const book = await this.bookService.create(createBookDto);
  return book.bookId;
}
```

- [ ] **Step 5: Add admin-only update and delete**

Modify updateOneById:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Put(':id')
async updateOneById(
  @Param('id') id: string,
  @Body() updateBookDto: UpdateBookDto
): Promise<boolean> {
  const res = await this.bookService.updateOneById(id, updateBookDto);
  return res;
}
```

Modify removeOneById:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Delete(':id')
async removeOneById(
  @Param('id') id: string,
): Promise<boolean> {
  const res = await this.bookService.removeOneById(id);
  return res;
}
```

- [ ] **Step 6: Add search method to BookService**

Add this method to `src/modules/book/book.service.ts`:

```typescript
async search(query: string): Promise<Book[]> {
  return this.bookRepository.find({
    where: [
      { title: ILike(`%${query}%`) },
      { description: ILike(`%${query}%`) },
    ],
    relations: ['authors', 'publishers', 'genres'],
  });
}
```

Make sure to import `ILike` from typeorm:
```typescript
import { ILike } from 'typeorm';
```

- [ ] **Step 7: Commit**

```bash
git add src/modules/book/book.controller.ts src/modules/book/book.service.ts
git commit -m "feat: demonstrate RolesGuard usage in BookController"
```

---

## Task 5: Test the Implementation

**Files:**
- Test manually via curl or Postman

- [ ] **Step 1: Test public search (no auth)**

```bash
curl http://localhost:3000/api/books/search?q=harry
```
Expected: 200 OK with book results

- [ ] **Step 2: Test findAll without auth**

```bash
curl http://localhost:3000/api/books
```
Expected: 401 Unauthorized

- [ ] **Step 3: Test create without auth**

```bash
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{"title":"Test","description":"Test","previewUrl":"http://test.com"}'
```
Expected: 401 Unauthorized

- [ ] **Step 4: Test create with reader token**

```bash
curl -X POST http://localhost:3000/api/books -H "Authorization: Bearer <reader-token>" -H "Content-Type: application/json" -d '{"title":"Test","description":"Test","previewUrl":"http://test.com"}'
```
Expected: 403 Forbidden

- [ ] **Step 5: Test create with admin token**

```bash
curl -X POST http://localhost:3000/api/books -H "Authorization: Bearer <admin-token>" -H "Content-Type: application/json" -d '{"title":"Test","description":"Test","previewUrl":"http://test.com"}'
```
Expected: 201 Created with book ID

- [ ] **Step 6: Commit**

```bash
git commit -m "test: verify RolesGuard implementation with manual testing"
```

---

## Summary

After completing all tasks, the following will be implemented:

1. **`@Roles()` decorator** - Mark endpoints with required roles
2. **`RolesGuard`** - Validate user role against required roles
3. **AuthModule updated** - RolesGuard available globally
4. **BookController demo** - Public search, login-only findAll, admin-only create/update/delete

Access patterns:
| Endpoint | Access Level |
|----------|--------------|
| `GET /books/search` | Public |
| `GET /books` | Login only |
| `POST /books` | Admin only |
| `PUT /books/:id` | Admin only |
| `DELETE /books/:id` | Admin only |