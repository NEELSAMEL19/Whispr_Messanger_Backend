import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env["MONGO_URI"];

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown MongoDB error";
    console.error(`❌ MongoDB Error: ${message}`);
    process.exit(1);
  }
};

export default connectDB;
