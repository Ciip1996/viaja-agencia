"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

const BRAND = {
  primary: "#062D97",
  secondary: "#2667FF",
  accent: "#1DCEC8",
  text: "#35322C",
} as const;

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: `${BRAND.primary}15` }}
      >
        <Bot className="w-4 h-4" style={{ color: BRAND.primary }} />
      </div>
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center"
        style={{ background: "#f1f5f9" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: BRAND.secondary }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getTextContent(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return "";
  return message.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("");
}

export default function ChatWidget() {
  const t = useTranslations("chatbot");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialMessages: UIMessage[] = [
    {
      id: "welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: t("greeting"),
        },
      ],
    },
  ];

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
  });

  const isStreaming = status === "streaming";
  const isReady = status === "ready";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await sendMessage({ text });
  };

  const visibleMessages = messages;

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={() => setOpen(true)}
            className="fixed bottom-[8.5rem] right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 font-body text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.secondary})`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
            aria-label={t("subtitle")}
          >
            <Bot className="h-4 w-4" />
            <span>{t("subtitle")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 flex flex-col w-[calc(100vw-2rem)] sm:w-[400px] h-[min(500px,calc(100vh-2rem))] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 60px -12px rgba(6, 45, 151, 0.25), 0 0 0 1px rgba(6, 45, 151, 0.08)",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
              }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  {t("title")}
                </p>
                <p className="text-white/70 text-xs">
                  {t("subtitle")}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
                aria-label={t("close")}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
              {visibleMessages.map((message) => {
                const isUser = message.role === "user";
                const text = getTextContent(message);

                if (!text?.trim()) return null;

                return (
                  <motion.div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      isUser ? "justify-end" : "max-w-[85%]"
                    )}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {!isUser && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${BRAND.primary}15` }}
                      >
                        <Bot
                          className="w-4 h-4"
                          style={{ color: BRAND.primary }}
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%]",
                        isUser
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm"
                      )}
                      style={
                        isUser
                          ? {
                              background: `linear-gradient(135deg, ${BRAND.secondary}, ${BRAND.accent})`,
                            }
                          : {
                              background: "#f1f5f9",
                              color: BRAND.text,
                            }
                      }
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {text}
                      </p>
                    </div>
                    {isUser && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND.secondary}, ${BRAND.accent})`,
                        }}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {isStreaming && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="shrink-0 px-4 py-3 border-t border-gray-100"
              style={{ background: "rgba(255,255,255,0.8)" }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("placeholder")}
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 transition-shadow focus:ring-2"
                  style={
                    {
                      color: BRAND.text,
                      "--tw-ring-color": `${BRAND.secondary}40`,
                    } as React.CSSProperties
                  }
                  disabled={isStreaming}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || !isReady}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.secondary})`,
                  }}
                  aria-label={t("send")}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
