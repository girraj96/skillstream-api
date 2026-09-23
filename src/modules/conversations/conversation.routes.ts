import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { createDirectConversationHandler } from "./conversation.controller";

export const conversationRouter = Router();

conversationRouter.post(
  "/conversations/direct",
  authMiddleware,
  createDirectConversationHandler,
);
