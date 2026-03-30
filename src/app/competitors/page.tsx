"use client";

import { useEffect, useState, useCallback } from "react";
import { MarketShareChart } from "@/components/competitors/MarketShareChart";
import { FleetComparison } from "@/components/competitors/FleetComparison";
import type { CompetitorData } from "@/lib/types";
import { getCompetitors } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setCompetitors(getCompetitors());
    } catch (err) {
      console.error("Failed to fetch competitor data:", err);
      setError("Failed to load competitor data. Please try again.");
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
      <div>
        <h2 className="text-2xl font-bold">Competitor Analysis</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fleet composition, market share, and competitive positioning
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketShareChart competitors={competitors} metric="vessels" />
        <MarketShareChart competitors={competitors} metric="dwt" />
      </div>

      <FleetComparison competitors={competitors} />
    </div>
  );
}
