import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import { generateToken } from "../utils/generateToken";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";
import jwt from "jsonwebtoken";

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

    // const token = generateToken(user.id);
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
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
  const user = req.body;
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: null,
    },
  });

  res.clearCookie("accessToken");

  res.clearCookie("refreshToken");

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

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "No refresh token",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user || user.refreshToken !== token) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const newAccessToken = generateAccessToken(user.id);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 15 * 60 * 1000,
  });

  res.json({
    success: true,
  });
};
