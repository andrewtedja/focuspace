export async function getEmbedding(input: string): Promise<number[]> {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.2", prompt: input }),
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to generate embedding from Ollama");
  }

  const data = await response.json();
  return data.embedding;
}
