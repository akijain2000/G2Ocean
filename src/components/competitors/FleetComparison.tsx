"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/ui/data-source";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { SEGMENTS, type CompetitorData } from "@/lib/types";
import { formatCompact } from "@/lib/utils/formatters";

interface Props {
  competitors: CompetitorData[];
}

export function FleetComparison({ competitors }: Props) {
  const chartData = competitors.map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
    ...Object.fromEntries(SEGMENTS.map((s) => [s.label, c.segments[s.value]])),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base">Fleet Composition by Segment</CardTitle>
            <DataSourceBadge source="Clarksons / Internal Analysis" isRealTime={false} description="Stacked segment breakdown shows how many vessels each competitor has in each segment type. Based on Clarksons fleet data cross-referenced with internal intelligence." />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {SEGMENTS.map((seg) => (
                <Bar key={seg.value} dataKey={seg.label} stackId="a" fill={seg.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Competitor Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator</TableHead>
                <TableHead className="text-right">Vessels</TableHead>
                <TableHead className="text-right">Total DWT</TableHead>
                <TableHead className="text-right">Avg Age</TableHead>
                {SEGMENTS.map((seg) => (
                  <TableHead key={seg.value} className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
                      {seg.label}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((c) => (
                <TableRow key={c.name} className={c.name === "G2 Ocean" ? "bg-primary/5" : ""}>
                  <TableCell className="font-medium">
                    {c.name}
                    {c.name === "G2 Ocean" && (
                      <Badge variant="default" className="ml-2 text-[10px]">You</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{c.vessels}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCompact(c.totalDwt)}</TableCell>
                  <TableCell className="text-right tabular-nums">{c.avgAge} yrs</TableCell>
                  {SEGMENTS.map((seg) => (
                    <TableCell key={seg.value} className="text-right tabular-nums">
                      {c.segments[seg.value]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
