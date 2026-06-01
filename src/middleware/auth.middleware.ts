import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server Error",
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
