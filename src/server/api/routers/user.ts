import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),

  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().nullable(),
        email: z.string().email().nullable(),
        password: z.string().min(6).optional(),
        googleId: z.string().optional(),
        provider: z.enum(["google", "credentials"]),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        if (!input.email || !input.password) {
          throw new Error(
            "Email and password are required for credentials signup.",
          );
        }

        const existingUser = await db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new Error("User with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Create new user with credentials
        return await db.user.create({
          data: {
            name: input.name,
            email: input.email,
            emailVerified: null,
            password: hashedPassword,
            image: null,
          },
        });
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user.");
      }
    }),
});
