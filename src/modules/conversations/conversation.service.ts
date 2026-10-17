import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import {
  ConversationInput,
  ConversationMessageInput,
} from "./conversation.types";

const conversationSelect = {
  id: true,
  type: true,
  members: { select: { userId: true } },
} satisfies Prisma.ConversationSelect;

export async function createDirectConversation(
  input: ConversationInput,

  uID: string,
) {
  const userId = Number(uID);
  const recipientId = input.recipientId;

  if (recipientId === userId) {
    throw new AppError(400, "You cannot chat with yourself");
  }

  const foundRecipient = await prisma.user.findFirst({
    where: { id: recipientId, deletedAt: null },
  });

  if (!foundRecipient) throw new AppError(404, "User not found");

  const [firstId, secondId] = [userId, recipientId].sort((a, b) => a - b);
  const directKey = `${firstId}:${secondId}`;

  const existingConversation = await prisma.conversation.findUnique({
    where: {
      directKey,
    },
    select: conversationSelect,
  });

  if (existingConversation) return existingConversation;

  try {
    return await prisma.conversation.create({
      data: {
        type: "direct",
        directKey,
        members: {
          create: [{ userId }, { userId: recipientId }],
        },
      },
      select: conversationSelect,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const winner = await prisma.conversation.findUnique({
        where: { directKey },
        select: conversationSelect,
      });
      if (winner) return winner;
    }
    throw error;
  }
}

export async function sendConversationMessage(
  input: ConversationMessageInput,
  cId: string,
  uID: string,
) {
  const conversationId = Number(cId);

  const userId = Number(uID);

  if (!Number.isInteger(conversationId) || conversationId <= 0) {
    throw new AppError(400, "Invalid conversation id");
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(401, "Unauthorized");
  }

  const foundConversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { id: true },
  });

  if (!foundConversation) throw new AppError(404, "Conversation not found");

  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new AppError(403, "You are not a member of this conversation");
  }

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderId: userId,
      body: input.content,
    },
  });

  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.body,
    createdAt: message.createdAt,
  };
}
