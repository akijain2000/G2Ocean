"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { CompetitorData } from "@/lib/types";
import { formatCompact } from "@/lib/utils/formatters";

const COLORS = [
  "#0066CC", "#00A651", "#FF8C00", "#CC0033",
  "#6B5CE7", "#00BCD4", "#FF5722", "#795548",
];

interface Props {
  competitors: CompetitorData[];
  metric: "vessels" | "dwt";
}

export function MarketShareChart({ competitors, metric }: Props) {
  const data = competitors.map((c) => ({
    name: c.name,
    value: metric === "vessels" ? c.vessels : c.totalDwt,
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">
            Market Share by {metric === "vessels" ? "Fleet Count" : "Total DWT"}
          </CardTitle>
          <DataSourceBadge source="Clarksons / Internal Analysis" isRealTime={false} description="Fleet and capacity data compiled from Clarksons Shipping Intelligence and internal competitive analysis. Updated quarterly." />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                metric === "dwt" ? formatCompact(Number(value)) : value,
                metric === "vessels" ? "Vessels" : "DWT",
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Legend
              formatter={(value: string) => {
                const item = data.find((d) => d.name === value);
                const pct = item && total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
                return `${value} (${pct}%)`;
              }}
              wrapperStyle={{ fontSize: "11px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
