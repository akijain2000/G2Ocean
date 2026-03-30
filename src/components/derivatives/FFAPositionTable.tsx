"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { FFAPosition } from "@/lib/types";
import { ArrowUpDown } from "lucide-react";

interface Props {
  positions: FFAPosition[];
}

type SortKey = "route" | "period" | "direction" | "contractRate" | "currentRate" | "lots" | "mtm";

export function FFAPositionTable({ positions }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("mtm");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...positions].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "number" ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sortAsc ? cmp : -cmp;
    });
  }, [positions, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const totalMtm = positions.reduce((sum, p) => sum + p.mtm, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">FFA Positions ({positions.length})</CardTitle>
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
                  { key: "route" as SortKey, label: "Route" },
                  { key: "period" as SortKey, label: "Period" },
                  { key: "direction" as SortKey, label: "Direction" },
                  { key: "contractRate" as SortKey, label: "Contract" },
                  { key: "currentRate" as SortKey, label: "Current" },
                  { key: "lots" as SortKey, label: "Lots" },
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
              {sorted.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.route}</TableCell>
                  <TableCell>{p.period}</TableCell>
                  <TableCell>
                    <Badge variant={p.direction === "buy" ? "success" : "warning"}>
                      {p.direction.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">${p.contractRate.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums">${p.currentRate.toLocaleString()}</TableCell>
                  <TableCell className="tabular-nums">{p.lots}</TableCell>
                  <TableCell>
                    <span className={`font-semibold tabular-nums ${p.mtm >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {p.mtm >= 0 ? "+" : ""}${p.mtm.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
