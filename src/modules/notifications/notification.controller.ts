import { Request, Response } from "express";
import AppError from "../../errors/app-error";
import {
  getNotifications,
  readNotification,
  unReadNotificationCount,
} from "./notification.service";
import z from "zod";
import { cursorPaginationSchema } from "../../utils/schema";

export async function getNotificationsHandler(req: Request, res: Response) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const result = cursorPaginationSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getNotifications(result.data, String(req.user.id));
  return res.status(200).json(response);
}

export async function readNotificationHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await readNotification(req.params.id, String(req.user.id));
  return res.status(200).json(response);
}

export async function unreadNotificationCountHandler(
  req: Request,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");

  const response = await unReadNotificationCount(String(req.user.id));
  return res.status(200).json(response);
}
