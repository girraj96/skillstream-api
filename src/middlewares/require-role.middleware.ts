import { NextFunction, Request, Response } from "express";

import { Role } from "../generated/prisma/enums";
import AppError from "../errors/app-error";

export function requireRole(...roles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden");
    }

    next();
  };
}
