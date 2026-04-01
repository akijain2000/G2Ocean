"use client";

import { useEffect, useState, useCallback } from "react";
import { MarketShareChart } from "@/components/competitors/MarketShareChart";
import { FleetComparison } from "@/components/competitors/FleetComparison";
import type { CompetitorData } from "@/lib/types";
import { getCompetitors } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { DataSourceBadge, DefinitionBox } from "@/components/ui/data-source";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/competitors");
      if (res.ok) {
        const json = await res.json();
        setCompetitors(json.competitors);
        setIsLive(json.live ?? false);
        return;
      }
    } catch {
      // API route unavailable — fall back to mock data
    }
    setCompetitors(getCompetitors());
    setIsLive(false);
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Competitor Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading competitor data...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Competitor Analysis</h2>
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
          <h2 className="text-2xl font-bold">Competitor Analysis</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Market share, fleet composition, and competitive positioning
          </p>
        </div>
        <DefinitionBox title="What is shown on this page?">
          <p><strong>Market Share by Vessels</strong> — Percentage of fleet count each operator controls. Indicates how many ships each company operates within the open hatch, semi-open, multipurpose, and dry bulk segments.</p>
          <p><strong>Market Share by DWT</strong> — Percentage of total deadweight tonnage. A better measure of actual cargo-carrying capacity than vessel count, since vessel sizes vary significantly.</p>
          <p><strong>Fleet Composition by Segment</strong> — Breakdown of each competitor&apos;s fleet into the four vessel segments. Reveals strategic focus — e.g., G2 Ocean is heavily weighted toward open hatch.</p>
          <p><strong>Average Fleet Age</strong> — Mean age of each operator&apos;s fleet in years. Newer fleets tend to have lower fuel consumption, better environmental compliance, and lower maintenance costs.</p>
        </DefinitionBox>
        <DataSourceBadge
          source={isLive ? "MarineTraffic API (live)" : "Sample data (demo)"}
          isRealTime={isLive}
          description={isLive
            ? "Competitor fleet data sourced from MarineTraffic."
            : "Showing curated competitor intelligence. Connect MarineTraffic API for live fleet data."}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketShareChart competitors={competitors} metric="vessels" />
        <MarketShareChart competitors={competitors} metric="dwt" />
      </div>

      <FleetComparison competitors={competitors} />
    </div>
  );
}
