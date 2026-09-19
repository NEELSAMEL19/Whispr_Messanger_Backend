import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env["MONGO_URI"];

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: Number(process.env["MONGO_MAX_POOL_SIZE"]) || 100,
      minPoolSize: Number(process.env["MONGO_MIN_POOL_SIZE"]) || 10,
      serverSelectionTimeoutMS: Number(process.env["MONGO_SERVER_SELECTION_TIMEOUT_MS"]) || 5000,
      socketTimeoutMS: Number(process.env["MONGO_SOCKET_TIMEOUT_MS"]) || 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown MongoDB error";
    console.error(`❌ MongoDB Error: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
