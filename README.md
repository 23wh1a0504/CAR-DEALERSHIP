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

# Test Report

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


## My AI Usage

I used **GitHub Copilot** as an AI coding assistant during this project. I used it to brainstorm the Express API structure, generate initial controllers, services, routes, authentication middleware, Prisma database integration, Jest tests, and the React/Tailwind frontend.

I also used GitHub Copilot to help explain TypeScript errors, improve validation logic, review authentication and authorization code, and refine the project documentation. I reviewed the generated suggestions, adapted them to the project requirements, and verified the implementation by running the tests and builds.

AI made the development process faster by reducing repetitive setup work and helping me explore solutions quickly. However, I did not rely on AI output without review. I made the final architecture and business-rule decisions, checked security-sensitive code such as password hashing and JWT authentication, and corrected issues found during testing and validation.

Screenshots:

<img width="1920" height="1020" alt="Screenshot 2026-08-22 230049" src="https://github.com/user-attachments/assets/1091fe88-5eec-48e4-84b4-a6938a03783e" />

<img width="1920" height="1020" alt="Screenshot 2026-08-23 172151" src="https://github.com/user-attachments/assets/470a85d1-2c83-43de-afd8-062bacdc8e62" />

<img width="1920" height="1020" alt="Screenshot 2026-08-23 172231" src="https://github.com/user-attachments/assets/cc6c9b3f-bdb7-4f04-b194-a66dc0988f61" />

