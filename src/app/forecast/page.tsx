"use client";

import { useEffect, useState, useCallback } from "react";
import { RateForecastChart } from "@/components/forecast/RateForecastChart";
import { TradeBudgetTable } from "@/components/forecast/TradeBudgetTable";
import { SeasonalPatternChart } from "@/components/forecast/SeasonalPatternChart";
import { SEGMENTS, type ForecastPoint, type TradeBudgetData, type SeasonalPattern, type ShippingSegment } from "@/lib/types";
import { getForecastData, getTradeBudget, getSeasonalPatterns } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DefinitionBox } from "@/components/ui/data-source";

export default function ForecastPage() {
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [budget, setBudget] = useState<TradeBudgetData[]>([]);
  const [seasonal, setSeasonal] = useState<SeasonalPattern[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<ShippingSegment | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const seg = selectedSegment === "all" ? undefined : selectedSegment;
      setForecast(getForecastData(seg));
      setBudget(getTradeBudget());
      setSeasonal(getSeasonalPatterns(seg));
    } catch (err) {
      console.error("Failed to load forecast data:", err);
      setError("Failed to load forecast data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedSegment]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const filteredBudget = selectedSegment === "all"
    ? budget
    : budget.filter((b) => b.segment === selectedSegment);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Forecasting</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading forecast data...</p>
        </div>
        <Skeleton className="h-[440px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Forecasting</h2>
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
          <h2 className="text-2xl font-bold">Forecasting</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Long-term rate forecasts, trade budget analysis, and seasonal patterns
          </p>
        </div>
        <DefinitionBox title="What is shown on this page?">
          <p><strong>Rate Forecast</strong> — A 12-month forward projection of freight rates based on historical trends, seasonal patterns, and market fundamentals. The solid blue line shows actual historical rates, while the dashed orange line shows the forecasted rate. The shaded blue area represents the 95% confidence interval — the range within which the actual rate is expected to fall with 95% probability. Wider bands indicate greater uncertainty further into the future.</p>
          <p><strong>Trade Budget vs Actual</strong> — Compares the budgeted (planned) freight rate for each trade route against the current prevailing market rate. Green variance means the market rate exceeds budget (favorable for vessel operators), red means it is below budget (unfavorable). Used in the annual trade budget and forecasting process.</p>
          <p><strong>Seasonal Patterns</strong> — Historical monthly rate patterns showing the average, minimum, and maximum rates for each calendar month. Reveals predictable seasonal cycles driven by crop harvests, industrial production cycles, and weather patterns that affect shipping demand.</p>
        </DefinitionBox>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground mr-1">Segment:</span>
        <button onClick={() => setSelectedSegment("all")}>
          <Badge variant={selectedSegment === "all" ? "default" : "outline"} className="cursor-pointer">
            All Segments
          </Badge>
        </button>
        {SEGMENTS.map((seg) => (
          <button key={seg.value} onClick={() => setSelectedSegment(seg.value)}>
            <Badge
              variant={selectedSegment === seg.value ? "default" : "outline"}
              className="cursor-pointer"
              style={
                selectedSegment === seg.value
                  ? { backgroundColor: seg.color, borderColor: seg.color }
                  : undefined
              }
            >
              {seg.label}
            </Badge>
          </button>
        ))}
      </div>

      <RateForecastChart data={forecast} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradeBudgetTable data={filteredBudget} />
        <SeasonalPatternChart data={seasonal} />
      </div>
    </div>
  );
}
