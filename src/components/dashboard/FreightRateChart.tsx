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
import { SEGMENTS, type FreightRateData, type ShippingSegment } from "@/lib/types";
import { formatCurrency, formatDateShort } from "@/lib/utils/formatters";
import { useMemo } from "react";

interface Props {
  data: FreightRateData[];
  selectedSegments: ShippingSegment[];
}

export function FreightRateChart({ data, selectedSegments }: Props) {
  const chartData = useMemo(() => {
    const byDate = new Map<string, Record<string, string | number>>();

    for (const rate of data) {
      if (!selectedSegments.includes(rate.segment)) continue;
      const existing = byDate.get(rate.date) || { date: rate.date };
      const key = `${rate.segment}_${rate.route}`;
      existing[key] = rate.rate;
      byDate.set(rate.date, existing);
    }

    return Array.from(byDate.values())
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .filter((_, i, arr) => i % 3 === 0 || i === arr.length - 1);
  }, [data, selectedSegments]);

  const lines = useMemo(() => {
    const lineKeys = new Set<string>();
    for (const rate of data) {
      if (selectedSegments.includes(rate.segment)) {
        lineKeys.add(`${rate.segment}_${rate.route}`);
      }
    }
    return Array.from(lineKeys).map((key) => {
      const [seg, ...routeParts] = key.split("_");
      const segConfig = SEGMENTS.find((s) => s.value === seg);
      return {
        dataKey: key,
        name: `${segConfig?.label || seg} - ${routeParts.join("_")}`,
        color: segConfig?.color || "#666",
      };
    });
  }, [data, selectedSegments]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Freight Rate Trends (90 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fontSize: 11 }}
              width={70}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={(label) => formatDateShort(String(label))}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
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
