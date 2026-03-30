"use client";

import { useEffect, useState, useCallback } from "react";
import { RiskOverviewCards } from "@/components/derivatives/RiskOverviewCards";
import { FFAPositionTable } from "@/components/derivatives/FFAPositionTable";
import { BunkerHedgeTable } from "@/components/derivatives/BunkerHedgeTable";
import { BunkerPriceChart } from "@/components/derivatives/BunkerPriceChart";
import type { FFAPosition, BunkerHedge, RiskSummary } from "@/lib/types";
import { getFFAPositions, getBunkerHedges, getRiskSummary, getBunkerPriceHistory } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { DefinitionBox } from "@/components/ui/data-source";

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
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold">Derivatives & Risk</h2>
          <p className="text-sm text-muted-foreground mt-1">
            FFA positions, bunker hedging, and commercial risk management
          </p>
        </div>
        <DefinitionBox title="What is shown on this page?">
          <p><strong>FFA (Freight Forward Agreement)</strong> — A financial derivative that allows ship operators and charterers to hedge freight rate risk. An FFA is a contract to settle the difference between a fixed rate and the actual market rate at a future date. &quot;Buy&quot; positions profit when rates rise; &quot;Sell&quot; positions profit when rates fall. Used by G2 Ocean to lock in rates on key trade routes.</p>
          <p><strong>Mark-to-Market (M2M)</strong> — The unrealized profit or loss on an open derivative position, calculated as the difference between the contract price and the current market price, multiplied by the position size. Green = profit, Red = loss.</p>
          <p><strong>Bunker Hedging</strong> — Financial contracts to fix the future purchase price of marine fuel (bunker). Protects against fuel cost volatility. G2 Ocean hedges VLSFO (Very Low Sulphur Fuel Oil, the main fuel since IMO 2020), HSFO (High Sulphur Fuel Oil, used with scrubbers), and MGO (Marine Gas Oil, used in emission control areas).</p>
          <p><strong>Value at Risk (VaR)</strong> — A statistical measure of the maximum expected loss over a 30-day period at 95% confidence level. A VaR of $500K means there is only a 5% chance of losing more than $500K in the next 30 days. Used by the Commercial Derivative Forum to monitor portfolio risk.</p>
          <p><strong>Hedge Ratio</strong> — The percentage of total exposure that is covered by hedging instruments. A ratio of 68% means 68% of anticipated fuel costs and freight exposure are locked in through derivatives.</p>
        </DefinitionBox>
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
