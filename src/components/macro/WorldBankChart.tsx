"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { MacroSeriesData } from "@/lib/types";

interface WorldBankChartProps {
  series: MacroSeriesData;
}

function formatValue(value: number, unit: string): string {
  if (unit.includes("USD") && value > 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (unit.includes("USD") && value > 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (unit.includes("%")) return `${value.toFixed(1)}%`;
  if (value > 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export function WorldBankChart({ series }: WorldBankChartProps) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <h4 className="font-semibold text-sm">{series.title}</h4>
      <p className="text-xs text-muted-foreground">{series.unit}</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={series.data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id={`wbGrad-${series.seriesId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickFormatter={(d: string) => d.substring(0, 4)}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(v: number) => formatValue(v, series.unit)}
            className="text-muted-foreground"
            width={60}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            formatter={(v) => [formatValue(Number(v), series.unit), series.title]}
            labelFormatter={(l) => `Year: ${String(l).substring(0, 4)}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            fill={`url(#wbGrad-${series.seriesId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
