/*
  Warnings:

  - You are about to drop the column `streak` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `HabitLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[habitId,date]` on the table `HabitLog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "streak",
ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "HabitLog" DROP COLUMN "completed";

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");
