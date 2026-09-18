import type { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError.js";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  const isAppError = err instanceof AppError;

  let statusCode = isAppError ? err.statusCode : 500;
  let message = isAppError
    ? err.message
    : "Something went wrong. Please try again later.";

  if (err && typeof err === "object" && "name" in err && err.name === "CastError") {
    statusCode = 400;
    message = "Resource not found";
  }

  if (err && typeof err === "object" && "code" in err && err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env["NODE_ENV"] === "production" ? "🥷" : err instanceof Error ? err.stack : undefined,
  });
};
