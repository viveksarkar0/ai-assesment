"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, Database, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface ChatHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  useLocalStorage?: boolean;
}

export function ChatHeader({
  title = "Chat Assistant",
  onToggleSidebar,
  useLocalStorage = false,
}: ChatHeaderProps) {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="hover:bg-accent"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
          <span className="text-primary font-semibold text-sm">AI</span>
        </div>
        <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
      </div>

      <div className="flex items-center space-x-3">
        {useLocalStorage && (
          <div className="flex items-center space-x-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>Local Storage Mode</span>
          </div>
        )}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-20 rounded-full"
              >
                {session.user.image ? (
                  <img
                   src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-10 w-10 rounded-full"
                    width={20}
                    height={20}
                  />
                ) : (
                  <User className="h-4 w-10" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
