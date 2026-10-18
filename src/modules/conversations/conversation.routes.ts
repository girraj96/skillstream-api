import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  createDirectConversationHandler,
  getConversationMessagesHandler,
  sendConversationMessageHandler,
} from "./conversation.controller";

export const conversationRouter = Router();

conversationRouter.post(
  "/conversations/direct",
  authMiddleware,
  createDirectConversationHandler,
);

conversationRouter.post(
  "/conversations/:conversationId/messages",
  authMiddleware,
  sendConversationMessageHandler,
);

conversationRouter.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  getConversationMessagesHandler,
);
