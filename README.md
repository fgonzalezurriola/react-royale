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
