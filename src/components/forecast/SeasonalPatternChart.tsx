"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
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
import type { SeasonalPattern } from "@/lib/types";

interface Props {
  data: SeasonalPattern[];
}

export function SeasonalPatternChart({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base">Seasonal Rate Patterns (Monthly)</CardTitle>
          <DataSourceBadge source="Historical Analysis" isRealTime={false} description="5-year historical average, minimum, and maximum TCE rates for each calendar month. Reveals predictable seasonal cycles driven by crop harvests, industrial output, and weather patterns." />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              width={60}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value, name) => {
                const n = String(name);
                const label = n === "avgRate" ? "Average" : n === "minRate" ? "Min" : n === "maxRate" ? "Max" : n;
                return [`$${Number(value).toLocaleString()}/day`, label];
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
                value === "maxRate" ? "Max" : value === "avgRate" ? "Average" : value === "minRate" ? "Min" : value
              }
            />
            <Bar dataKey="maxRate" fill="#0066CC" opacity={0.3} name="maxRate" />
            <Bar dataKey="avgRate" fill="#0066CC" name="avgRate" />
            <Bar dataKey="minRate" fill="#0066CC" opacity={0.3} name="minRate" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
