import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Simple in-memory storage for development (will reset on server restart)
interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: any[];
  createdAt: string;
}

// In-memory storage (shared across routes)
const users = new Map<string, User>();
const chats = new Map<string, Chat>();
const messages = new Map<string, Message>();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId } = await params;
    const chat = chats.get(chatId);

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Verify ownership
    if (chat.userId !== session.user.email) {
      return new Response("Forbidden", { status: 403 });
    }

    // Get messages for this chat
    const chatMessages = Array.from(messages.values())
      .filter((msg) => msg.chatId === chatId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    return Response.json({
      chat,
      messages: chatMessages,
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId } = await params;
    const chat = chats.get(chatId);

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Verify ownership
    if (chat.userId !== session.user.email) {
      return new Response("Forbidden", { status: 403 });
    }

    // Delete chat and associated messages
    chats.delete(chatId);

    // Delete all messages for this chat
    const messageKeys = Array.from(messages.keys());
    for (const messageId of messageKeys) {
      const message = messages.get(messageId);
      if (message && message.chatId === chatId) {
        messages.delete(messageId);
      }
    }

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
