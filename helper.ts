"use server";
import { db } from "~/server/db";

export const getUserByEmail = async (email: string | null | undefined) => {
  if (!email) return null;
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch {
    return null;
  }
};
