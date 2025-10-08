import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import config from "./utils/config";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import middleware from "./utils/middleware";
import usersRouter from "./controllers/users";

const app = express();

mongoose.set("strictQuery", false);

if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI, { dbName: config.MONGODB_DBNAME }).catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });
}

app.use(express.static("dist"));
app.use(express.json());
app.use(cookieParser());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;