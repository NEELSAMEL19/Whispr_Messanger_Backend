import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  searchUsers,
} from "./auth.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.get("/users", protect, searchUsers);

export default router;
