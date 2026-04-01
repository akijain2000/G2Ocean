"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Ship,
  Users,
  TrendingUp,
  FileText,
  Anchor,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Shield,
  Newspaper,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Market Overview", icon: BarChart3 },
  { href: "/brief", label: "Market Brief", icon: Newspaper },
  { href: "/fleet", label: "Fleet Monitor", icon: Ship },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/macro", label: "Macro Trends", icon: TrendingUp },
  { href: "/forecast", label: "Forecasting", icon: LineChart },
  { href: "/derivatives", label: "Derivatives & Risk", icon: Shield },
  { href: "/reports", label: "Reports", icon: FileText },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navContent = (isMobile: boolean) => (
    <>
      <div className="flex items-center gap-3 px-4 h-16 border-b">
        <Anchor className="h-7 w-7 text-primary shrink-0" />
        {(isMobile || !collapsed) && (
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-lg tracking-tight">G2 Ocean</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Market Intelligence
            </span>
          </div>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onMobileClose : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={!isMobile && collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {(isMobile || !collapsed) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-card transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {navContent(false)}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative flex flex-col w-64 h-full bg-card shadow-xl animate-in slide-in-from-left duration-200">
            {navContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
