import { Request, Response } from "express";
import {
  checkInHabit,
  createHabit,
  deleteHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
} from "./habit.service";
import { AuthRequest } from "../../middleware/auth.middleware";

interface HabitParams {
  habitId: string;
}

interface UpdateHabitBody {
  title: string;
  description: string;
}

export const createHabitController = async (req: AuthRequest, res: Response) => {
  const habit = await createHabit(req.userId!, req.body);

  res.json({
    success: true,
    habit,
  });
};

export const getAllHabitsController = async (req: AuthRequest, res: Response) => {
  const habit = await getAllHabits(req.userId!);

  res.json({
    success: true,
    habit,
  });
};

export const getHabitController = async (
  req: Request<HabitParams> & AuthRequest,
  res: Response
) => {
  const habit = await getHabitById(req.userId!, req.params.habitId!);

  res.json({
    success: true,
    habit,
  });
};

export const updateHabitController = async (
  req: Request<HabitParams, {}, UpdateHabitBody> & AuthRequest,
  res: Response
) => {
  const habit = await updateHabit(req.userId!, req.params.habitId, req.body);

  res.json({
    success: true,
    habit,
  });
};

export const deleteHabitController = async (
  req: Request<HabitParams> & AuthRequest,
  res: Response
) => {
  const habit = await deleteHabit(req.userId!, req.params.habitId);

  res.json({
    success: true,
    habit,
  });
};

export const checkInHabitController = async (
  req: Request<HabitParams> & AuthRequest,
  res: Response
) => {
  const result = await checkInHabit(req.userId!, req.params.habitId);

  res.status(200).json({
    success: true,
    data: result,
  });
};
