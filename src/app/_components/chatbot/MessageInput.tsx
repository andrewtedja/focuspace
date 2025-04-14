"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { BeatLoader } from "react-spinners";
import { ArrowUp } from "lucide-react";

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
    <div className="relative flex w-full">
      <Input
        className="pr- w-[100%] rounded-xl border border-gray-300 bg-white py-7 pr-[18%] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <Button
        onClick={handleSend}
        disabled={!input.trim() || isSending}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-700 p-0 text-white hover:bg-gray-800 disabled:opacity-50"
        aria-label="Send"
      >
        {isSending ? (
          <BeatLoader size={6} speedMultiplier={0.8} />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
