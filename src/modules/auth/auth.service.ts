import "dotenv/config";
import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { toUserResponse } from "../users/user.mapper";
import { ChangePassword, LoginUser } from "./auth.types";
import argon2 from "argon2";
import jwt, { SignOptions } from "jsonwebtoken";

export async function loginUser(input: LoginUser) {
  const foundUser = await prisma.user.findFirst({
    where: { email: input.email, deletedAt: null },
  });
  if (!foundUser) throw new AppError(401, "Invalid email or password");
  const verify = await argon2.verify(foundUser.passwordHash, input.password);

  if (!verify) throw new AppError(401, "Invalid email or password");

  let mappedUser = toUserResponse(foundUser);

  const payload = {
    sub: foundUser.id,
    email: foundUser.email,
    role: foundUser.role,
  };
  const jwtSecret = process.env.JWT_SECRET || "super-secret-for-local-learning";
  const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ||
    "1h") as SignOptions["expiresIn"];

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  return { user: mappedUser, accessToken: token };
}

export async function changePassword(input: ChangePassword, id: string) {
  const userId = Number(id);

  if (isNaN(userId)) throw new AppError(400, "Invalid user id");
  const foundUser = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });

  if (!foundUser) throw new AppError(404, "User not found");

  const verify = await argon2.verify(
    foundUser.passwordHash,
    input.currentPassword,
  );

  if (!verify) throw new AppError(401, "Invalid current password");

  const passwordHash = await argon2.hash(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: passwordHash,
    },
  });
  return {
    message: "Password changed successfully",
  };
}
