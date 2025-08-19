import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "your-github-client-id",
      clientSecret: process.env.GITHUB_SECRET || "your-github-client-secret",
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.

      // Ensure we have user email or use user ID as fallback
      if (session.user) {
        // Add user ID to session
        if (token?.sub) {
          session.user.id = token.sub;
        }

        if (token?.email && !session.user.email) {
          session.user.email = token.email as string;
        } else if (!session.user.email && token?.sub) {
          // Use GitHub user ID as email fallback when email is not provided
          session.user.email = `github_${token.sub}`;
        }
      }

      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (url.startsWith(baseUrl)) return url;

      // Default redirect to chat page
      return `${baseUrl}/chat`;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt" as const,
  },
};
