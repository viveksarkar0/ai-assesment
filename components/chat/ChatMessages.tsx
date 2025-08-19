"use client";

import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { MessageItem } from "./MessageItem";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: any[];
  isThinking?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  onQuickAction: (action: string) => void;
}

export function ChatMessages({ messages, onQuickAction }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
        <Bot className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-card-foreground">
          Start a conversation
        </h3>
        <p className="text-muted-foreground max-w-md text-lg">
          Ask me about weather conditions, Formula 1 updates, or stock market
          insights
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center pt-4">
        <Button
          variant="outline"
          size="lg"
          className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 bg-transparent"
          onClick={() => onQuickAction("What's the weather like in New York?")}
        >
          🌤️ Weather in NYC
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 bg-transparent"
          onClick={() => onQuickAction("Latest F1 race results")}
        >
          🏎️ F1 Results
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 bg-transparent"
          onClick={() => onQuickAction("AAPL stock price")}
        >
          📈 Stock Price
        </Button>
      </div>
    </div>
  );

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-6 pb-4">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <MessageItem key={message.id} message={message} index={index} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
