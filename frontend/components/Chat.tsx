"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { Message } from "@/types/chat";
import { v4 as uuid } from "uuid";

interface Props {
  onBookingSuccess?: () => void;
}

export default function Chat({ onBookingSuccess }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuid(),
      role: "assistant",
      content:
        "👋 Hello there! Welcome to AI Clinic. I'm AI Doctor, your virtual assistant.\n\nI can help you book an appointment today! To get started, could you please tell me your name?",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const userMessage: Message = {
      id: uuid(),
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneOffset = new Date().getTimezoneOffset();
      const clientTime = new Date().toISOString();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          timezone,
          timezoneOffset,
          clientTime,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: "assistant",
          content: data.reply || "I didn't receive a reply. Could you repeat that?",
        },
      ]);

      if (data.bookingSucceeded && onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: uuid(),
          role: "assistant",
          content: "❌ Sorry, I encountered an error connecting to the AI Doctor service. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 w-full h-[620px] bg-slate-950/40 border border-slate-800/80 backdrop-blur-md rounded-2xl flex flex-col shadow-2xl overflow-hidden">
      {/* Assistant Header */}
      <div className="bg-gradient-to-r from-teal-500/10 to-slate-950 border-b border-slate-800/80 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700/60 overflow-hidden">
              <span className="text-xl">👩‍⚕️</span>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              AI Doctor
              <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1.5 py-0.2 rounded-md font-semibold">
                AI BOT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Ready to schedule your appointment</p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {loading && (
          <div className="flex justify-start items-center gap-2 text-xs text-slate-400 bg-slate-900/40 border border-slate-850 w-max px-3.5 py-2.5 rounded-2xl animate-pulse">
            <div className="flex space-x-1">
              <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            <span>AI Doctor is checking details...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Tray */}
      <div className="border-t border-slate-800 bg-slate-950/60 p-4">
        <ChatInput loading={loading} onSend={sendMessage} />
      </div>
    </div>
  );
}