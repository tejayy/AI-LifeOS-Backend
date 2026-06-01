import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      succes: true,
      message: "User Register",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "User  Logged out ",
  });
};

export const profile = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  res.json({ user });
};
