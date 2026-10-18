import { Request, Response } from "express";
import z from "zod";
import AppError from "../../errors/app-error";
import {
  conversationMessageSchema,
  conversationSchema,
  cursorConversationPaginationSchema,
} from "./conversation.schema";
import {
  createDirectConversation,
  getConversationMessages,
  sendConversationMessage,
} from "./conversation.service";

export async function createDirectConversationHandler(
  req: Request,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = conversationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await createDirectConversation(
    result.data,
    String(req.user.id),
  );
  return res.status(200).json({
    data: response,
  });
}

export async function sendConversationMessageHandler(
  req: Request<{ conversationId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = conversationMessageSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await sendConversationMessage(
    result.data,
    req.params.conversationId,
    String(req.user.id),
  );
  return res.status(201).json({
    data: response,
  });
}

export async function getConversationMessagesHandler(
  req: Request<{ conversationId: string }>,
  res: Response,
) {
  if (!req.user) throw new AppError(401, "Unauthorized");
  const result = cursorConversationPaginationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: z.treeifyError(result.error),
    });
  }

  const response = await getConversationMessages(
    result.data,
    req.params.conversationId,
    String(req.user.id),
  );
  return res.status(200).json(response);
}
