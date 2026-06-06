import AppError from "../../errors/app-error";
import { User } from "./user.types";
import { randomUUID } from "node:crypto";

let users: User[] = [];

export async function createUser(input: User) {
  const id = randomUUID();

  const user: User = {
    id: id,
    role: "developer",
    ...input,
  };

  users.push(user);

  return user;
}

export async function getAllUsers() {
  return users;
}

export async function getUserId(id: string) {
  const foundUser = users.find((user) => user.id === id);

  if (!foundUser) throw new AppError(404, "User not found");
  return foundUser;
}
