import { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const isoTimestamp = new Date().toISOString();

    console.log(
      `[${isoTimestamp}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
};
