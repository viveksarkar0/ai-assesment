import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
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

    const body = await req.json();
    const { role, content, toolInvocations } = body;

    if (!role || !content) {
      return new Response("Role and content are required", { status: 400 });
    }

    if (!["user", "assistant"].includes(role)) {
      return new Response("Invalid role", { status: 400 });
    }

    // Create new message
    const messageId = generateId();
    const now = new Date().toISOString();

    const newMessage: Message = {
      id: messageId,
      chatId,
      role,
      content,
      toolInvocations: toolInvocations || undefined,
      createdAt: now,
    };

    messages.set(messageId, newMessage);

    // Update chat's updatedAt timestamp
    const updatedChat = { ...chat, updatedAt: now };
    chats.set(chatId, updatedChat);

    return Response.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Failed to create message:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
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
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return Response.json(chatMessages);
  } catch (error) {
    console.error("Failed to get messages:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
