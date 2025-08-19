"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthView() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center p-8 shadow-xl border-0 bg-card">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-card-foreground">
                  Welcome to AI Assistant
                </h1>
                <p className="text-muted-foreground text-lg">
                  Sign in to access powerful AI tools for weather, Formula 1,
                  and stock market data
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={handleSignIn}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-transparent"
                  onClick={handleSignIn}
                >
                  🚀 Get Started
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-4">
                <Link
                  href="/"
                  className="text-primary hover:underline font-medium"
                >
                  ← Back to home
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
