import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { type IUser } from "../../models/User.js";
import AppError from "../utils/AppError.js";

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.["token"];

    if (!token) {
      return next(new AppError("No token provided. Please login first.", 401));
    }

    const secret = process.env["JWT_SECRET"];
    if (!secret) {
      return next(new AppError("JWT_SECRET is not configured", 500));
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User not found. Please login again.", 401));
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please login again.", 401));
    }
    if (err instanceof Error && err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    return next(err);
  }
};
