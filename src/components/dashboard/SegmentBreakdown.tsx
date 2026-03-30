"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DataSourceBadge } from "@/components/ui/data-source";
import { SEGMENTS, type FreightRateData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatters";
import { useMemo } from "react";

export function SegmentBreakdown({ data }: { data: FreightRateData[] }) {
  const chartData = useMemo(() => {
    const latest = new Map<string, { total: number; count: number }>();

    for (const rate of data) {
      const key = rate.segment;
      const existing = latest.get(key) || { total: 0, count: 0 };
      existing.total += rate.rate;
      existing.count += 1;
      latest.set(key, existing);
    }

    return SEGMENTS.map((seg) => {
      const stats = latest.get(seg.value);
      return {
        name: seg.label,
        segment: seg.value,
        avgRate: stats ? Math.round(stats.total / stats.count) : 0,
        color: seg.color,
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">Average Rates by Segment</CardTitle>
          <DataSourceBadge source="SeaRates API" isRealTime={false} description="Average TCE rates across all routes within each vessel segment. Computed from the latest available rate snapshot for each route." />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Mean time charter rates across all routes for each vessel segment type
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              width={110}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)) + "/day", "Avg Rate"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Bar dataKey="avgRate" radius={[0, 4, 4, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
