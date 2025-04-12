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

  // Ask a question and store both user and bot responses
  askAndSave: protectedProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!userId) throw new Error("User not authenticated");

      // Save user message
      await db.message.create({
        data: {
          userId,
          sender: "user",
          content: input.question,
        },
      });

      // Ask the bot
      const response = await getChatCompletion([
        {
          role: "user",
          content: input.question,
        },
      ]);

      // Save bot response
      const botMessage = await db.message.create({
        data: {
          userId,
          sender: "bot",
          content: response,
        },
      });

      return botMessage;
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
