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
  getFlashcards: protectedProcedure
    .output(
      z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      ),
    )
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const file = await db.file.findFirst({
        where: { userId, isProcessed: true },
      });

      if (!file) throw new Error("No processed file found.");

      const allChunks = await db.embeddingChunk.findMany({
        where: { fileId: file.id },
        orderBy: { id: "asc" }, // or use createdAt or index if available
      });

      const totalChunks = allChunks.length;
      let contextText;

      if (totalChunks > 100) {
        const step = Math.floor(totalChunks / 20) || 1;

        const selectedChunks = Array.from({ length: 20 }, (_, i) => {
          const index = i * step;
          return allChunks[Math.min(index, totalChunks - 1)];
        });

        contextText = selectedChunks
          .map((c) => c?.chunk ?? "")
          .filter((chunk) => chunk.trim() !== "")
          .join("\n---\n");
      } else {
        contextText = allChunks
          .map((c) => c?.chunk ?? "")
          .filter((chunk) => chunk.trim() !== "")
          .join("\n---\n");
      }

      const prompt = `You're a teaching assistant. Generate 20 flashcard-style question and answer pairs based on the following content:\n\n${contextText}\n\nFormat:\nQ1: ...\nA1: ...\nQ2: ...\nA2: ...\n... up to Q20/A20`;

      const result = await getChatCompletion([
        { role: "user", content: prompt },
      ]);

      const pairs: { question: string; answer: string }[] = [];
      const qaMatches = result.match(
        /Q\d+:\s*([\s\S]+?)A\d+:\s*([\s\S]+?)(?=Q\d+:|$)/g,
      );

      if (qaMatches) {
        for (const block of qaMatches) {
          const qMatch = block.match(/Q\d+:\s*([\s\S]+?)A\d+:/);
          const aMatch = block.match(/A\d+:\s*([\s\S]+)/);

          if (qMatch?.[1] && aMatch?.[1]) {
            pairs.push({
              question: qMatch[1].trim(),
              answer: aMatch[1].trim(),
            });
          }
        }
      }

      return pairs;
    }),
});
