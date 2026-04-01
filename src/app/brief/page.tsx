"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataSourceBadge } from "@/components/ui/data-source";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Ship,
  Anchor,
  BarChart3,
  Globe,
} from "lucide-react";
import type { MarketIndex, MacroSeriesData, VesselData, FreightRateData } from "@/lib/types";
import {
  getMarketIndices,
  getFreightRates,
  getVessels,
  getAllMacroSeries,
} from "@/lib/data";

interface BriefData {
  indices: MarketIndex[];
  rates: FreightRateData[];
  vessels: VesselData[];
  macro: MacroSeriesData[];
  live: boolean;
}

function TrendIcon({ value }: { value: number }) {
  if (value > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function formatUsd(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n.toLocaleString()}`;
}

function generateMarketSummary(data: BriefData) {
  const bdi = data.indices.find((i) => i.name.includes("BDI"));
  const ohRate = data.indices.find((i) => i.name.includes("Open Hatch"));

  const bdiTrend = bdi && bdi.change > 0 ? "strengthened" : "softened";
  const bdiPct = bdi ? Math.abs(bdi.changePercent).toFixed(1) : "0.0";

  const ohTrend = ohRate && ohRate.change > 0 ? "gained" : "declined";
  const ohPct = ohRate ? Math.abs(ohRate.changePercent).toFixed(1) : "0.0";

  const paragraphs = [
    `The Baltic Dry Index has ${bdiTrend} ${bdiPct}% to ${bdi?.value?.toLocaleString() ?? "N/A"} points, reflecting ${bdi && bdi.change > 0 ? "improving" : "weakening"} demand across the dry bulk complex. Capesize rates continue to be the primary driver, influenced by iron ore shipments from Brazil and Australia to China.`,
    `Open hatch rates have ${ohTrend} ${ohPct}% to an average of ${ohRate ? formatUsd(ohRate.value) : "N/A"}/day. ${ohRate && ohRate.change > 0 ? "Increased pulp shipments from Scandinavia and Brazil, combined with strong aluminum demand from the Middle East, are supporting rate improvements." : "Seasonal softness in forest product volumes and increased tonnage supply are applying downward pressure on rates."}`,
    `Looking ahead, Q2 typically sees a seasonal uptick in open hatch demand as pulp mills in Scandinavia ramp up production and Brazilian forestry exports peak. The forward curve for Panamax rates is in contango, suggesting the market expects rates to recover over the next quarter.`,
  ];

  return paragraphs;
}

function generateRouteHighlights(rates: FreightRateData[]) {
  const latestByRoute = new Map<string, FreightRateData>();
  for (const r of rates) {
    const existing = latestByRoute.get(r.route);
    if (!existing || r.date > existing.date) {
      latestByRoute.set(r.route, r);
    }
  }

  const sorted = Array.from(latestByRoute.values())
    .filter((r) => r.change !== 0)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 6);

  return sorted;
}

function generateFleetSummary(vessels: VesselData[]) {
  const g2Vessels = vessels.filter((v) => v.operator === "G2 Ocean");
  const total = g2Vessels.length;
  const laden = g2Vessels.filter((v) => v.status === "Laden").length;
  const ballast = g2Vessels.filter((v) => v.status === "Ballast").length;
  const port = g2Vessels.filter((v) => v.status === "Port").length;

  const utilization = total > 0 ? ((laden / total) * 100).toFixed(0) : "0";

  return { total, laden, ballast, port, utilization };
}

export default function MarketBriefPage() {
  const [data, setData] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    let indices: MarketIndex[] = [];
    let rates: FreightRateData[] = [];
    let vessels: VesselData[] = [];
    let macro: MacroSeriesData[] = [];
    let live = false;

    const fetchers = [
      fetch("/api/market").then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/vessels").then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/macro").then((r) => r.ok ? r.json() : null).catch(() => null),
    ] as const;

    const [marketRes, vesselRes, macroRes] = await Promise.all(fetchers);

    if (marketRes) {
      indices = marketRes.indices;
      rates = marketRes.rates;
      live = marketRes.live ?? false;
    } else {
      indices = getMarketIndices();
      rates = getFreightRates();
    }

    if (vesselRes) {
      vessels = vesselRes.vessels;
    } else {
      vessels = getVessels();
    }

    if (macroRes) {
      macro = macroRes.series;
      if (macroRes.live) live = true;
    } else {
      macro = getAllMacroSeries();
    }

    setData({ indices, rates, vessels, macro, live });
  }, []);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Market Brief</h2>
          <p className="text-sm text-muted-foreground mt-1">Loading market brief...</p>
        </div>
        <Skeleton className="h-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  const summaryParagraphs = generateMarketSummary(data);
  const routeHighlights = generateRouteHighlights(data.rates);
  const fleet = generateFleetSummary(data.vessels);

  const bdi = data.indices.find((i) => i.name.includes("BDI"));
  const ohRate = data.indices.find((i) => i.name.includes("Open Hatch"));

  const pulpSeries = data.macro.find((s) => s.seriesId === "PPULPUSDM");
  const aluminumSeries = data.macro.find((s) => s.seriesId === "PALUMUSDM");
  const steelSeries = data.macro.find((s) => s.seriesId === "PSTEEUSDM");

  const latestValue = (s?: MacroSeriesData) =>
    s && s.data.length > 0 ? s.data[s.data.length - 1].value : null;

  const now = new Date();
  const briefDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-3">
        <div>
          <h2 className="text-2xl font-bold">Weekly Market Brief</h2>
          <p className="text-sm text-muted-foreground mt-1">{briefDate}</p>
        </div>
        <DataSourceBadge
          source={data.live ? "Live APIs (FRED, SeaRates)" : "Sample data (demo)"}
          isRealTime={data.live}
          description={data.live
            ? "This brief is generated from live API data."
            : "Generated from sample data. Connect API keys for live market intelligence."}
        />
      </div>

      {/* Key Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {bdi && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">BDI</span>
              </div>
              <div className="text-xl font-bold">{bdi.value.toLocaleString()}</div>
              <div className="flex items-center gap-1">
                <TrendIcon value={bdi.change} />
                <span className={`text-xs font-medium ${bdi.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {bdi.change >= 0 ? "+" : ""}{bdi.changePercent.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {ohRate && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Ship className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">OH Rate</span>
              </div>
              <div className="text-xl font-bold">{formatUsd(ohRate.value)}/d</div>
              <div className="flex items-center gap-1">
                <TrendIcon value={ohRate.change} />
                <span className={`text-xs font-medium ${ohRate.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {ohRate.change >= 0 ? "+" : ""}{ohRate.changePercent.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {latestValue(pulpSeries) !== null && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Pulp (NBSK)</span>
              </div>
              <div className="text-xl font-bold">${Math.round(latestValue(pulpSeries)!)}</div>
              <span className="text-xs text-muted-foreground">USD/MT</span>
            </CardContent>
          </Card>
        )}
        {latestValue(aluminumSeries) !== null && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">Aluminum</span>
              </div>
              <div className="text-xl font-bold">${Math.round(latestValue(aluminumSeries)!)}</div>
              <span className="text-xs text-muted-foreground">USD/MT</span>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Market Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summaryParagraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Trade Route Highlights */}
      {routeHighlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trade Route Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routeHighlights.map((r) => (
                <div key={r.route + r.segment} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="min-w-0">
                    <span className="text-sm font-medium">{r.route}</span>
                    <Badge variant="outline" className="ml-2 text-[10px]">{r.segment}</Badge>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-mono">{formatUsd(r.rate)}/d</span>
                    <div className="flex items-center gap-1">
                      <TrendIcon value={r.change} />
                      <span className={`text-xs font-medium ${r.change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {r.change >= 0 ? "+" : ""}{formatUsd(Math.abs(r.change))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commodity Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Commodity Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Pulp (NBSK)", series: pulpSeries },
              { label: "Aluminum (LME)", series: aluminumSeries },
              { label: "Steel (HRC)", series: steelSeries },
            ].map(({ label, series }) => {
              const latest = latestValue(series);
              const prev = series && series.data.length > 1 ? series.data[series.data.length - 2].value : null;
              const change = latest !== null && prev !== null ? latest - prev : 0;
              return (
                <div key={label} className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground mb-1">{label}</div>
                  <div className="text-lg font-bold">
                    {latest !== null ? `$${Math.round(latest).toLocaleString()}` : "N/A"}
                  </div>
                  {change !== 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendIcon value={change} />
                      <span className={`text-xs ${change >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {change >= 0 ? "+" : ""}{Math.round(change).toLocaleString()} {series?.unit}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fleet Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            G2 Ocean Fleet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold">{fleet.total}</div>
              <div className="text-xs text-muted-foreground">Total Vessels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{fleet.laden}</div>
              <div className="text-xs text-muted-foreground">Laden</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{fleet.ballast}</div>
              <div className="text-xs text-muted-foreground">Ballast</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">{fleet.port}</div>
              <div className="text-xs text-muted-foreground">In Port</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{fleet.utilization}%</div>
              <div className="text-xs text-muted-foreground">Utilization</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Fleet utilization stands at {fleet.utilization}% with {fleet.laden} of {fleet.total} tracked vessels currently laden.
            {Number(fleet.utilization) >= 70
              ? " This is a healthy utilization rate, indicating strong cargo demand across the trade network."
              : " Increased ballast legs suggest some trade routes may be experiencing softer demand, warranting a review of positioning strategy."}
          </p>
        </CardContent>
      </Card>

      {/* Outlook */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Outlook &amp; Risk Factors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Near-term freight rate direction depends on China&apos;s infrastructure spending and restocking cycles for steel and aluminum.
            Brazilian pulp exports remain robust, underpinning open hatch demand on the ECSA-Far East and ECSA-Cont trade lanes.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Key risk factors include: (1) potential Red Sea disruptions extending voyage durations and tightening tonnage supply,
            (2) rising bunker costs squeezing TCE margins on longer routes, and (3) newbuilding deliveries in 2027 that could add
            supply pressure if demand growth stalls.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The FFA forward curve indicates the market expects a moderate seasonal uplift through Q2-Q3, with Panamax and Supramax
            segments seeing the strongest contango. G2 Ocean&apos;s hedge book should be reviewed against these forward expectations
            to optimize coverage ratios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
