import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Support both cookie and Authorization header (for Postman)
    let token = req.cookies.accessToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "Server Error",
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
