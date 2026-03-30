"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataSourceBadge } from "@/components/ui/data-source";
import { SEGMENTS, type FreightRateData, type ShippingSegment } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/utils/formatters";
import { useMemo, useState } from "react";

interface Props {
  data: FreightRateData[];
  selectedSegments: ShippingSegment[];
}

export function FreightRateChart({ data, selectedSegments }: Props) {
  const [drillSegment, setDrillSegment] = useState<ShippingSegment | null>(null);

  const segmentAvgData = useMemo(() => {
    const byDate = new Map<string, Record<string, { total: number; count: number }>>();

    for (const rate of data) {
      if (!selectedSegments.includes(rate.segment)) continue;
      const bucket = byDate.get(rate.date) || {};
      if (!bucket[rate.segment]) bucket[rate.segment] = { total: 0, count: 0 };
      bucket[rate.segment].total += rate.rate;
      bucket[rate.segment].count += 1;
      byDate.set(rate.date, bucket);
    }

    return Array.from(byDate.entries())
      .map(([date, segs]) => {
        const row: Record<string, string | number> = { date };
        for (const seg of selectedSegments) {
          if (segs[seg]) row[seg] = Math.round(segs[seg].total / segs[seg].count);
        }
        return row;
      })
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .filter((_, i, arr) => i % 3 === 0 || i === arr.length - 1);
  }, [data, selectedSegments]);

  const routeData = useMemo(() => {
    if (!drillSegment) return [];
    const byDate = new Map<string, Record<string, string | number>>();

    for (const rate of data) {
      if (rate.segment !== drillSegment) continue;
      const existing = byDate.get(rate.date) || { date: rate.date };
      existing[rate.route] = rate.rate;
      byDate.set(rate.date, existing);
    }

    return Array.from(byDate.values())
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .filter((_, i, arr) => i % 3 === 0 || i === arr.length - 1);
  }, [data, drillSegment]);

  const routeNames = useMemo(() => {
    if (!drillSegment) return [];
    const names = new Set<string>();
    for (const rate of data) {
      if (rate.segment === drillSegment) names.add(rate.route);
    }
    return Array.from(names);
  }, [data, drillSegment]);

  const ROUTE_PALETTE = [
    "#0066CC", "#CC0033", "#00A651", "#FF8C00", "#9B59B6",
    "#E91E63", "#00BCD4", "#795548", "#607D8B", "#FF5722",
    "#4CAF50", "#3F51B5", "#CDDC39", "#F44336", "#009688",
  ];

  const drillSegConfig = drillSegment ? SEGMENTS.find((s) => s.value === drillSegment) : null;

  const showDrill = drillSegment && routeData.length > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">
            {showDrill
              ? `${drillSegConfig?.label} Routes (90 Days)`
              : "Freight Rate Trends (90 Days)"}
          </CardTitle>
          <DataSourceBadge source="SeaRates API" isRealTime={false} description="Daily freight rates per route and segment. Shows time charter equivalent (TCE) rates in USD/day over a rolling 90-day window. When API keys are configured, data switches to live SeaRates feeds." />
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
          <p className="text-xs text-muted-foreground">
            {showDrill
              ? `Individual route rates for ${drillSegConfig?.label} vessels. Click "All Segments" to go back.`
              : "Averaged TCE rates per segment. Click a segment name in the legend to drill into individual routes."}
          </p>
          {showDrill && (
            <button
              onClick={() => setDrillSegment(null)}
              className="text-xs text-primary font-medium hover:underline"
            >
              ← All Segments
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          {showDrill ? (
            <LineChart data={routeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} width={70} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => formatDateShort(String(label))}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))", fontSize: "12px", maxHeight: "300px", overflowY: "auto" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {routeNames.map((route, i) => (
                <Line
                  key={route}
                  type="monotone"
                  dataKey={route}
                  name={route}
                  stroke={ROUTE_PALETTE[i % ROUTE_PALETTE.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          ) : (
            <LineChart data={segmentAvgData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11 }} width={70} />
              <Tooltip
                formatter={(value, name) => {
                  const seg = SEGMENTS.find((s) => s.value === String(name));
                  return [formatCurrency(Number(value)) + "/day", seg?.label || String(name)];
                }}
                labelFormatter={(label) => formatDateShort(String(label))}
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", cursor: "pointer" }}
                onClick={(e) => {
                  const seg = e.dataKey as ShippingSegment;
                  if (selectedSegments.includes(seg)) setDrillSegment(seg);
                }}
                formatter={(value) => {
                  const seg = SEGMENTS.find((s) => s.value === value);
                  return seg?.label || value;
                }}
              />
              {selectedSegments.map((seg) => {
                const segConfig = SEGMENTS.find((s) => s.value === seg);
                return (
                  <Line
                    key={seg}
                    type="monotone"
                    dataKey={seg}
                    name={seg}
                    stroke={segConfig?.color || "#666"}
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                  />
                );
              })}
            </LineChart>
          )}
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
