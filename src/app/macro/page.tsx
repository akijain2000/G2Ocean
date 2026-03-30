"use client";

import { useEffect, useState, useCallback } from "react";
import { TradeVolumeChart } from "@/components/macro/TradeVolumeChart";
import { CommodityPriceChart } from "@/components/macro/CommodityPriceChart";
import { GDPChart } from "@/components/macro/GDPChart";
import type { MacroSeriesData } from "@/lib/types";
import { getAllMacroSeries } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { DefinitionBox } from "@/components/ui/data-source";

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
    ["PALLFNFINDEXM", "PIORECRUSDM", "PCOALAUUSDM", "PPULPUSDM", "PALUMUSDM", "PSTEEUSDM"].includes(s.seriesId)
  );
  const gdpSeries = allSeries.filter((s) =>
    ["NYGDPMKTPCDWLD", "NYGDPMKTPCDCHN", "NYGDPMKTPCDEUU"].includes(s.seriesId)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold">Macroeconomic Trends</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Global trade volumes, commodity prices, and GDP indicators impacting shipping markets
          </p>
        </div>
        <DefinitionBox title="What is shown on this page?">
          <p><strong>World Trade Volume Index</strong> — Measures the physical volume of global merchandise trade (imports + exports). Published by the CPB Netherlands Bureau for Economic Policy Analysis. A rising index signals increasing global trade activity, which directly drives shipping demand.</p>
          <p><strong>Commodity Price Index</strong> — A broad composite index of all commodity prices (metals, agriculture, energy). Published by the IMF. Tracks overall commodity market conditions that influence cargo volumes.</p>
          <p><strong>Iron Ore Price</strong> — Spot price for iron ore (62% Fe fines, CFR Qingdao). Iron ore is the single largest seaborne dry bulk commodity. Price movements affect Capesize shipping demand.</p>
          <p><strong>Coal Price</strong> — Newcastle thermal coal benchmark (FOB). Coal is the second-largest dry bulk commodity. Used for power generation and steel production.</p>
          <p><strong>Pulp Price (NBSK)</strong> — Northern Bleached Softwood Kraft pulp price. Pulp is a core cargo for G2 Ocean&apos;s open hatch fleet, shipped primarily from Scandinavia and South America to Asia.</p>
          <p><strong>Aluminum Price (LME)</strong> — London Metal Exchange aluminum spot price. Aluminum ingots and coils are a key G2 Ocean cargo, requiring special stowage in open hatch vessels.</p>
          <p><strong>Steel Price (HRC)</strong> — Hot-Rolled Coil steel price. Steel products are transported on open hatch and multipurpose vessels, making this an important demand indicator for G2 Ocean.</p>
          <p><strong>GDP by Region</strong> — Gross Domestic Product in current US dollars for the World, China, and the EU. GDP growth drives import/export volumes and ultimately shipping demand. China is the world&apos;s largest importer of raw materials.</p>
        </DefinitionBox>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tradeVolume && <TradeVolumeChart series={tradeVolume} />}
        {commoditySeries.length > 0 && <CommodityPriceChart seriesList={commoditySeries} />}
      </div>

      {gdpSeries.length > 0 && <GDPChart seriesList={gdpSeries} />}
    </div>
  );
}
