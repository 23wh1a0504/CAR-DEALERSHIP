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

Latest local report: **15 tests passing across 3 suites**.

## My AI Usage

I used **OpenAI Codex** to help scaffold the Express routes/controllers/services, Prisma/MySQL integration, Jest test cases, React/Tailwind interface, and documentation. I reviewed the generated structure, ran builds and tests, and corrected issues found during validation (TypeScript configuration and frontend type errors).

AI made repetitive setup and test scaffolding faster, while the project requirements, architecture choices, validation rules, and final verification remained actively reviewed. Each AI-assisted commit should include the required co-author trailer:

```text
Co-authored-by: OpenAI Codex <ai@users.noreply.github.com>
```

## Screenshots

Start both applications using the commands above, then capture the login screen, vehicle dashboard, and admin inventory form and add them to a `docs/screenshots/` directory before publishing the repository.
