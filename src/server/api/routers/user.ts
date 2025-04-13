import { z } from "zod";
import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "../trpc";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { signIn } from "~/server/auth";
import { AuthError } from "next-auth";

export const userRouter = createTRPCRouter({
  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    }),

  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }),

  login: publicProcedure
    .input(
      z.object({
        provider: z.enum(["google", "credentials"]),
        email: z
          .string()
          .email({
            message: "Invalid email format.",
          })
          .optional(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.provider === "credentials") {
        const existingUser = await ctx.db.user.findUnique({
          where: {
            email: input.email,
          },
        });

        if (!existingUser?.email || !existingUser?.password) {
          throw new Error("Invalid Credentials!");
        }

        if (!existingUser.emailVerified) {
          return { error: existingUser.email };
        }
        try {
          await signIn(input.provider, {
            email: input.email,
            password: input.password,
            redirect: false,
          });
          return { success: "Login successful" };
        } catch (error) {
          if (error instanceof AuthError) {
            switch (error.type) {
              case "CredentialsSignin":
                throw new Error("Invalid Credentials!");
              default:
                throw new Error("Something went wrong!");
            }
          }
          throw error;
        }
      } else if (input.provider === "google") {
        try {
          await signIn(input.provider, { redirect: false });
          return { success: "Login successful" };
        } catch (error) {
          if (error instanceof AuthError) {
            switch (error.type) {
              case "CredentialsSignin":
                throw new Error("Invalid Credentials!");
              default:
                throw new Error("Something went wrong!");
            }
          }
          throw error;
        }
      }
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

      const user = await db.user.create({
        data: {
          name: input.name,
          email: input.email,
          emailVerified: null,
          password: hashedPassword,
          image: null,
        },
      });
      return user;
    }),
});
