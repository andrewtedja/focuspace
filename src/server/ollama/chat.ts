import { openai } from "../openai";
/**
 * Create a chat completion using the OpenAI API.
 *
 * @param messages - An array of chat messages, each with a role and content.
 * @param temperature - Controls the randomness. Default is 0.7.
 * @returns The string content of the first completion choice.
 */
export async function getChatCompletion(
  messages: { role: "user" | "system" | "assistant"; content: string }[],
  temperature: number,
): Promise<string> {
  if (!process.env.OPENAI_MODEL_CHAT) {
    throw new Error("OPENAI_MODEL_CHAT is not set in environment variables.");
  }
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL_CHAT,
    messages,
    temperature,
  });

  const choice = response.choices?.[0]?.message?.content;
  if (!choice) {
    throw new Error("No completion returned by OpenAI");
  }

  return choice;
}
