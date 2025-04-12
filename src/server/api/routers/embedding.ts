// /server/api/routers/embedding.ts
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";
import { getEmbedding } from "~/server/ollama/embed";
import pLimit from "p-limit";

export const embeddingRouter = createTRPCRouter({
  processClientText: protectedProcedure
    .input(
      z.object({
        rawText: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const file = await db.file.findFirst({
        where: { userId },
        orderBy: { uploadedAt: "desc" },
      });
      if (!file) throw new Error("No file found");

      const chunks = splitTextIntoChunks(input.rawText, 500);

      const limit = pLimit(5);
      await Promise.all(
        chunks.map((chunk) =>
          limit(async () => {
            const vector = await getEmbedding(chunk);
            await db.embeddingChunk.create({
              data: { fileId: file.id, chunk, vector },
            });
          }),
        ),
      );

      await db.file.update({
        where: { id: file.id },
        data: { isProcessed: true },
      });

      return { success: true, chunkCount: chunks.length };
    }),
});

function splitTextIntoChunks(text: string, maxLength: number): string[] {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      chunks.push(current);
      current = sentence;
    } else {
      current += " " + sentence;
    }
  }
  if (current.trim().length > 0) chunks.push(current);
  return chunks;
}
