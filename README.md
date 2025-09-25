# Payment Approval API

This repository implements a small Payment Approval backend with a two-step approval flow:

- Users can create payment requests (status = `pending`).
- Admins can approve or reject requests (moves status to `admin_approved` or `admin_rejected`).
- Super Admins confirm admin approvals to make them final (`approved`) or reject (`rejected`).
- All actions are recorded in an `audit_logs` table for traceability.

The project includes an Express API, JWT authentication, Knex migrations + seeds, Swagger UI and a simple SQLite (default) / PostgreSQL option.

---

## Quick setup (backend)

Prerequisites:

- Node 18+ and npm
- (Optional) PostgreSQL if you want to use Postgres instead of the default SQLite file

1. Clone the repository and open a terminal in the project root.

2. Copy environment template and set secrets:

```powershell
cp .env.example .env
# Edit .env and set JWT_SECRET (and DATABASE_URL if using Postgres)
```

3. Install dependencies:

```powershell
npm install
```

4. Create database schema (Knex migrations) and seed sample data:

```powershell
# Run migrations
npm run migrate

# Run knex seeds
npm run db:seed

# (alternative) run the ESM seed script
npm run seed
```

By default the app uses a local SQLite file at `./data/dev.sqlite3`. To use PostgreSQL, set `DATABASE_URL` in your `.env` (for example: `postgres://postgres:postgres@localhost:5432/paymentdb`) before running migrations/seeds.

5. Start the server:

```powershell
npm start
# or during development
npm run dev
```

When running you should see: `Server running on port 3000`.

Open Swagger UI: http://localhost:3000/api-docs

---

## Default seeded accounts

- admin / adminpass (role: `admin`)
- super / superpass (role: `super_admin`)
- user / userpass (role: `user`)

Use `/auth/login` to get a JWT for the Swagger UI or API calls.

---

## How to test the flow in Swagger UI

1. Start the server, open `http://localhost:3000/api-docs`.
2. POST `/auth/login` with `{ "username":"admin", "password":"adminpass" }` to get an **admin** token.
3. Click `Authorize` in Swagger and paste `Bearer <admin-token>` (this authorizes admin actions).
4. Create a payment with POST `/payments` (body: `{ "amount": 42.5, "user_id": "u-user" }`). Note the returned payment `id`.
5. While still authorized as admin, call POST `/payments/{id}/admin-approve` with body `{ "action": "approve" }` to set the payment to `admin_approved`.
6. BEFORE calling the super-confirm endpoint you must authenticate as the super admin. POST `/auth/login` with `{ "username":"super", "password":"superpass" }` to get a **super-admin** token.
7. Click `Authorize` again in Swagger and replace the token with `Bearer <super-token>` (this switches the Authorization header to the super-admin token).
8. Now call POST `/payments/{id}/super-approve` with body `{ "action": "confirm" }` to finalize the approval (status -> `approved`).

Note: Swagger keeps a single active Authorization header — use the Authorize dialog to switch between admin and super tokens when testing the two-step flow.

All endpoints require a bearer token except `/auth/login`.

---

## Quick PowerShell examples (without Swagger)

# Login and store token

$login = @{ username='admin'; password='adminpass' } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri http://localhost:3000/auth/login -Method Post -Body $login -ContentType 'application/json'
$token = $resp.token

# Create payment

$hdr = @{ Authorization = "Bearer $token" }
$body = @{ amount = 42.5; user_id = 'u-user' } | ConvertTo-Json
$new = Invoke-RestMethod -Uri http://localhost:3000/payments -Method Post -Headers $hdr -Body $body -ContentType 'application/json'

---

## Tech choices & trade-offs

- Node.js + Express: small, widely-known backend framework. Fast to prototype APIs.
- JWT for stateless auth: works well for API clients and Swagger testing. Simpler than session stores for this demo, but needs secure secret management in production.
- Knex: lightweight query builder that supports multiple SQL dialects (SQLite/Postgres). Chosen so migrations/seeds work in both dev and production.
- SQLite (default) for easiest local setup; PostgreSQL for production (recommended). SQLite is fine for local testing but not for concurrent/production workloads.
- Audit logs are stored in an append-only table (`audit_logs`), keeping who/role/timestamp for each action to satisfy auditability.

Trade-offs:

- Simplicity over advanced production features: table creation is handled by migrations but some behavior is intentionally minimal.
- No rate limiting, no RBAC beyond simple role checks, and no refresh tokens for JWTs. These are deliberate to keep the demo focused.

---

## What I'd improve with more time

- Add fully featured Knex migrations and CI that run migrations and tests automatically.
- Add unit and integration tests (Jest / Supertest) covering auth, approval flows, and audit logs.
- Harden security: JWT rotation/refresh tokens, stronger password policies, better secret management (Vault/Env encryption), rate limiting, input sanitation.
- Add pagination and filtering to GET /payments and endpoints to fetch audit logs for a specific payment.
- Add role management endpoints and admin UI (a small frontend) to manage users and approvals.
- Add detailed Swagger examples and a Postman collection for reviewers.

---

If you want, I can also:

- Add a `/health` endpoint that checks DB connectivity and returns counts for quick monitoring.
- Prepare a small front-end demo (React) that consumes the API and shows the two-step flow.
- Create a clean git commit history and push to a GitHub repository with instructions.

Tell me which of the above you'd like next and I will implement it.
