export async function getChatCompletion(
  messages: { role: "user" | "system" | "assistant"; content: string }[],
): Promise<string> {
  const response = await fetch("http://localhost:11434/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      messages,
    }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to generate chat completion from Ollama");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
