import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = Number(process.env["PORT"]) || 3030;

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

startServer().catch((error: unknown) => {
	const message = error instanceof Error ? error.message : "Unknown startup error";
	console.error(`❌ Server startup failed: ${message}`);
	process.exit(1);
});
