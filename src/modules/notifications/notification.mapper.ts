import type { NotificationType, Role } from "../../generated/prisma/client";

type NotificationForResponse = {
  id: number;
  type: NotificationType;
  videoId: number | null;
  commentId: number | null;
  readAt: Date | null;
  createdAt: Date;
  actor: {
    id: number;
    name: string | null;
    role: Role;
  };
};

export function toNotificationResponse(notification: NotificationForResponse) {
  return {
    id: notification.id,
    type: notification.type,
    actor: notification.actor,
    target: {
      videoId: notification.videoId,
      commentId: notification.commentId,
    },
    message: buildNotificationMessage(notification),
    actionUrl: buildNotificationActionUrl(notification),
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  };
}

function buildNotificationMessage(notification: NotificationForResponse) {
  const actorName = notification.actor.name ?? "Someone";

  if (notification.type === "follow") {
    return `${actorName} started following you`;
  }

  if (notification.type === "comment") {
    return `${actorName} commented on your video`;
  }

  return "You have a new notification";
}

function buildNotificationActionUrl(notification: NotificationForResponse) {
  if (notification.type === "comment" && notification.videoId) {
    const commentQuery = notification.commentId
      ? `?commentId=${notification.commentId}`
      : "";

    return `/videos/${notification.videoId}${commentQuery}`;
  }

  if (notification.type === "follow") {
    return `/users/${notification.actor.id}`;
  }

  return null;
}
