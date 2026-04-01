"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface CurrencyTimeSeries {
  currency: string;
  label: string;
  data: { date: string; value: number }[];
}

const CURRENCY_COLORS: Record<string, string> = {
  NOK: "#002776",
  EUR: "#003399",
  GBP: "#C8102E",
  SGD: "#EF3340",
  CNY: "#DE2910",
  BRL: "#009C3B",
  JPY: "#BC002D",
  AUD: "#00008B",
};

interface CurrencyChartProps {
  currencies: CurrencyTimeSeries[];
}

export function CurrencyChart({ currencies }: CurrencyChartProps) {
  const [selected, setSelected] = useState<string[]>(["NOK", "EUR", "CNY"]);

  const toggleCurrency = (code: string) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const merged: Record<string, Record<string, number>> = {};
  for (const cur of currencies) {
    if (!selected.includes(cur.currency)) continue;
    for (const point of cur.data) {
      if (!merged[point.date]) merged[point.date] = {};
      merged[point.date][cur.currency] = point.value;
    }
  }

  const chartData = Object.entries(merged)
    .map(([date, values]) => ({ date, ...values }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {currencies.map((c) => (
          <button key={c.currency} onClick={() => toggleCurrency(c.currency)}>
            <Badge
              variant={selected.includes(c.currency) ? "default" : "outline"}
              className="cursor-pointer"
              style={
                selected.includes(c.currency)
                  ? { backgroundColor: CURRENCY_COLORS[c.currency] || "#666" }
                  : undefined
              }
            >
              {c.currency}
            </Badge>
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickFormatter={(d: string) => {
              const dt = new Date(d);
              return `${dt.toLocaleString("default", { month: "short" })} ${dt.getDate()}`;
            }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
            labelFormatter={(l) => new Date(String(l)).toLocaleDateString()}
          />
          <Legend />
          {selected.map((code) => (
            <Line
              key={code}
              type="monotone"
              dataKey={code}
              stroke={CURRENCY_COLORS[code] || "#666"}
              strokeWidth={2}
              dot={false}
              name={currencies.find((c) => c.currency === code)?.label || code}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
