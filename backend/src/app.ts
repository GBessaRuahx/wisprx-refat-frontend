import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";
import { messageQueue, sendScheduledMessages } from "./queues";
import bodyParser from 'body-parser';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

app.set("queues", {
  messageQueue,
  sendScheduledMessages
});

app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
  })
);
app.use(cookieParser());
app.use(Sentry.Handlers.requestHandler());

app.use("/public", express.static(uploadConfig.directory));
app.use(routes);

import isAuth from "./middleware/isAuth";
import isSuper from "./middleware/isSuper";

import bullBoardAdapter from "./admin/panels/bull-board";
import queueDash from "./admin/panels/queueDash";

bullBoardAdapter.setBasePath("/admin/queues");

app.use("/admin/queues", isAuth, isSuper, bullBoardAdapter.getRouter());
app.use("/admin/queuedash", isAuth, isSuper, queueDash);

app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "ERR_INTERNAL_SERVER_ERROR" });
});

export default app;
