import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  notFound,
  errorHandler,
} from "./common/middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";

const app = express();
app.set("etag", false);

const corsOrigins = [
  "https://personal-book-manager-vert.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Whispr Messanger API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
