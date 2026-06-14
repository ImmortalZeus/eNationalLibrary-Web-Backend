# eNationalLibrary — Backend

REST API for the eNationalLibrary web app, built with NestJS, TypeORM, and PostgreSQL.

This repository contains only the **backend** service. The frontend lives in a separate repo: [eNationalLibrary-Web-Frontend](https://github.com/ImmortalZeus/eNationalLibrary-Web-Frontend).

---

## 🧱 Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Auth**: JWT (Passport) + bcrypt
- **Validation**: class-validator / class-transformer
- **Security**: helmet, CORS

---

## ✨ Features

The backend is split into 12 domain modules, each exposing a REST resource under the `/api` prefix:

| Module | Resource | Description |
|--------|----------|-------------|
| `auth` | `/api/auth` | Login, JWT issuance |
| `admins` | `/api/admins` | Admin accounts |
| `readers` | `/api/readers` | Reader accounts and profiles |
| `books` | `/api/books` | Book catalog |
| `authors` | `/api/authors` | Author records |
| `genres` | `/api/genres` | Genre taxonomy |
| `publishers` | `/api/publishers` | Publisher records |
| `borrow-records` | `/api/borrow-records` | Book borrowing transactions |
| `return-records` | `/api/return-records` | Book return transactions |
| `reading-cards` | `/api/reading-cards` | Library card management |
| `reviews` | `/api/reviews` | Book reviews |

> The `users` controller is currently disabled and not exposed.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                 # App bootstrap (CORS, validation, helmet, /api prefix)
│   ├── app.module.ts           # Root module (TypeORM connection + feature modules)
│   ├── app.controller.ts       # Root controller
│   ├── app.service.ts
│   ├── common/                 # Shared enums, pipes, validators, configs
│   │   ├── configs/
│   │   ├── enums/
│   │   ├── queryPipes/
│   │   └── validators/
│   └── modules/                # One folder per feature module
│       ├── auth/
│       ├── admin/              # (scaffold: admins)
│       ├── reader/             # (scaffold: readers)
│       ├── book/               # (scaffold: books)
│       ├── author/             # (scaffold: authors)
│       ├── genre/              # (scaffold: genres)
│       ├── publisher/          # (scaffold: publishers)
│       ├── borrow-record/      # (scaffold: borrow-records)
│       ├── return-record/      # (scaffold: return-records)
│       ├── reading-card/       # (scaffold: reading-cards)
│       ├── review/             # (scaffold: reviews)
│       └── user/               # currently inactive
├── scripts/
│   ├── seed-admin.js           # One-time admin account seed
│   └── seed-sample-data.js     # Populate books, authors, etc.
├── test/                       # E2E tests
├── .env                        # Local secrets (not committed)
└── package.json
```

Each feature module follows the same layout:

```
modules/<name>/
├── <name>.controller.ts
├── <name>.service.ts
├── <name>.entity.ts
├── <name>.module.ts
├── <name>.mapper.ts
└── dto/
    ├── create-<name>.dto.ts
    ├── update-<name>.dto.ts
    └── <name>-public.dto.ts
```

---

## ✅ Prerequisites

- **Node.js** ≥ 18 (tested with the version NestJS 11 requires)
- **npm** ≥ 9
- **PostgreSQL** ≥ 14, running on `localhost:5432` by default
  - A database you can connect to (default name used in `.env.example` is `enational_library`)

Verify your tooling:

```bash
node -v
npm -v
psql --version
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root:

```
backend/.env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | yes | `localhost` | PostgreSQL host |
| `DB_PORT` | yes | `5432` | PostgreSQL port |
| `DB_USER` | yes | `postgres` | PostgreSQL user |
| `DB_PASS` | yes | — | PostgreSQL password |
| `DB_NAME` | yes | `enational_library` | Database name |
| `JWT_SECRET` | yes | — | Secret used to sign access tokens |
| `PORT` | no | `3000` | HTTP port for the API |

Example `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_postgres_password
DB_NAME=enational_library
JWT_SECRET=replace-me-with-a-long-random-string
PORT=3000
```

> ⚠️ Never commit `.env`. It is listed in `.gitignore`.

---

## 📦 Installation

```bash
git clone https://github.com/ImmortalZeus/eNationalLibrary-Web-Backend.git
cd eNationalLibrary-Web-Backend
npm install
```

---

## 🗄️ Database Setup

1. Make sure PostgreSQL is running.
2. Create the database (only once):

   ```bash
   psql -U postgres -c "CREATE DATABASE enational_library;"
   ```

3. Tables are created automatically — `synchronize: true` is enabled in `app.module.ts`, so entities are synced on app boot during development. **Do not use this setting in production.**

---

## 🌱 Seeding (Optional)

Two helper scripts are provided under `scripts/`. They read configuration from `.env` and talk to the database directly, so you don't need the app running for the first one.

### 1. Create a test admin account

```bash
node scripts/seed-admin.js
```

Creates (or upgrades) an admin user with:

- email: `test@test.com`
- password: `test`
- role: `Admin`

### 2. Populate sample library data

Requires the backend to be running and the admin account to exist:

```bash
npm run start:dev
# in another terminal
node scripts/seed-sample-data.js
```

Inserts sample authors, genres, publishers, and books via the public API. Override the API URL with `API_URL=http://localhost:3000/api`.

---

## ▶️ Running the App

```bash
# development (watch mode)
npm run start:dev

# debug mode
npm run start:debug

# production build + start
npm run build
npm run start:prod
```

On success you should see:

```
Nest application successfully started
```

The API is now available at:

```
http://localhost:3000/api
```

CORS is preconfigured to accept requests from the Vite dev server at `http://localhost:5173`.

---

## 🛣️ API Routes Overview

All routes are prefixed with `/api`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/login` | public | Authenticate and receive a JWT |
| `*` | `/admins` | role: `Admin` | Manage admin accounts |
| `*` | `/readers` | role: `Admin` | Manage reader accounts |
| `*` | `/books` | bearer | Manage the book catalog |
| `*` | `/authors` | bearer | Manage authors |
| `*` | `/genres` | bearer | Manage genres |
| `*` | `/publishers` | bearer | Manage publishers |
| `*` | `/borrow-records` | bearer | Track borrow transactions |
| `*` | `/return-records` | bearer | Track return transactions |
| `*` | `/reading-cards` | bearer | Library card management |
| `*` | `/reviews` | bearer | Book reviews |

`bearer` means a valid JWT in the `Authorization: Bearer <token>` header is required. Some routes use a `@Roles(...)` decorator and will additionally check the caller's role.

---

## 🔐 Authentication

- Passwords are hashed with **bcrypt** before being stored.
- After `POST /api/auth/login`, the server returns a signed **JWT** (no refresh token yet).
- Token expiry: **1 day** (`expiresIn: '1d'` in `auth.module.ts`).
- JWT payload: `{ sub: <userId>, username, role }`.
- Roles supported today: `Admin` and `Reader`.
- Send the token on every protected request:
  ```
  Authorization: Bearer <accessToken>
  ```
- Role-based authorization is enforced through `RolesGuard` plus a `@Roles(...)` decorator.

---

## 🧪 Testing

```bash
# unit tests
npm run test

# watch mode
npm run test:watch

# coverage report
npm run test:cov

# end-to-end tests
npm run test:e2e
```

Jest is configured per the NestJS default. Unit tests live next to their source files as `*.spec.ts`.

---

## 📜 Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run the compiled app |
| `npm run start:dev` | Run with watch mode |
| `npm run start:debug` | Run with inspector + watch |
| `npm run start:prod` | Run the compiled production build |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format source files with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:cov` | Run unit tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |

---

## 👥 Group Members

- Đặng Trung Anh — 20235583
- Hoàng Gia Nam Anh — 20235584
- Phạm Đức Duy — 20235588
- Nguyễn Thái Anh Minh — 20235605
- Trần Tiến Sơn — 20235620

---

✍️ *Group project for the Introduction to Software Engineering course.*
