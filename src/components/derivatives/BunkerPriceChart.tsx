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
import { formatDateWithYear } from "@/lib/utils/formatters";

interface PricePoint {
  date: string;
  vlsfo: number;
  hsfo: number;
  mgo: number;
}

interface Props {
  data: PricePoint[];
}

export function BunkerPriceChart({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bunker Fuel Prices (90-Day)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateWithYear}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              width={50}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              labelFormatter={(label) => formatDateWithYear(String(label))}
              formatter={(value, name) => [`$${Number(value)}/MT`, String(name)]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Line type="monotone" dataKey="vlsfo" name="VLSFO" stroke="#0066CC" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="hsfo" name="HSFO" stroke="#333333" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="mgo" name="MGO" stroke="#FF8C00" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
