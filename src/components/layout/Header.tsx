"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 md:h-16 px-4 md:px-6 border-b bg-card/80 backdrop-blur-sm gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-semibold truncate">Shipping Market Intelligence</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Real-time data across open hatch, semi-open, multipurpose &amp; dry bulk segments
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9" aria-label="Notifications">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-9 md:w-9"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
        )}
      </div>
    </header>
  );
}
