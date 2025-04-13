import { openai } from "../openai";

/**
 * Get embedding vector for the input text using OpenAI's API.
 *
 * @param input - The string to embed.
 * @returns An array of numbers representing the embedding.
 */
export async function getEmbedding(input: string): Promise<number[]> {
  if (!process.env.OPENAI_MODEL_EMBED) {
    throw new Error("OPENAI_MODEL_EMBED is not set in environment variables.");
  }

  const response = await openai.embeddings.create({
    model: process.env.OPENAI_MODEL_EMBED,
    input,
  });

  const embedding = response.data?.[0]?.embedding;
  if (!embedding) {
    throw new Error("No embedding returned by OpenAI");
  }

  return embedding;
}
