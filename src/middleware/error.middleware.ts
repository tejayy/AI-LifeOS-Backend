import { Request, Response, NextFunction } from "express";
import { error } from "node:console";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
};
