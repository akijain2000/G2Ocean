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
import type { MacroSeriesData } from "@/lib/types";
import { formatDateWithYear } from "@/lib/utils/formatters";
import { useMemo } from "react";

const COMMODITY_COLORS: Record<string, string> = {
  PALLFNFINDEXM: "#0066CC",
  PIORECRUSDM: "#CC0033",
  PCOALAUUSDM: "#333333",
  PWHEAMTUSDM: "#FF8C00",
};

interface Props {
  seriesList: MacroSeriesData[];
}

export function CommodityPriceChart({ seriesList }: Props) {
  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number | string>>();

    for (const series of seriesList) {
      for (const point of series.data) {
        const existing = dateMap.get(point.date) || { date: point.date };
        existing[series.seriesId] = point.value;
        dateMap.set(point.date, existing);
      }
    }

    return Array.from(dateMap.values()).sort((a, b) =>
      (a.date as string).localeCompare(b.date as string)
    );
  }, [seriesList]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Commodity Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tickFormatter={formatDateWithYear} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} width={50} domain={[(min: number) => Math.floor(min / 10) * 10, (max: number) => Math.ceil(max / 10) * 10]} />
            <Tooltip
              labelFormatter={(label) => formatDateWithYear(String(label))}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            {seriesList.map((series) => (
              <Line
                key={series.seriesId}
                type="monotone"
                dataKey={series.seriesId}
                name={series.title}
                stroke={COMMODITY_COLORS[series.seriesId] || "#666"}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
