import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { getChatCompletion } from "~/server/ollama/chat";

export const messageRouter = createTRPCRouter({
  // Save a new message (from user or bot)
  saveMessage: protectedProcedure
    .input(
      z.object({
        sender: z.enum(["user", "bot"]),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) throw new Error("User not authenticated");

      const message = await db.message.create({
        data: {
          userId: userId as string,
          sender: input.sender,
          content: input.content,
        },
      });

      return message;
    }),

  // Get recent messages
  getRecentMessages: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return db.message.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50, // Adjust this number as needed
    });
  }),
});
