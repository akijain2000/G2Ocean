"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import type { RiskSummary } from "@/lib/types";
import { formatCurrency, formatCompact, formatPercent } from "@/lib/utils/formatters";
import { Shield, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface Props {
  summary: RiskSummary;
}

export function RiskOverviewCards({ summary }: Props) {
  const cards = [
    {
      title: "Net Mark-to-Market",
      value: formatCurrency(summary.netMtM),
      positive: summary.netMtM >= 0,
      icon: summary.netMtM >= 0 ? TrendingUp : TrendingDown,
      subtitle: "Combined FFA + Bunker P&L",
    },
    {
      title: "Freight VaR (95%, 30d)",
      value: formatCompact(summary.freightVaR),
      positive: false,
      icon: Shield,
      subtitle: `FFA exposure: ${formatCompact(summary.totalFFAExposure)}`,
    },
    {
      title: "Bunker VaR (95%, 30d)",
      value: formatCompact(summary.bunkerVaR),
      positive: false,
      icon: Shield,
      subtitle: `Bunker exposure: ${formatCompact(summary.totalBunkerExposure)}`,
    },
    {
      title: "Hedge Ratio",
      value: formatPercent(summary.hedgeRatio * 100, 0).replace("+", ""),
      positive: summary.hedgeRatio >= 0.5,
      icon: BarChart3,
      subtitle: "% of exposure hedged",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.positive ? "text-emerald-500" : "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.title === "Net Mark-to-Market" ? (card.positive ? "text-emerald-600" : "text-red-600") : ""}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-end">
        <DataSourceBadge source="Internal Risk System" isRealTime={false} description="Risk metrics computed from G2 Ocean's internal derivatives and hedging management system. VaR calculated using historical simulation method with 500 scenarios. Updated daily." />
      </div>
    </>
  );
}
