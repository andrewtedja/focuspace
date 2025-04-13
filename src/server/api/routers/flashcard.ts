import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db"; // make sure this matches your db import

export const flashcardRouter = createTRPCRouter({
  getFlashcardsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const flashcards = await db.flashcard.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return flashcards;
  }),
});
