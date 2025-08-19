"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  placeholder = "Ask me about weather, F1, or stocks...",
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading && input.trim()) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && input.trim()) {
      onSubmit(e);
    }
  };

  return (
    <div className="bg-background border-t border-border">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="pr-12 h-12 text-base bg-background border-border shadow-sm focus:shadow-md transition-all duration-200 text-foreground resize-none"
              autoComplete="off"
              autoFocus
            />
            {input && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="text-xs">
                  {input.length}
                </Badge>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="lg"
            className="h-12 px-6 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 shrink-0"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
