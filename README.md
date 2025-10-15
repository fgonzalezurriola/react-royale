# React Royale

Website for hosting and participating in UI hackatons.

## Run

Run the db and the backend with

```sh
cd backend
npm i
# Run the db (docker compose)
npm run db
# Run the backend
npm run dev
```

Run the frontend in another terminal with

```sh
cd frontend
npm i
# Run the frontend
npm run dev
```

## Stopping the db

```sh
cd backend
npm run db:stop
```

## Deleting the db

```sh
cd backend
npm run db:stop:full
```

## Env variables in backend/.env

PORT: Port where the backend will run (default: 4000)
HOST: Host where the backend will run (default: localhost)
JWT_SECRET: Secret key for signing JWT tokens (default: my_secret)

MONGODB_URI: MongoDB connection string (default: mongodb://localhost:27017)
MONGODB_DBNAME: MongoDB database name (default: prod)

TEST_MONGODB_URI: MongoDB connection string for tests (default: mongodb://localhost:27017)
TEST_MONGODB_DBNAME: MongoDB database name for tests (default: test)

FRONTEND_URL: URL of the frontend (default: http://localhost:5173)
CORS_ORIGINS: Comma-separated list of allowed CORS origins (default: http://localhost:5173)
