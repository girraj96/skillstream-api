import { ChatMessage } from "../../generated/prisma/client";

type ConversationMessageRecord = Pick<
  ChatMessage,
  "id" | "body" | "senderId" | "createdAt"
>;

export const toConversationResponse = (message: ConversationMessageRecord) => ({
  id: message.id,
  content: message.body,
  senderId: message.senderId,
  createdAt: message.createdAt,
});
