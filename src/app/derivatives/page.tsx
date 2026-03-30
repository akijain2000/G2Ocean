"use client";

import { useEffect, useState, useCallback } from "react";
import { RiskOverviewCards } from "@/components/derivatives/RiskOverviewCards";
import { FFAPositionTable } from "@/components/derivatives/FFAPositionTable";
import { BunkerHedgeTable } from "@/components/derivatives/BunkerHedgeTable";
import { BunkerPriceChart } from "@/components/derivatives/BunkerPriceChart";
import type { FFAPosition, BunkerHedge, RiskSummary } from "@/lib/types";
import { getFFAPositions, getBunkerHedges, getRiskSummary, getBunkerPriceHistory } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function DerivativesPage() {
  const [ffaPositions, setFfaPositions] = useState<FFAPosition[]>([]);
  const [bunkerHedges, setBunkerHedges] = useState<BunkerHedge[]>([]);
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [bunkerPrices, setBunkerPrices] = useState<{ date: string; vlsfo: number; hsfo: number; mgo: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setFfaPositions(getFFAPositions());
      setBunkerHedges(getBunkerHedges());
      setRiskSummary(getRiskSummary());
      setBunkerPrices(getBunkerPriceHistory());
    } catch (err) {
      console.error("Failed to load derivatives data:", err);
      setError("Failed to load derivatives data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Derivatives & Risk</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading risk data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
        <Skeleton className="h-[380px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Derivatives & Risk</h2>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchData(); }} className="mt-3 text-sm text-primary underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Derivatives & Risk</h2>
        <p className="text-sm text-muted-foreground mt-1">
          FFA positions, bunker hedging, and commercial risk management
        </p>
      </div>

      {riskSummary && <RiskOverviewCards summary={riskSummary} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FFAPositionTable positions={ffaPositions} />
        <BunkerHedgeTable hedges={bunkerHedges} />
      </div>

      <BunkerPriceChart data={bunkerPrices} />
    </div>
  );
}
