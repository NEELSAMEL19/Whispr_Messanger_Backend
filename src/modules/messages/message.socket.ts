import cookie from "cookie";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import type { Server, Socket } from "socket.io";
import { Message } from "../../models/Message.js";
import User from "../../models/User.js";

const roomFor = (userId: string) => `user:${userId}`;

const getSocketUserId = (socket: Socket) => {
  const token = socket.handshake.auth?.["token"] ?? cookie.parse(socket.handshake.headers.cookie ?? "")["token"];
  const secret = process.env["JWT_SECRET"];
  if (typeof token !== "string" || !secret) throw new Error("Unauthorized socket connection");
  const decoded = jwt.verify(token, secret) as { id?: string };
  if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) throw new Error("Unauthorized socket connection");
  return decoded.id;
};

export const registerMessageSocket = (io: Server) => {
  io.use((socket, next) => {
    try {
      socket.data.userId = getSocketUserId(socket);
      next();
    } catch {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(roomFor(userId));
    void User.findByIdAndUpdate(userId, { isOnline: true });
    socket.broadcast.emit("user_online", { userId });
    void Message.find({
      receiver: userId,
      status: "sent",
      hiddenFor: { $ne: new mongoose.Types.ObjectId(userId) },
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean()
      .then((messages) => socket.emit("pending_messages", messages));

    socket.on("send_message", async (payload: { receiverId?: string; content?: string }, callback?: (result: unknown) => void) => {
      try {
        const receiverId = payload.receiverId;
        const content = payload.content?.trim();
        if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId) || !content || content.length > 5000) {
          throw new Error("Invalid message payload");
        }
        if (receiverId === userId) throw new Error("You cannot message yourself");
        if (!(await User.exists({ _id: receiverId }))) throw new Error("Receiver not found");
        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content,
          status: "sent",
        });
        const data = message.toObject();
        io.to(roomFor(userId)).to(roomFor(receiverId)).emit("new_message", data);
        callback?.({ success: true, data });
      } catch (error) {
        callback?.({ success: false, message: error instanceof Error ? error.message : "Unable to send message" });
      }
    });

    socket.on("mark_delivered", async (messageId: string) => {
      if (!mongoose.Types.ObjectId.isValid(messageId)) return;
      const message = await Message.findOneAndUpdate(
        { _id: messageId, receiver: userId, status: "sent" },
        { status: "delivered", deliveredAt: new Date() },
        { new: true },
      ).lean();
      if (message) io.to(roomFor(message.sender.toString())).emit("message_delivered", { messageId });
    });

    socket.on("typing", (receiverId: string) => {
      if (mongoose.Types.ObjectId.isValid(receiverId)) io.to(roomFor(receiverId)).emit("user_typing", { userId });
    });

    socket.on("stop_typing", (receiverId: string) => {
      if (mongoose.Types.ObjectId.isValid(receiverId)) io.to(roomFor(receiverId)).emit("user_stopped_typing", { userId });
    });

    socket.on("mark_read", async (messageId: string) => {
      if (!mongoose.Types.ObjectId.isValid(messageId)) return;
      const message = await Message.findOneAndUpdate(
        { _id: messageId, receiver: userId },
        { status: "read", readAt: new Date(), deliveredAt: new Date() },
        { new: true },
      ).lean();
      if (message) io.to(roomFor(message.sender.toString())).emit("message_read", { messageId, readAt: message.readAt });
    });

    socket.on("disconnect", async () => {
      const remainingSockets = await io.in(roomFor(userId)).fetchSockets();
      if (remainingSockets.length > 0) return;
      const lastSeenAt = new Date();
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeenAt });
      socket.broadcast.emit("user_offline", { userId, lastSeenAt });
    });
  });
};