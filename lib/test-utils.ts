"use client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: any[];
  isThinking?: boolean;
}

/**
 * Test utilities for chat functionality
 */
export class ChatTestUtils {
  /**
   * Check if there are any duplicate message IDs in the messages array
   */
  static hasDuplicateMessageIds(messages: Message[]): boolean {
    const ids = messages.map((msg) => msg.id);
    const uniqueIds = new Set(ids);
    return ids.length !== uniqueIds.size;
  }

  /**
   * Get duplicate message IDs
   */
  static getDuplicateMessageIds(messages: Message[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    messages.forEach((msg) => {
      if (seen.has(msg.id)) {
        duplicates.add(msg.id);
      } else {
        seen.add(msg.id);
      }
    });

    return Array.from(duplicates);
  }

  /**
   * Validate message structure
   */
  static validateMessage(message: any): boolean {
    if (!message || typeof message !== "object") return false;
    if (!message.id || typeof message.id !== "string") return false;
    if (!["user", "assistant"].includes(message.role)) return false;
    if (typeof message.content !== "string") return false;
    return true;
  }

  /**
   * Validate entire messages array
   */
  static validateMessages(messages: any[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!Array.isArray(messages)) {
      return { isValid: false, errors: ["Messages must be an array"] };
    }

    // Check for duplicates
    if (this.hasDuplicateMessageIds(messages)) {
      const duplicates = this.getDuplicateMessageIds(messages);
      errors.push(`Duplicate message IDs found: ${duplicates.join(", ")}`);
    }

    // Validate each message
    messages.forEach((msg, index) => {
      if (!this.validateMessage(msg)) {
        errors.push(`Invalid message at index ${index}`);
      }
    });

    // Check for proper conversation flow (user messages should be followed by assistant messages)
    for (let i = 0; i < messages.length - 1; i++) {
      const currentMsg = messages[i];
      const nextMsg = messages[i + 1];

      if (currentMsg.role === "user" && nextMsg.role === "user") {
        errors.push(
          `Two consecutive user messages found at indices ${i} and ${i + 1}`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate a mock user message for testing
   */
  static createMockUserMessage(content: string, id?: string): Message {
    return {
      id: id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content,
    };
  }

  /**
   * Generate a mock assistant message for testing
   */
  static createMockAssistantMessage(
    content: string,
    id?: string,
    toolInvocations?: any[],
  ): Message {
    return {
      id:
        id || `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "assistant",
      content,
      toolInvocations: toolInvocations || [],
    };
  }

  /**
   * Generate a mock conversation for testing
   */
  static createMockConversation(exchanges: number = 3): Message[] {
    const messages: Message[] = [];

    for (let i = 0; i < exchanges; i++) {
      messages.push(
        this.createMockUserMessage(`User message ${i + 1}`),
        this.createMockAssistantMessage(`Assistant response ${i + 1}`),
      );
    }

    return messages;
  }

  /**
   * Test the streaming message update logic
   */
  static simulateStreamingUpdates(
    initialMessages: Message[],
    assistantId: string,
    updates: string[],
  ): Message[][] {
    const snapshots: Message[][] = [];
    let currentMessages = [...initialMessages];

    updates.forEach((update) => {
      currentMessages = currentMessages.map((msg) =>
        msg.id === assistantId
          ? { ...msg, content: update, isThinking: false }
          : msg,
      );
      snapshots.push([...currentMessages]);
    });

    return snapshots;
  }

  /**
   * Check if messages maintain proper order and don't have gaps
   */
  static validateMessageOrder(messages: Message[]): boolean {
    if (messages.length === 0) return true;

    // First message should be from user (in most cases)
    if (messages[0].role !== "user") {
      console.warn("First message is not from user");
    }

    // Check that we don't have orphaned assistant messages
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role === "assistant" && i === 0) {
        // Assistant message at start might be ok in some contexts
        continue;
      }
      if (msg.role === "assistant") {
        // Look for a corresponding user message before this
        let foundUserMessage = false;
        for (let j = i - 1; j >= 0; j--) {
          if (messages[j].role === "user") {
            foundUserMessage = true;
            break;
          }
        }
        if (!foundUserMessage) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Performance test: measure time to process messages
   */
  static measureMessageProcessingTime(
    messages: Message[],
    processor: (messages: Message[]) => any,
  ): number {
    const start = performance.now();
    processor(messages);
    const end = performance.now();
    return end - start;
  }

  /**
   * Log detailed message analysis for debugging
   */
  static analyzeMessages(messages: Message[]): void {
    console.group("📊 Message Analysis");
    console.log(`Total messages: ${messages.length}`);
    console.log(
      `User messages: ${messages.filter((m) => m.role === "user").length}`,
    );
    console.log(
      `Assistant messages: ${messages.filter((m) => m.role === "assistant").length}`,
    );

    const validation = this.validateMessages(messages);
    console.log(`Valid: ${validation.isValid}`);
    if (!validation.isValid) {
      console.error("Validation errors:", validation.errors);
    }

    const duplicates = this.getDuplicateMessageIds(messages);
    if (duplicates.length > 0) {
      console.error("🚨 Duplicate IDs found:", duplicates);
    } else {
      console.log("✅ No duplicate IDs");
    }

    console.log("Message IDs:", messages.map((m) => m.id));
    console.groupEnd();
  }
}

/**
 * Hook for testing message state management
 */
export function useMessageTesting() {
  const validateAndLog = (messages: Message[], label: string = "Messages") => {
    console.log(`🧪 Testing ${label}:`);
    ChatTestUtils.analyzeMessages(messages);
  };

  const checkForDuplicates = (messages: Message[]): boolean => {
    const hasDuplicates = ChatTestUtils.hasDuplicateMessageIds(messages);
    if (hasDuplicates) {
      console.error("🚨 DUPLICATE MESSAGE BUG DETECTED!");
      const duplicates = ChatTestUtils.getDuplicateMessageIds(messages);
      console.error("Duplicate IDs:", duplicates);
    }
    return hasDuplicates;
  };

  return {
    validateAndLog,
    checkForDuplicates,
    utils: ChatTestUtils,
  };
}

export default ChatTestUtils;
