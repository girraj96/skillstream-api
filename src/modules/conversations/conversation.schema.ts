import { z } from "zod";

export const conversationSchema = z.object({
  recipientId: z.coerce.number().int().positive(),
});

export const conversationMessageSchema = z
  .object({
    content: z.string().trim().min(1).max(5000),
  })
  .strict();

export const cursorConversationPaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  cursor: z.coerce.number().int().positive().optional(),
});
