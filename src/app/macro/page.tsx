"use client";

import { useEffect, useState, useCallback } from "react";
import { TradeVolumeChart } from "@/components/macro/TradeVolumeChart";
import { CommodityPriceChart } from "@/components/macro/CommodityPriceChart";
import { GDPChart } from "@/components/macro/GDPChart";
import type { MacroSeriesData } from "@/lib/types";
import { getAllMacroSeries } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function MacroTrendsPage() {
  const [allSeries, setAllSeries] = useState<MacroSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setAllSeries(getAllMacroSeries());
    } catch (err) {
      console.error("Failed to fetch macro data:", err);
      setError("Failed to load macro data. Please try again.");
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
          <h2 className="text-2xl font-bold">Macroeconomic Trends</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading macro data...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />
        </div>
        <Skeleton className="h-[420px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Macroeconomic Trends</h2>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); fetchData(); }} className="mt-3 text-sm text-primary underline">Retry</button>
        </div>
      </div>
    );
  }

  const tradeVolume = allSeries.find((s) => s.seriesId === "WDTIVOL");
  const commoditySeries = allSeries.filter((s) =>
    ["PALLFNFINDEXM", "PIORECRUSDM", "PCOALAUUSDM", "PWHEAMTUSDM"].includes(s.seriesId)
  );
  const gdpSeries = allSeries.filter((s) =>
    ["NYGDPMKTPCDWLD", "NYGDPMKTPCDCHN", "NYGDPMKTPCDEUU"].includes(s.seriesId)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Macroeconomic Trends</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Global trade volumes, commodity prices, and GDP indicators impacting shipping markets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tradeVolume && <TradeVolumeChart series={tradeVolume} />}
        {commoditySeries.length > 0 && <CommodityPriceChart seriesList={commoditySeries} />}
      </div>

      {gdpSeries.length > 0 && <GDPChart seriesList={gdpSeries} />}
    </div>
  );
}
