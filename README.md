# Drift Detailers

1. [About](#about)
2. [Tech stack](#tech-stack)
3. [Project setup](#project-setup)
4. [Project management](#project-management)

## About

Service project for Drift Detailers

## Tech stack

- TypeScript
- ExpressJS
- NodeJS
- Prisma
- PostgreSQL
- Express Validator
- Supertest
- Jest

## Project setup

### [1] Clone repository

```sh
git@github.com:DraguaStudio/DriftdetailersService.git
```

### [2] Install all dependencies

```sh
npm ci
```

### [3] Install `PostgreSQL` on your PC

### [4] Create databases for application

On ubuntu (last tested version 24.04LTS)
```sh
createdb driftDetailers
createdb driftDetailers_test
```

### [5] Create `.env` and `.env.test.local` files in root of project

and paste to them this content:

For `.env`:
```sh
PORT=8080
ENV_MODE="local"
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/driftDetailers?schema=public"
TOKEN_KEY="abcd"
```

For `.env.test-local`:
```sh
PORT=8080
ENV_MODE="test"
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/driftDetailers_test?schema=public"
TOKEN_KEY="abcd"
```

### [6] Setup database tables

```sh
npm run prisma:generate
npm run prisma:push
npm run prisma:push:test
```

## Project management

### Development

```sh
npm start
```

### Run unit and endpoints tests

```sh
npm test
```

### Build project

```sh
npm run build:prod
npm run preview
```

### Lint project

```sh
npm run lint
```
