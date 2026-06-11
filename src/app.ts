import express from "express";
import helmet from "helmet";
import cors from "cors";
import { userRouter } from "./modules/users/user.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { requestLogger } from "./middlewares/request-logger.middleware";

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (req, res, next) => {
    res.send({
      status: "ok",
      service: "skillstream-api",
    });
  });
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use(errorHandler);

  return app;
}
