import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NextRequest } from "next/server"

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

// In-memory storage
const users = new Map<string, User>();
const chats = new Map<string, Chat>();

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get user's chats
    const userChats = Array.from(chats.values())
      .filter(chat => chat.userId === session.user.email)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return Response.json(userChats);
  } catch (error) {
    console.error("Failed to get chats:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== "string") {
      return new Response("Title is required", { status: 400 });
    }

    // Ensure user exists
    const userId = session.user.email;
    if (!users.has(userId)) {
      users.set(userId, {
        id: userId,
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      });
    }

    // Create new chat
    const chatId = generateId();
    const now = new Date().toISOString();

    const newChat: Chat = {
      id: chatId,
      userId,
      title: title.slice(0, 100), // Limit title length
      createdAt: now,
      updatedAt: now,
    };

    chats.set(chatId, newChat);

    return Response.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Failed to create chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
