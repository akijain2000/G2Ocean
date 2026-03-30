"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MacroSeriesData } from "@/lib/types";
import { formatCompact } from "@/lib/utils/formatters";
import { useMemo } from "react";

const GDP_COLORS: Record<string, string> = {
  NYGDPMKTPCDWLD: "#0066CC",
  NYGDPMKTPCDCHN: "#CC0033",
  NYGDPMKTPCDEUU: "#00A651",
};

interface Props {
  seriesList: MacroSeriesData[];
}

export function GDPChart({ seriesList }: Props) {
  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number | string>>();

    for (const series of seriesList) {
      for (const point of series.data) {
        const year = point.date.slice(0, 4);
        const existing = dateMap.get(year) || { year };
        existing[series.seriesId] = point.value;
        dateMap.set(year, existing);
      }
    }

    return Array.from(dateMap.values())
      .sort((a, b) => (a.year as string).localeCompare(b.year as string))
      .slice(-15);
  }, [seriesList]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">GDP by Region (Current USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11 }} width={50} />
            <Tooltip
              formatter={(value) => [formatCompact(Number(value)), "GDP"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            {seriesList.map((series) => (
              <Bar
                key={series.seriesId}
                dataKey={series.seriesId}
                name={series.title}
                fill={GDP_COLORS[series.seriesId] || "#666"}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
