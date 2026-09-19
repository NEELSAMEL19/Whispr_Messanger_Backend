import mongoose from "mongoose";
import type { Request, Response } from "express";
import asyncHandler from "../../common/utils/asyncHandler.js";
import AppError from "../../common/utils/AppError.js";
import { Message } from "../../models/Message.js";
import User from "../../models/User.js";

interface AuthRequest extends Request {
  user?: { _id: mongoose.Types.ObjectId };
}

const getUserId = (req: AuthRequest) => {
  const userId = req.user?._id?.toString();
  if (!userId) throw new AppError("Authentication required", 401);
  return userId;
};

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);
const getParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export const getConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const currentUserId = getUserId(req);
  const otherUserId = getParam(req.params["userId"]);
  const page = Math.max(Number(req.query["page"]) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query["limit"]) || 30, 1), 100);

  if (!otherUserId || !isValidId(otherUserId)) throw new AppError("Invalid user id", 400);

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  res.json({
    success: true,
    data: messages.reverse(),
    pagination: { page, limit, hasMore: messages.length === limit },
  });
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const senderId = getUserId(req);
  const receiverId = getParam(req.params["userId"]);
  const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";

  if (!receiverId || !isValidId(receiverId)) throw new AppError("Invalid user id", 400);
  if (!content || content.length > 5000) {
    throw new AppError("Message must contain between 1 and 5000 characters", 400);
  }
  if (senderId === receiverId) throw new AppError("You cannot message yourself", 400);
  if (!(await User.exists({ _id: receiverId }))) throw new AppError("Receiver not found", 404);

  const message = await Message.create({ sender: senderId, receiver: receiverId, content });
  res.status(201).json({ success: true, data: message });
});

export const editMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  const messageId = getParam(req.params["messageId"]);
  const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";

  if (!messageId || !isValidId(messageId)) throw new AppError("Invalid message id", 400);
  if (!content || content.length > 5000) throw new AppError("Invalid message content", 400);

  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: userId, deletedAt: { $exists: false } },
    { content, editedAt: new Date() },
    { new: true, runValidators: true },
  );
  if (!message) throw new AppError("Message not found or cannot be edited", 404);
  res.json({ success: true, data: message });
});

export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  const messageId = getParam(req.params["messageId"]);
  if (!messageId || !isValidId(messageId)) throw new AppError("Invalid message id", 400);

  const message = await Message.findOneAndUpdate(
    { _id: messageId, sender: userId, deletedAt: { $exists: false } },
    { content: "", deletedAt: new Date() },
    { new: true },
  );
  if (!message) throw new AppError("Message not found or cannot be deleted", 404);
  res.json({ success: true, data: message });
});

export const markConversationRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = getUserId(req);
  const senderId = getParam(req.params["userId"]);
  if (!senderId || !isValidId(senderId)) throw new AppError("Invalid user id", 400);

  await Message.updateMany(
    { sender: senderId, receiver: userId, status: { $ne: "read" } },
    { status: "read", readAt: new Date(), deliveredAt: new Date() },
  );
  res.json({ success: true, message: "Conversation marked as read" });
});