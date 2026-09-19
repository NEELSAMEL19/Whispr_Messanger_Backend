import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./app.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { registerMessageSocket } from "./modules/messages/message.socket.js";

const PORT = Number(process.env["PORT"]) || 3030;
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ["https://personal-book-manager-vert.vercel.app", "http://localhost:3000"],
		credentials: true,
	},
});
registerMessageSocket(io);

const startServer = async () => {
	await connectDB();
	httpServer.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

startServer().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : "Unknown startup error";
	console.error(`❌ Server startup failed: ${message}`);
	process.exit(1);
});
