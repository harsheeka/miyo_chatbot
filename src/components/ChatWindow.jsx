import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages, isLoading }) {
  return (
    <div className="h-[calc(100vh-7rem-72px)] overflow-y-auto flex flex-col gap-3 pb-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-sakura-light border border-sakura/60 text-xs text-neutral-700">
            <span>🌸</span>
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
