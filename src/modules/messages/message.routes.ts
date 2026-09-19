import express from "express";
import { protect } from "../../common/middlewares/auth.middleware.js";
import {
  deleteMessage,
  deleteConversation,
  editMessage,
  getConversations,
  getConversation,
  markConversationRead,
  sendMessage,
} from "./message.controller.js";

const router = express.Router();

router.use(protect);
router.get("/conversations", getConversations);
router.delete("/:userId", deleteConversation);
router.get("/:userId", getConversation);
router.post("/:userId", sendMessage);
router.patch("/:userId/read", markConversationRead);
router.patch("/message/:messageId", editMessage);
router.delete("/message/:messageId", deleteMessage);

export default router;