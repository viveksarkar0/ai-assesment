import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  return Response.json({
    GITHUB_ID: process.env.GITHUB_ID || "NOT_SET",
    GITHUB_SECRET: process.env.GITHUB_SECRET ? "SET" : "NOT_SET",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "NOT_SET",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "NOT_SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT_SET",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT_SET",
    NODE_ENV: process.env.NODE_ENV || "NOT_SET",
    SESSION_EXISTS: !!session,
    SESSION_USER: session?.user || null,
    SESSION_USER_EMAIL: session?.user?.email || "NO_EMAIL",
    SESSION_USER_ID: session?.user?.id || "NO_ID",
    SESSION_USER_NAME: session?.user?.name || "NO_NAME",
  });
}
