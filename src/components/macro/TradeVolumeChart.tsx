"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MacroSeriesData } from "@/lib/types";
import { formatDateWithYear } from "@/lib/utils/formatters";

interface Props {
  series: MacroSeriesData;
}

export function TradeVolumeChart({ series }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">{series.title}</CardTitle>
          <DataSourceBadge source="FRED / CPB" isRealTime={false} description="World trade volume index from the CPB Netherlands Bureau, accessed via the Federal Reserve Economic Data (FRED) API. Monthly data with a 2-month publication lag." />
        </div>
        <CardDescription>{series.unit}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={series.data}>
            <defs>
              <linearGradient id="tradeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066CC" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" tickFormatter={formatDateWithYear} tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} width={50} domain={[(min: number) => Math.floor(min / 10) * 10, (max: number) => Math.ceil(max / 10) * 10]} />
            <Tooltip
              labelFormatter={(label) => formatDateWithYear(String(label))}
              formatter={(value) => [Number(value).toFixed(2), series.title]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0066CC"
              fill="url(#tradeGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
