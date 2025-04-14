import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getEmbedding } from "~/server/ollama/embed";
import { getChatCompletion } from "~/server/ollama/chat";
import { db } from "~/server/db";
import { cosineSimilarity } from "~/server/utils/cosineSimilarity";

export const openaiRouter = createTRPCRouter({
  askQuestion: protectedProcedure
    .input(z.object({ question: z.string(), pdfMode: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const file = await db.file.findFirst({
        where: { userId },
      });

      /**
       * MODE 1: No file => Remember the last 20 messages
       */
      if (!input.pdfMode || !file) {
        const previousMessages = await db.message.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 20,
        });

        previousMessages.pop();

        const formattedHistory = previousMessages
          .reverse()
          .map((msg) => `${msg.sender.toUpperCase()}: ${msg.content}`)
          .join("\n");

        const messages: {
          role: "user" | "assistant" | "system";
          content: string;
        }[] = [
          {
            role: "system" as const,
            content: `You are the BOT. Answer the last message with the previous messages as the context and answer shortly. \n\PREVIOUS MESSAGES CONTEXT:\n${formattedHistory}`,
          },
          {
            role: "user" as const,
            content: input.question,
          },
        ];

        const answer = await getChatCompletion(messages, 0.7);
        return { answer };
      }

      /**
       * MODE 2: File exists => Use PDF chunk embeddings only
       */
      // Get embedding for the user’s new question
      const embedding = await getEmbedding(input.question);

      // Retrieve the file’s chunks
      const chunks = await db.embeddingChunk.findMany({
        where: { fileId: file.id },
      });

      let contextBlock = "";
      if (chunks.length > 0) {
        const validChunks = chunks.filter(
          (chunk) =>
            Array.isArray(chunk.vector) &&
            chunk.vector.length === embedding.length,
        );

        const scoredChunks = validChunks.map((chunk) => ({
          ...chunk,
          score: cosineSimilarity(chunk.vector as number[], embedding),
        }));

        const topChunks = scoredChunks
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        contextBlock = topChunks.map((c) => c.chunk).join("\n---\n");
      }

      const messages = [
        {
          role: "system" as const,
          content: `You are a helpful assistant. Use only the PDF context below to answer the user’s question.\n\nPDF CONTEXT:\n${contextBlock}`,
        },
        {
          role: "user" as const,
          content: input.question,
        },
      ];

      const answer = await getChatCompletion(messages, 0.3);
      return { answer };
    }),
  getFlashcards: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    if (!userId) throw new Error("User not authenticated");

    const file = await db.file.findFirst({
      where: { userId, isProcessed: true },
    });

    if (!file) throw new Error("No processed file found.");

    const allChunks = await db.embeddingChunk.findMany({
      where: { fileId: file.id },
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

    const result = await getChatCompletion(
      [{ role: "user", content: prompt }],
      0.0,
    );

    const pairs: { question: string; answer: string }[] = [];
    const qaMatches = result.match(
      /Q\d+:\s*([\s\S]+?)A\d+:\s*([\s\S]+?)(?=Q\d+:|$)/g,
    );

    if (qaMatches) {
      for (const block of qaMatches) {
        const qRegex = /Q\d+:\s*([\s\S]+?)A\d+:/;
        const aRegex = /A\d+:\s*([\s\S]+)/;

        const qMatch = qRegex.exec(block);
        const aMatch = aRegex.exec(block);

        if (qMatch?.[1] && aMatch?.[1]) {
          pairs.push({
            question: qMatch[1].trim(),
            answer: aMatch[1].trim(),
          });
        }
      }
    }

    await db.flashcard.createMany({
      data: pairs.map((pair) => ({
        userId,
        question: pair.question,
        answer: pair.answer,
      })),
    });

    return true;
  }),
});
