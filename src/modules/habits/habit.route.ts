import { Router } from "express";
import {
  checkInHabitController,
  createHabitController,
  deleteHabitController,
  getAllHabitsController,
  getHabitController,
  updateHabitController,
} from "./habit.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", getAllHabitsController);

router.post("/", createHabitController);

router.get("/:habitId", protect, getHabitController);

router.patch("/:habitId", protect, updateHabitController);

router.delete("/:habitId", protect, deleteHabitController);

router.post("/:habitId/check-in", protect, checkInHabitController);

export default router;
