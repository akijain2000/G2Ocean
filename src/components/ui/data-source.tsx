"use client";

import { Info, Radio, Database } from "lucide-react";
import { useState } from "react";

interface DataSourceBadgeProps {
  source: string;
  isRealTime: boolean;
  description?: string;
}

export function DataSourceBadge({ source, isRealTime, description }: DataSourceBadgeProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-2 flex-wrap">
      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        <Database className="h-2.5 w-2.5" />
        {source}
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          isRealTime
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
        }`}
      >
        <Radio className="h-2.5 w-2.5" />
        {isRealTime ? "Real-time" : "Static / Mock"}
      </span>
      {description && (
        <>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="More info"
          >
            <Info className="h-2.5 w-2.5" />
          </button>
          {showInfo && (
            <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-1 z-50 max-w-[min(20rem,calc(100vw-2rem))] rounded-md border bg-popover p-3 text-xs text-popover-foreground shadow-md">
              {description}
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface DefinitionBoxProps {
  title: string;
  children: React.ReactNode;
}

export function DefinitionBox({ title, children }: DefinitionBoxProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-dashed border-muted-foreground/25 bg-muted/30 px-3 py-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-left"
      >
        <Info className="h-3 w-3 shrink-0" />
        <span>{title}</span>
        <span className="ml-auto text-[10px]">{expanded ? "Hide" : "Show"}</span>
      </button>
      {expanded && (
        <div className="mt-2 text-xs text-muted-foreground leading-relaxed space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}
