"use client";

import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="flex gap-2.5 items-center">
      <input
        className="flex-1 bg-slate-900/60 border border-slate-800/80 focus:border-teal-500/80 focus:outline-none text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition focus:ring-1 focus:ring-teal-500/30"
        placeholder="Type a message (e.g. 'I want to book Teeth Whitening for John at 4pm tomorrow')..."
        value={text}
        disabled={loading}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button
        onClick={submit}
        disabled={loading || !text.trim()}
        className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 px-5 py-3 rounded-xl font-bold text-sm transition active:scale-95 hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-30 disabled:pointer-events-none whitespace-nowrap"
      >
        Send
      </button>
    </div>
  );
}