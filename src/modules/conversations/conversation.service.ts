import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { Prisma } from "../../generated/prisma/client";
import { ConversationInput } from "./conversation.types";

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
