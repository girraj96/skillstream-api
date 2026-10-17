import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import {
  createDirectConversationHandler,
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
