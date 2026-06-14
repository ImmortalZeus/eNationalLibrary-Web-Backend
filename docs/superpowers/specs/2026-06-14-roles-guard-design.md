# RolesGuard Design Specification

**Date:** 2026-06-14  
**Topic:** Admin-only endpoint access control using RolesGuard

---

## 1. Overview

Implement role-based access control (RBAC) for the NestJS backend to restrict certain endpoints to Admin users only, while allowing Reader users access to other authenticated endpoints.

---

## 2. Current State

- JWT authentication is implemented (`JwtAuthGuard`, `JwtStrategy`)
- User entity has `role: UserRole` field (values: `Reader`, `Admin`)
- JWT payload includes `role` but is not used for access control
- All protected endpoints use only `@UseGuards(JwtAuthGuard)`

---

## 3. Architecture

```
Request → JwtAuthGuard → RolesGuard → Controller
              │              │
              │         (checks @Roles)
              │              │
              ▼         ┌─────┴─────┐
        Validates JWT  │403 Forbidden│
        Extracts user │if role       │
        role in req.user mismatch   │
```

**Execution order:**
1. `JwtAuthGuard` validates token, sets `req.user` with `{ userId, username, role }`
2. `RolesGuard` reads `@Roles` decorator metadata and compares with `req.user.role`

---

## 4. Components

### 4.1 Roles Decorator

**File:** `src/modules/auth/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/enums/user/userRole.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
```

- Uses NestJS `SetMetadata` to attach role requirements to route handlers
- Accepts variable number of roles: `@Roles(UserRole.Admin)` or `@Roles(UserRole.Admin, UserRole.Librarian)`

### 4.2 Roles Guard

**File:** `src/modules/auth/roles.guard.ts`

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

**Behavior:**
- No `@Roles` decorator → passes (auth required, role unrestricted)
- Has `@Roles` decorator → checks if `user.role` matches any required role
- No user in request → returns false (will result in 401)

### 4.3 Error Response (403)

When `RolesGuard` denies access:

```json
{
  "statusCode": 403,
  "message": "Access denied: Admin role required",
  "error": "Forbidden"
}
```

Will be handled by NestJS default exception filter.

---

## 5. Usage Patterns

| Access Level | Guard(s) | Decorator | Example |
|--------------|----------|-----------|---------|
| Public (guest) | None | None | `GET /books/search` |
| Login only | `@UseGuards(JwtAuthGuard)` | None | `GET /books/:id` |
| Admin only | `@UseGuards(JwtAuthGuard, RolesGuard)` | `@Roles(UserRole.Admin)` | `POST /books` |

### Example: BookController

```typescript
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // PUBLIC - guest can search
  @Get('search')
  search(@Query('q') q: string) {
    return this.bookService.search(q);
  }

  // LOGIN REQUIRED - any logged-in user (Admin OR Reader)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('relations', ParseRelationsPipe) relations: string[]) {
    return this.bookService.findAll(relations);
  }

  // ADMIN ONLY - JWT + Admin role
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<string> {
    const book = await this.bookService.create(createBookDto);
    return book.bookId;
  }

  // ADMIN ONLY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  async removeOneById(@Param('id') id: string): Promise<boolean> {
    return this.bookService.removeOneById(id);
  }
}
```

---

## 6. Module Integration

### 6.1 AuthModule Updates

**File:** `src/modules/auth/auth.module.ts`

Add `RolesGuard` to providers and exports:

```typescript
@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({ ... }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
```

---

## 7. Testing Considerations

- Unit test `RolesGuard` with mocked `Reflector`
- Test endpoints with different role users (Admin, Reader, unauthenticated)
- Verify 403 response for unauthorized role access

---

## 8. Scope

**In scope:**
- Create `Roles` decorator
- Create `RolesGuard` 
- Update `AuthModule` exports
- Update sample controllers (BookController) to demonstrate usage

**Out of scope:**
- Other role types (Librarian, etc.) — only Admin vs Reader
- Permission-level granularity (just role check, not resource-level)
- Frontend changes