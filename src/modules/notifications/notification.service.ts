import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import { CursorPaginationMap } from "../../utils/types";

const notificationSelect = {
  id: true,
  type: true,
  readAt: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
} satisfies Prisma.NotificationSelect;

export async function getNotifications(
  input: CursorPaginationMap,
  uID: string,
) {
  const where: Prisma.NotificationWhereInput = {
    userId: Number(uID),
  };

  if (input.cursor) {
    where.id = {
      lt: input.cursor,
    };
  }

  const notifications = await prisma.notification.findMany({
    where,
    take: input.limit + 1,
    orderBy: {
      id: "desc",
    },
    select: notificationSelect,
  });

  const hasNextPage = notifications.length > input.limit;
  const pageNotifications = hasNextPage
    ? notifications.slice(0, input.limit)
    : notifications;

  const nextCursor = hasNextPage
    ? pageNotifications[pageNotifications.length - 1].id
    : null;
  return {
    data: pageNotifications,
    meta: {
      ...input,
      nextCursor: nextCursor,
    },
  };
}

export async function readNotification(nId: string, uId: string) {
  const notificationId = Number(nId);
  const userId = Number(uId);

  if (Number.isNaN(notificationId) || Number.isNaN(userId)) {
    throw new AppError(400, "Invalid notification id");
  }

  const notificationFound = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
    select: {
      id: true,
    },
  });

  if (!notificationFound) {
    throw new AppError(404, "Notification not found");
  }

  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
    select: notificationSelect,
  });

  return {
    data: notification,
  };
}

export async function unReadNotificationCount(uId: string) {
  const userId = Number(uId);

  if (Number.isNaN(userId)) {
    throw new AppError(400, "Invalid notification id");
  }

  const notificationCount = await prisma.notification.count({
    where: { userId, readAt: null },
  });

  return {
    data: {
      unreadCount: notificationCount,
    },
  };
}
