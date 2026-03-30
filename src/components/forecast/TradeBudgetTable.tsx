"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SEGMENTS, type TradeBudgetData } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";

interface Props {
  data: TradeBudgetData[];
}

type SortKey = "route" | "segment" | "budgetedRate" | "currentRate" | "variance" | "variancePercent" | "voyages";

export function TradeBudgetTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("variancePercent");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "number" ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sortAsc ? cmp : -cmp;
    });
  }, [data, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const getSegmentColor = (segment: string) =>
    SEGMENTS.find((s) => s.value === segment)?.color || "#666";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-base">Trade Budget vs Actual ({data.length} routes)</CardTitle>
          <DataSourceBadge source="Internal Budget System" isRealTime={false} description="Budget rates set during annual planning vs current market rates from SeaRates/internal systems. Positive variance (green) means the market is above budget; negative (red) means below." />
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { key: "route" as SortKey, label: "Route" },
                  { key: "segment" as SortKey, label: "Segment" },
                  { key: "budgetedRate" as SortKey, label: "Budget (USD/Day)" },
                  { key: "currentRate" as SortKey, label: "Current (USD/Day)" },
                  { key: "variance" as SortKey, label: "Variance" },
                  { key: "variancePercent" as SortKey, label: "Var %" },
                  { key: "voyages" as SortKey, label: "Voyages" },
                ].map((col) => (
                  <TableHead key={col.key}>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((row) => (
                <TableRow key={`${row.route}-${row.segment}`}>
                  <TableCell className="font-medium">{row.route}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getSegmentColor(row.segment) }} />
                      <span className="text-sm">{SEGMENTS.find((s) => s.value === row.segment)?.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">${row.budgetedRate.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums">${row.currentRate.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={row.variance >= 0 ? "text-green-600" : "text-red-600"}>
                      {row.variance >= 0 ? "+" : ""}${row.variance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.variancePercent >= 0 ? "success" : "destructive"}>
                      {row.variancePercent >= 0 ? "+" : ""}{row.variancePercent}%
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{row.voyages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
