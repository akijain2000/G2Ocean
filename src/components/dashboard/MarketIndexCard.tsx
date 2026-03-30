"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils/formatters";
import type { MarketIndex } from "@/lib/types";

export function MarketIndexCard({ index }: { index: MarketIndex }) {
  const isPositive = index.change >= 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {index.name}
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {formatNumber(index.value)}
            </p>
            <p className="text-xs text-muted-foreground">{index.unit}</p>
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {formatPercent(index.changePercent)}
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {isPositive ? "+" : ""}{formatNumber(index.change)} today
        </div>
      </CardContent>
    </Card>
  );
}
