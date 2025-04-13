"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { BeatLoader } from "react-spinners";

interface MessageInputProps {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  isSending: boolean;
}

/**
 * Text input and "Send" button for the chat
 */
export default function MessageInput({
  input,
  setInput,
  handleSend,
  isSending,
}: MessageInputProps) {
  return (
    <>
      <Input
        className="flex-1 rounded border bg-white px-4 py-2"
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <Button
        onClick={handleSend}
        className="rounded bg-gray-700 px-4 py-2 text-white disabled:opacity-50"
        disabled={!input.trim() || isSending}
      >
        {isSending ? <BeatLoader speedMultiplier={0.7} size={8} /> : "Send"}
      </Button>
    </>
  );
}
