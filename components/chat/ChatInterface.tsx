"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: any[];
  isThinking?: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickAction: (value: string) => void;
  title?: string;
  onToggleSidebar?: () => void;
  useLocalStorage?: boolean;
}

export function ChatInterface({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onQuickAction,
  title,
  onToggleSidebar,
  useLocalStorage,
}: ChatInterfaceProps) {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader
        title={title}
        onToggleSidebar={onToggleSidebar}
        useLocalStorage={useLocalStorage}
      />

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatMessages messages={messages} onQuickAction={onQuickAction} />
        </div>

        <div className="flex-shrink-0 sticky bottom-0 z-10">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
