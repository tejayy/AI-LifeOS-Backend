import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;

  return jwt.sign(
    {
      userId,
    },
    accessSecret!,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (userId: string) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  return jwt.sign(
    {
      userId,
    },
    refreshSecret!,
    {
      expiresIn: "7d",
    }
  );
};
