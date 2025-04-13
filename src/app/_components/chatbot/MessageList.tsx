"use client";

interface MessageListProps {
  messages: { id?: string; sender: string; content: string }[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

/**
 * Displays the list of chat messages
 */
export default function MessageList({ messages, scrollRef }: MessageListProps) {
  return (
    <div className="flex h-full w-96 flex-col-reverse space-y-2 py-2">
      <div ref={scrollRef} />
      {messages.map((msg, idx) => (
        <div
          key={msg.id ? msg.id : idx}
          className={`w-fit max-w-[75%] break-words rounded-xl p-2 ${
            msg.sender === "user"
              ? "ml-auto bg-gray-500 text-white"
              : "mr-auto bg-gray-200 text-black"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
