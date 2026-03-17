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

## 👥 Group members
- Đặng Trung Anh - 20235583
- Hoàng Gia Nam Anh - 20235584
- Phạm Đức Duy - 20235588
- Nguyễn Thái Anh Minh - 20235605
- Trần Tiến Sơn - 20235620

---

✍️ *This is an initial README file and will be updated as the project evolves.*
