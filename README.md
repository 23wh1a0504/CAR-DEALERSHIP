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

The suite covers registration validation and duplicates, login/JWT behavior, authentication enforcement, vehicle creation/search, purchases including the out-of-stock case, and admin authorization. Prisma is mocked in automated request tests so they are deterministic; the production app uses MySQL via Prisma.

Latest local report: **15 tests passing across 3 suites**. See the complete [test report](TEST_REPORT.md).

## My AI Usage

I used **GitHub Copilot** as an AI coding assistant throughout the project. I used it to:

- Brainstorm the structure of the Express API, including authentication and vehicle inventory endpoints.
- Generate initial TypeScript implementations for controllers, services, routes, middleware, and Prisma database access.
- Suggest bcrypt and JWT authentication patterns, including admin authorization checks.
- Create Jest and Supertest test cases for registration, login, authentication, vehicle search, purchases, restocking, and access control.
- Help build the React, TypeScript, Vite, and Tailwind CSS frontend for customer and administrator workflows.
- Review error messages, explain TypeScript issues, and improve the README and setup instructions.

AI accelerated repetitive scaffolding and helped me explore implementation options quickly, especially when creating similar API handlers and test cases. It also acted as a second set of eyes when diagnosing type and configuration errors. However, I treated its suggestions as drafts: I checked the code against the project requirements, reviewed security-sensitive authentication logic, ran the test suite and builds, and corrected issues discovered during validation. The final architecture, business rules, database decisions, and verification were reviewed and accepted by me rather than copied without evaluation.

## Screenshots

Start both applications using the commands above, then capture the login screen, vehicle dashboard, and admin inventory form and add them to a `docs/screenshots/` directory before publishing the repository.
