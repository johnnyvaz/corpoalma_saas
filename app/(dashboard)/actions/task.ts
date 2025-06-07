"use server";

import { markTaskCompleted } from "@/lib/db/queries";

export async function completeTask(
  userId: number,
  weekNumber: number,
  dayNumber: number,
  notes: string
) {
  await markTaskCompleted(userId, weekNumber, dayNumber, notes);
}
