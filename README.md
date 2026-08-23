# Driveway — Car Dealership Inventory System

Driveway is a full-stack inventory system built for the TDD Kata assessment. Customers can register, log in, search the live catalogue, and purchase in-stock vehicles. Administrators can add, edit, delete, and restock inventory.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** MySQL 8 (persistent relational database)
- **Authentication:** bcrypt password hashes and JWT bearer tokens
- **Tests:** Jest and Supertest

## Local setup

### 1. Create the MySQL database

Make sure MySQL 8 is running, then create a database named `car_dealership` in MySQL Workbench or with:

```sql
CREATE DATABASE car_dealership;
```

### 2. Configure the backend

Copy `backend/.env.example` to `backend/.env` and replace both `YOUR_MYSQL_PASSWORD` values with your own MySQL password. Also replace `JWT_SECRET` with a long random value.

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

The API starts on `http://localhost:5000`. The seed command creates this admin account and four demo vehicles for local development:

```text
Email: admin@driveway.local
Password: Admin123!
```

Change this password or remove the seed account before deploying.

### 3. Start the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Set `VITE_API_URL` in `frontend/.env` only if the API uses another address.

## API

All vehicle requests require `Authorization: Bearer <jwt>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register an account |
| POST | `/api/auth/login` | Public | Receive a JWT |
| POST | `/api/vehicles` | Authenticated | Create a vehicle |
| GET | `/api/vehicles` | Authenticated | List inventory |
| GET | `/api/vehicles/search` | Authenticated | Filter by make, model, category, or `minPrice`/`maxPrice` |
| PUT | `/api/vehicles/:id` | Authenticated | Update a vehicle |
| DELETE | `/api/vehicles/:id` | Admin | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Authenticated | Decrement stock |
| POST | `/api/vehicles/:id/restock` | Admin | Increment stock |

## Tests

```bash
cd backend
npm test
npm run test:coverage
```

The suite covers r# Test Report

## Backend

Command:

```bash
cd backend
npm test
```

Result:

```text
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
```

The test suite completed successfully on 2026-08-23. Jest ran all three backend test suites in serial mode using the repository's `npm test` script.

## TypeScript Build

Command:

```bash
cd backend
npm run build
```

Result: completed successfully with no TypeScript errors.

<<<<<<< HEAD
Latest local report: **15 tests passing across 3 suites**. See the complete [test report](TEST_REPORT.md).

## My AI Usage


Screenshots:

<img width="1920" height="1020" alt="Screenshot 2026-08-22 230049" src="https://github.com/user-attachments/assets/1091fe88-5eec-48e4-84b4-a6938a03783e" />

<img width="1920" height="1020" alt="Screenshot 2026-08-23 172151" src="https://github.com/user-attachments/assets/470a85d1-2c83-43de-afd8-062bacdc8e62" />

<img width="1920" height="1020" alt="Screenshot 2026-08-23 172231" src="https://github.com/user-attachments/assets/cc6c9b3f-bdb7-4f04-b194-a66dc0988f61" />

