import { Message } from "@/types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-2.5 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border shrink-0 ${
        isUser 
          ? "bg-slate-800 border-slate-700 text-slate-200" 
          : "bg-teal-950/40 border-teal-850 text-teal-300"
      }`}>
        {isUser ? "👤" : "👩‍⚕️"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 whitespace-pre-wrap text-sm leading-relaxed shadow-lg ${
        isUser
          ? "bg-teal-500 text-slate-950 font-semibold rounded-tr-none shadow-teal-500/5"
          : "bg-slate-900 border border-slate-800/80 text-slate-100 rounded-tl-none"
      }`}>
        {message.content}
      </div>
    </div>
  );
}