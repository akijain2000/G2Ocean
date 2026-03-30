"use client";

import { useEffect, useState, useCallback } from "react";
import { MarketIndexCard } from "@/components/dashboard/MarketIndexCard";
import { FreightRateChart } from "@/components/dashboard/FreightRateChart";
import { SegmentBreakdown } from "@/components/dashboard/SegmentBreakdown";
import { SEGMENTS, type FreightRateData, type MarketIndex, type ShippingSegment } from "@/lib/types";
import { getMarketIndices, getFreightRates } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataSourceBadge, DefinitionBox } from "@/components/ui/data-source";

export default function MarketOverview() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [rates, setRates] = useState<FreightRateData[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<ShippingSegment[]>(
    SEGMENTS.map((s) => s.value)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIndices(getMarketIndices());
      setRates(getFreightRates());
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setError("Failed to load market data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSegment = (seg: ShippingSegment) => {
    setSelectedSegments((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    );
  };

  const latestRates = rates.filter((r) => {
    const dates = rates.filter((x) => x.segment === r.segment && x.route === r.route).map((x) => x.date);
    const maxDate = dates.sort().pop();
    return r.date === maxDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Market Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading market intelligence data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[440px] lg:col-span-2" />
          <Skeleton className="h-[440px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Market Overview</h2>
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
          <h2 className="text-2xl font-bold">Market Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Key indices, freight rates, and segment performance at a glance
          </p>
        </div>
        <DefinitionBox title="What is shown on this page?">
          <p><strong>Baltic Dry Index (BDI)</strong> — A composite index of dry bulk shipping rates published daily by the Baltic Exchange in London. It tracks rates across Capesize, Panamax, and Supramax vessel classes and is widely used as a barometer of global trade demand.</p>
          <p><strong>Capesize / Panamax / Supramax / Handysize Indices</strong> — Sub-indices of the BDI for specific vessel size classes. Capesize (&gt;100k DWT) mainly carry iron ore and coal; Panamax (60-80k DWT) carry grain and coal; Supramax (45-60k DWT) and Handysize (15-35k DWT) handle a wider range of bulk cargoes.</p>
          <p><strong>Open Hatch Rate</strong> — The average time charter equivalent rate for open hatch vessels, G2 Ocean&apos;s primary fleet type. Open hatch vessels feature wide, unobstructed cargo holds suited for forest products, aluminum, steel, and project cargo.</p>
          <p><strong>Freight Rate Trends</strong> — 90-day rolling TCE (Time Charter Equivalent) rates per trade route and segment. TCE normalizes voyage earnings to a daily USD rate, allowing comparison across different voyage durations and fuel costs.</p>
        </DefinitionBox>
        <DataSourceBadge
          source="Baltic-style indices & SeaRates (demo)"
          isRealTime={false}
          description="Figures on this overview are sample data for the G2 Ocean dashboard. Wire Baltic Exchange, SeaRates, or internal pricing feeds for production use."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {indices.map((idx) => (
          <MarketIndexCard key={idx.name} index={idx} />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground mr-1">Segments:</span>
        {SEGMENTS.map((seg) => (
          <button key={seg.value} onClick={() => toggleSegment(seg.value)}>
            <Badge
              variant={selectedSegments.includes(seg.value) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              style={
                selectedSegments.includes(seg.value)
                  ? { backgroundColor: seg.color, borderColor: seg.color }
                  : undefined
              }
            >
              {seg.label}
            </Badge>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FreightRateChart data={rates} selectedSegments={selectedSegments} />
        </div>
        <SegmentBreakdown data={latestRates} />
      </div>
    </div>
  );
}
