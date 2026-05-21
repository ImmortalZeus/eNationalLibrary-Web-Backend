# eNationalLibrary
This document explains how to set up and run the eNationalLibrary backend locally.

The backend is built using:
- Node.js
- NestJS
- TypeORM
- PostgreSQL

## Install Required Software

### Node.js
Check installation
```
node -v
npm -v
```
### PostgresSQL
During installation remember the following values:
- Username: postgres
- Password: (your password)
- Port: 5432

After installation, make sure the PostgreSQL service is running.

## Install Backend Dependencies
Initialize submodules:
```
git submodule update --init --recursive
```
Navigate to the backend folder:
```
cd backend
```
Install dependencies:
```
npm install
```

## Create Enviroment Configuration
Create a .env file in the backend root directory:
```
backend/.env         
```

Example:
```
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_postgres_password
DB_NAME=enational_library
```

⚠️ Important
- Do not push .env to GitHub
- .env should already be listed in .gitignore

## Run the Backend server
Start the backend:
```
npm run start
```
Or run in development mode:
```
npm run start:dev
```
If everything is correct, you should see:
```
Nest application successfully started
```
All backend APIs are exposed under the base path:
```
http://localhost:3000/api
```

## Test the API
Using Thunder Client (VS Code extension)

<!-- ## 📚 Overview
This repository contains the BACKEND of the **eNationalLibrary Web**, a group project developed for the *Introduction to Software Engineering* course. It handles server-side logic, database management, and API services for the application. -->

# Authentication & JWT Authorization

The backend now supports user authentication using JWT.

## What was implemented:
- User registration now accepts a plain password from the client
- Password is hashed using bcrypt before storing
- Only `passwordHash` is saved in the database (secure)
- Login API validates username/email and password
- On successful login, the backend returns a JWT `accessToken`
- Protected APIs now require this token in the `Authorization` header
- `BookController` has been protected using `JwtAuthGuard`

## Authentication Flow:
1. Client sends username/email and password
2. Backend finds user in database
3. Backend compares password with `passwordHash` using bcrypt
4. If valid, backend generates JWT token
5. Client uses token to call protected APIs

## Login API:
**Endpoint:**
```
POST http://localhost:3000/api/auth/login
```
**Request body:**
```json
{
"usernameOrEmail": "admin@gmail.com",
"password": "12345678"
}
```
**Response:**
```json
{
"accessToken": "..."
}
```

## Using the token:
To access protected APIs, include this header:
```
Authorization: Bearer <accessToken>
```
**Example:**
GET http://localhost:3000/api/book
- **Without token:**
  - Response → 401 Unauthorized
- **With valid token:**
  - Response → 200 OK (data returned or empty list)

## Demo Workflow (for testing):
1. **Start backend:**
running command: `npm run start:dev`
expected output: “Nest application successfully started”
2. **Create a user:**
send request to user creation endpoint with details like username, gender, email, password, phoneNumber, role, status.
payload response returns new userId.
3. **Login:**
send POST request to `/api/auth/login` with email or username + password.
payload response returns accessToken.
4. **Test protected API without token:**
calls GET `/api/book` — Result: Unauthorized (401)
5. **Test protected API with token:**
does header:
authorization: Bearer `<token>`,
calls GET `/api/book` — Result: 200 OK (may return empty array if no data)

## Current Security Status:
- Password hashing (bcrypt): Done
- Login API: Done
- JWT token generation: Done
- Protect Book APIs: Done
- Role-based authorization: Not implemented yet
- /auth/me endpoint: Not implemented yet

## Suggested Next Steps:
- Add role-based authorization (ADMIN vs USER)
- Restrict create/update/delete actions to ADMIN only
- Add `/api/auth/me` to get current logged-in user from token
- Integrate authentication into frontend

## 👥 Group members
- Đặng Trung Anh - 20235583
- Hoàng Gia Nam Anh - 20235584
- Phạm Đức Duy - 20235588
- Nguyễn Thái Anh Minh - 20235605
- Trần Tiến Sơn - 20235620

---

✍️ *This is an initial README file and will be updated as the project evolves.*
