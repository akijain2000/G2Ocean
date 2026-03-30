"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ForecastPoint } from "@/lib/types";
import { formatDateWithYear } from "@/lib/utils/formatters";
import { formatCurrency } from "@/lib/utils/formatters";

interface Props {
  data: ForecastPoint[];
}

export function RateForecastChart({ data }: Props) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">Rate Forecast (12-Month Forward)</CardTitle>
          <DataSourceBadge source="Internal Model" isRealTime={false} description="Forecast generated from G2 Ocean's internal quantitative model combining historical rate data, seasonal decomposition, forward freight agreement (FFA) curves, and macroeconomic indicators. Updated weekly." />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Solid line = actuals, dashed = forecast, shaded area = 95% confidence interval</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateWithYear}
              tick={{ fontSize: 10 }}
              interval={Math.floor(data.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              width={60}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              labelFormatter={(label) => formatDateWithYear(String(label))}
              formatter={(value, name) => {
                const n = String(name);
                const label =
                  n === "actual" ? "Actual" :
                  n === "forecast" ? "Forecast" :
                  n === "upper" ? "Upper Band" :
                  n === "lower" ? "Lower Band" :
                  n;
                return [formatCurrency(Number(value)), label];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px" }}
              formatter={(value) =>
                value === "actual" ? "Actual" :
                value === "forecast" ? "Forecast" :
                value === "band" ? "Confidence Band" : value
              }
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#0066CC"
              fillOpacity={0.08}
              name="band"
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
              name="lower"
              legendType="none"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#0066CC"
              strokeWidth={2}
              dot={false}
              name="actual"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#FF8C00"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              name="forecast"
            />
            <ReferenceLine
              x={today}
              stroke="#CC0033"
              strokeDasharray="4 4"
              label={{ value: "Today", position: "top", fontSize: 10 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
