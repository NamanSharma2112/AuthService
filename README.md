# Assiment

An Express, TypeScript, and MongoDB authentication API with email verification, JWT-based access and refresh tokens, password hashing, and input validation.

## Overview

This project is a backend service for user authentication and account verification. It uses:

- Express for the HTTP API
- MongoDB with Mongoose for persistence
- Zod for request validation
- bcryptjs for password hashing
- jsonwebtoken for access and refresh token handling
- Nodemailer for verification email delivery

## Features

- User registration with validation
- Password hashing before storage
- Email verification flow
- Login with access token issuance
- Refresh token cookie support
- Health check endpoint
- Modular TypeScript project structure

## Project Structure

```text
src/
  app.ts                Express app setup and route registration
  server.ts             Server bootstrap and database connection
  config/db.ts          MongoDB connection helper
  controllers/auth/     Authentication controller and validation schema
  libs/                 Reusable helpers for email, hashing, and tokens
  models/               Mongoose data models
  routes/               API route definitions
```

## Requirements

- Node.js
- MongoDB connection string
- SMTP credentials for sending verification emails

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and configure the following values:

```env
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:5000

MONGO_URI=mongodb://localhost:27017/assiment

JWT_ACCESS_SECRET=replace-with-a-secure-secret
JWT_REFRESH_SECRET=replace-with-a-secure-secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_SECURE=false
EMAIL_FROM=no-reply@example.com
```

### Notes

- `SMTP_SECURE=true` is typically required for SMTP port `465`.
- `APP_URL` is used to build verification links.
- `NODE_ENV=production` enables production cookie settings for refresh tokens.

## Available Scripts

```bash
npm run dev
npm run build
npm start
```

- `npm run dev` starts the API with `ts-node-dev`.
- `npm run build` compiles the TypeScript source to `dist/`.
- `npm start` runs the compiled server from `dist/server.js`.

## API Endpoints

### Health Check

`GET /health`

Response:

```json
{
  "message": "Server is healthy"
}
```

### Authentication

Base path: `/auth`

#### Register a user

`POST /auth/register`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

Behavior:

- Validates the payload with Zod
- Normalizes and checks for duplicate emails
- Hashes the password before saving
- Creates a verification token
- Sends a verification email

#### Login

`POST /auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Behavior:

- Validates the payload with Zod
- Verifies the password
- Requires the email to be verified
- Returns an access token
- Sets a refresh token cookie

#### Verify email

`GET /auth/verify-email`

Behavior:

- Verifies the JWT token
- Marks the user as verified
- Prevents duplicate verification

The registration flow generates the verification link that the user receives by email.

## Data Model

The `User` model stores:

- `email`
- `password`
- `role`
- `isEmailVerified`
- `name`
- `twoFactorEnabled`
- `twoFactorSecret`
- `tokenVersion`
- `resetPasswordToken`
- `resetPasswordTokenExpiry`

## Authentication Flow

1. The client submits registration data to `POST /auth/register`.
2. The server validates input, hashes the password, and creates a user.
3. A verification token is generated and emailed to the user.
4. The user verifies the account through the verification endpoint.
5. The client can then authenticate with `POST /auth/login`.

## Troubleshooting

- If registration fails with an SMTP TLS error, verify that your SMTP port and `SMTP_SECURE` value match.
- If MongoDB fails to connect, confirm `MONGO_URI` is valid and reachable.
- If login fails after registration, make sure the email has been verified.

## License

This project does not currently declare a license in `package.json`.