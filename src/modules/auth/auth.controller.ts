import type { Request, Response } from "express";
import asyncHandler from "../../common/utils/asyncHandler.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import AppError from "../../common/utils/AppError.js";
import {
  registerUserService,
  loginUserService,
  getUserProfileService,
} from "./auth.service.js";

const isProduction = process.env["NODE_ENV"] === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

interface AuthRequest extends Request {
  user?: {
    _id: string;
  };
}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 400);

  const result = await registerUserService({ ...parsed.data });

  res.cookie("token", result.token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result.user,
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(parsed.error.issues[0]?.message ?? "Invalid input", 400);

  const result = await loginUserService(parsed.data);

  res.cookie("token", result.token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result.user,
  });
});

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getUserProfileService(req.user?._id ?? "");

  res.status(200).json({
    success: true,
    message: "Authenticated user fetched successfully",
    data: user,
  });
});

export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
