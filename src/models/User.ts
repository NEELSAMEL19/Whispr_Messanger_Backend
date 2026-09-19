import mongoose, { type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  isOnline: boolean;
  lastSeenAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: { type: String, required: true, minlength: 6 },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeenAt: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);

export default User;
