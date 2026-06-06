import { UUID } from "node:crypto";

export interface User {
  id?: UUID;
  name: string;
  email: string;
  role?: string;
}
