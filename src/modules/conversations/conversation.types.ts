import z from "zod";
import {
  conversationMessageSchema,
  conversationSchema,
  cursorConversationPaginationSchema,
} from "./conversation.schema";

export type ConversationInput = z.infer<typeof conversationSchema>;
export type ConversationMessageInput = z.infer<
  typeof conversationMessageSchema
>;
