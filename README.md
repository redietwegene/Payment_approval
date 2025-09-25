# Payment Approval API

Two-step payment approval API with Admin and Super Admin roles.

Quick start

1. Copy `.env.example` to `.env` and set `JWT_SECRET`.
2. Install: npm install
3. Seed data: npm run seed
4. Start: npm start

Swagger UI: http://localhost:3000/api-docs

Default users (seed):

- admin / adminpass (role: admin)
- super / superpass (role: super_admin)
- user / userpass (role: user)
  You can run the app with a local Postgres database by setting `DATABASE_URL` in your environment to point at your Postgres instance.
