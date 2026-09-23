import z from "zod";
import {
  conversationSchema,
  cursorConversationPaginationSchema,
} from "./conversation.schema";

export type ConversationInput = z.infer<typeof conversationSchema>;
export type CursorConversationPaginationInput = z.infer<
  typeof cursorConversationPaginationSchema
>;
