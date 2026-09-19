import User from "../../models/User.js";
import generateToken from "../../common/utils/generateToken.js";
import AppError from "../../common/utils/AppError.js";
import bcrypt from "bcryptjs";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUserService = async ({ name, email, password, phone }: RegisterPayload) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new AppError("User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  return {
    token: generateToken(String(user._id)),
    user: {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
};

export const loginUserService = async ({ email, password }: LoginPayload) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Please register", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Password not matched", 401);

  return {
    token: generateToken(String(user._id)),
    user: {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
};

export const getUserProfileService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const searchUsersService = async (currentUserId: string, query: string) => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter = {
    _id: { $ne: currentUserId },
    phone: { $regex: escapedQuery, $options: "i" },
  };

  return User.find(filter)
    .select("name email phone avatar isOnline lastSeenAt")
    .sort({ name: 1 })
    .limit(50)
    .lean();
};
