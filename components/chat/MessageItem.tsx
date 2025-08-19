"use client";

import React from "react";
import { Bot, User, Clock } from "lucide-react";
import { ChatTools } from "@/components/chat/ChatTools";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: any[];
  isThinking?: boolean;
}

interface MessageItemProps {
  message: Message;
  index?: number;
}

export function MessageItem({ message, index = 0 }: MessageItemProps) {
  return (
    <div
      className={`flex gap-4 animate-message-in ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`flex gap-4 max-w-[85%] ${
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
            message.role === "user"
              ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
              : "bg-gradient-to-br from-muted to-muted/80 border border-border"
          }`}
        >
          {message.role === "user" ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>

        <div className="space-y-3">
          {/* Message Bubble */}
          <div
            className={`rounded-2xl px-6 py-4 shadow-md ${
              message.role === "user"
                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                : "bg-white dark:bg-slate-800 border border-border text-slate-900 dark:text-slate-100"
            }`}
          >
            {message.isThinking ? (
              <div className="flex items-center gap-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce"></div>
                  <div
                    className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-2.5 h-2.5 bg-primary/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
                  Thinking...
                </span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-900 dark:text-slate-100">
                {message.content}
              </p>
            )}

            {/* Timestamp for assistant messages */}
            {message.role === "assistant" && !message.isThinking && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                <Clock className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Just now
                </span>
              </div>
            )}
          </div>

          {/* Tool Invocations */}
          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="space-y-3">
              {message.toolInvocations.map((tool: any, toolIndex: number) => (
                <div
                  key={toolIndex}
                  className="animate-scale-in"
                  style={{ animationDelay: `${toolIndex * 0.2}s` }}
                >
                  <ChatTools tool={tool} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
