import "dotenv/config";
import { prisma } from "../../db/prisma";
import AppError from "../../errors/app-error";
import { toUserResponse } from "../users/user.mapper";
import { LoginUser } from "./auth.types";
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
