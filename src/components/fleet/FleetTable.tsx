"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SEGMENTS, COMMODITIES, type VesselData } from "@/lib/types";
import { ArrowUpDown, Search } from "lucide-react";

interface Props {
  vessels: VesselData[];
}

type SortKey = "name" | "segment" | "dwt" | "built" | "status" | "cargo";

export function FleetTable({ vessels }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let result = [...vessels];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.imo.includes(q) ||
          v.operator.toLowerCase().includes(q) ||
          v.destination?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === "number" ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [vessels, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const statusVariant = (status: string) => {
    if (status === "Laden") return "success" as const;
    if (status === "Ballast") return "warning" as const;
    return "secondary" as const;
  };

  const getSegmentColor = (segment: string) =>
    SEGMENTS.find((s) => s.value === segment)?.color || "#666";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">Fleet Overview ({filtered.length} vessels)</CardTitle>
            <DataSourceBadge source="MarineTraffic AIS" isRealTime={false} description="Vessel positions and status from AIS transponder data. In production, this data would be fetched from the MarineTraffic API in near real-time." />
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vessels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { key: "name" as SortKey, label: "Vessel" },
                  { key: "segment" as SortKey, label: "Segment" },
                  { key: "dwt" as SortKey, label: "DWT" },
                  { key: "built" as SortKey, label: "Built" },
                  { key: "status" as SortKey, label: "Status" },
                  { key: "cargo" as SortKey, label: "Cargo" },
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
                <TableHead>Destination</TableHead>
                <TableHead>ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.imo}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">IMO: {v.imo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: getSegmentColor(v.segment) }}
                      />
                      <span className="text-sm">
                        {SEGMENTS.find((s) => s.value === v.segment)?.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{v.dwt.toLocaleString()}</TableCell>
                  <TableCell>{v.built}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(v.status)}>{v.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {v.cargo ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: COMMODITIES.find((c) => c.value === v.cargo)?.color || "#666" }}
                        />
                        <span className="text-sm">{COMMODITIES.find((c) => c.value === v.cargo)?.label || v.cargo}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{v.destination || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{v.eta || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
