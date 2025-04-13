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
    <div className="flex h-full w-full flex-col-reverse space-y-5">
      <div ref={scrollRef} />
      {messages.map((msg, idx) => (
        <div
          key={msg.id ? msg.id : idx}
          className={`w-fit break-words rounded-xl px-4 py-3 ${
            msg.sender === "user"
              ? "ml-auto bg-[#e9e9e9]/80 text-black"
              : "text-black"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
