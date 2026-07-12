import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getNotificationsHandler,
  readAllNotificationHandler,
  readNotificationHandler,
  unreadNotificationCountHandler,
} from "./notification.controller";

export const notificationRouter = Router();

notificationRouter.get(
  "/notifications",
  authMiddleware,
  getNotificationsHandler,
);
notificationRouter.get(
  "/notifications/unread-count",
  authMiddleware,
  unreadNotificationCountHandler,
);
notificationRouter.patch(
  "/notifications/read-all",
  authMiddleware,
  readAllNotificationHandler,
);

notificationRouter.patch(
  "/notifications/:id/read",
  authMiddleware,
  readNotificationHandler,
);
