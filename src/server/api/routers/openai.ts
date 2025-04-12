import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getEmbedding } from "~/server/ollama/embed";
import { getChatCompletion } from "~/server/ollama/chat";
import { db } from "~/server/db";
import { cosineSimilarity } from "~/server/utils/cosineSimilarity";

export const openaiRouter = createTRPCRouter({
  askQuestion: protectedProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const file = await db.file.findFirst({
        where: { userId },
      });

      const embedding = await getEmbedding(input.question);

      if (!file) {
        const fallbackMessages = [
          {
            role: "system" as const,
            content:
              "You are only allowed to chat like normal people, short answers only!",
          },
          { role: "user" as const, content: input.question },
        ];

        const casualResponse = await getChatCompletion(fallbackMessages);
        return { answer: casualResponse };
      }

      const chunks = await db.embeddingChunk.findMany({
        where: { fileId: file.id },
      });

      const topChunks = chunks
        .filter(
          (chunk) =>
            Array.isArray(chunk.vector) &&
            chunk.vector.length === embedding.length,
        )
        .map((chunk) => ({
          ...chunk,
          score: cosineSimilarity(chunk.vector as number[], embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      const promptContext = topChunks.map((c) => c.chunk).join("\n---\n");

      const messages = [
        {
          role: "system" as const,
          content:
            "You are a helpful assistant. Answer based only on the following content:",
        },
        {
          role: "user" as const,
          content: `CONTENT:\n${promptContext}\n\nQUESTION: ${input.question}`,
        },
      ];

      const answer = await getChatCompletion(messages);

      return { answer };
    }),
});
