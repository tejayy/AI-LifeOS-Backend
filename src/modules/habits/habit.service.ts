import { string } from "zod";
import { prisma } from "../../config/prisma";

export const createHabit = async (
  userId: string,
  data: { title: string; description?: string }
) => {
  return await prisma.habit.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getAllHabits = async (userId: string) => {
  return await prisma.habit.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getHabitById = async (userId: string, habitId: string) => {
  return prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
    include: {
      logs: true,
    },
  });
};

export const updateHabit = async (userId: string, habitId: string, data: any) => {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }
  return await prisma.habit.update({
    where: {
      id: habitId,
    },
    data,
  });
};

export const deleteHabit = async (userId: string, habitId: string) => {
  console.log(`delete:${habitId}`);
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  // await prisma.habitLog.deleteMany({
  //   where: {
  //     habitId,
  //   },
  // });

  return await prisma.habit.delete({
    where: {
      id: habitId,
    },
  });
};

export const checkInHabit = async (userId: string, habitId: string) => {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingLog = await prisma.habitLog.findFirst({
    where: {
      habitId,
      date: today,
    },
  });

  if (existingLog) throw new Error("Already completed today");
  await prisma.habitLog.create({
    data: {
      habitId,
      date: today,
    },
  });

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const currentStreak = logs.length + 1;

  return await prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      currentStreak,
      longestStreak: Math.max(habit.longestStreak, currentStreak),
    },
  });
};
