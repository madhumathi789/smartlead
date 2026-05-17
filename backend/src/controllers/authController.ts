import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { createError } from "../middleware/errorHandler";

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");

  return jwt.sign({ id }, secret, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError("Email already registered", 400));
    }

    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(createError("Registration failed", 500));
  }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError("Email and password required", 400));
    }

    const user = await User.findOne({ email }).select('+password') // ← fix here

    if (!user) {
      return next(createError("Invalid credentials", 401));
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(createError("Invalid credentials", 401));
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(createError("Login failed", 500));
  }
};