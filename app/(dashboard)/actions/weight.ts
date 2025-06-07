"use server";

import { addWeightRecord } from "@/lib/db/queries";

export async function addWeight(userId: number, weight: number, currentWeek: number) {
  await addWeightRecord(userId, weight, currentWeek);
}
