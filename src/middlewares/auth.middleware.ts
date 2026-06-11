import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errors/app-error";
import { Role } from "../generated/prisma/enums";
import { env } from "../config/env";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "Unauthorized");
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError(401, "Unauthorized");
  }

  try {
    const jwtSecret = env.JWT_SECRET;

    const payload = jwt.verify(token, jwtSecret);

    if (typeof payload === "string") {
      throw new AppError(401, "Unauthorized");
    }

    req.user = {
      id: Number(payload.sub),
      email: String(payload.email),
      role: payload.role as Role,
    };

    next();
  } catch {
    throw new AppError(401, "Unauthorized");
  }
}
