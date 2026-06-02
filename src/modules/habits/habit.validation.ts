import { z } from "zod";

export const createHabitSchema = z.object({
  title: z.string().min(3),

  description: z.string().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
