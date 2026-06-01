import dotenv from "dotenv";

// Load environment variables before anything else
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./config/prisma";
import authRoute from "./routes/auth.routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);

//DB Connection
app.get("/", async (_, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
