"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { BunkerHedge } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";

interface Props {
  hedges: BunkerHedge[];
}

type SortKey = "fuelType" | "period" | "hedgedPrice" | "currentPrice" | "volume" | "mtm";

const FUEL_COLORS: Record<string, string> = {
  VLSFO: "#0066CC",
  HSFO: "#333333",
  MGO: "#FF8C00",
};

export function BunkerHedgeTable({ hedges }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("mtm");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...hedges].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "number" ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sortAsc ? cmp : -cmp;
    });
  }, [hedges, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const totalMtm = hedges.reduce((sum, h) => sum + h.mtm, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Bunker Hedges ({hedges.length})</CardTitle>
            <DataSourceBadge source="Platts / ICE" isRealTime={false} description="Bunker hedge positions valued against S&P Global Platts benchmark prices. VLSFO/HSFO priced on Singapore/Rotterdam markers; MGO on NWE marker. Contract data from OTC broker confirmations." />
          </div>
          <span className={`text-sm font-semibold ${totalMtm >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            Total M2M: ${totalMtm.toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { key: "fuelType" as SortKey, label: "Fuel" },
                  { key: "period" as SortKey, label: "Period" },
                  { key: "hedgedPrice" as SortKey, label: "Hedged ($/MT)" },
                  { key: "currentPrice" as SortKey, label: "Current ($/MT)" },
                  { key: "volume" as SortKey, label: "Volume (MT)" },
                  { key: "mtm" as SortKey, label: "M2M P&L" },
                ].map((col) => (
                  <TableHead key={col.key}>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort(col.key)}>
                      {col.label}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                ))}
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>
                    <Badge style={{ backgroundColor: FUEL_COLORS[h.fuelType], borderColor: FUEL_COLORS[h.fuelType], color: "#fff" }}>
                      {h.fuelType}
                    </Badge>
                  </TableCell>
                  <TableCell>{h.period}</TableCell>
                  <TableCell className="tabular-nums">${h.hedgedPrice}</TableCell>
                  <TableCell className="tabular-nums">${h.currentPrice}</TableCell>
                  <TableCell className="tabular-nums">{h.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`font-semibold tabular-nums ${h.mtm >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {h.mtm >= 0 ? "+" : ""}${h.mtm.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{h.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
