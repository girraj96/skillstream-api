import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getNotificationsHandler,
  readNotificationHandler,
} from "./notification.controller";

export const notificationRouter = Router();

notificationRouter.get(
  "/notifications",
  authMiddleware,
  getNotificationsHandler,
);
notificationRouter.patch(
  "/notifications/:id/read",
  authMiddleware,
  readNotificationHandler,
);
