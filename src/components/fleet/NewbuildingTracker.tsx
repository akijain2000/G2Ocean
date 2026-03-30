"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SEGMENTS, type NewbuildingData } from "@/lib/types";
import { formatDate, formatNumber } from "@/lib/utils/formatters";

interface Props {
  newbuildings: NewbuildingData[];
}

export function NewbuildingTracker({ newbuildings }: Props) {
  const getSegmentColor = (segment: string) =>
    SEGMENTS.find((s) => s.value === segment)?.color || "#666";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Newbuilding Orders ({newbuildings.length} vessels)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vessel</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>DWT</TableHead>
              <TableHead>Yard</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newbuildings.map((nb) => (
              <TableRow key={nb.id}>
                <TableCell className="font-medium">
                  {nb.vesselName || "TBN"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getSegmentColor(nb.segment) }}
                    />
                    {SEGMENTS.find((s) => s.value === nb.segment)?.label}
                  </div>
                </TableCell>
                <TableCell className="tabular-nums">{formatNumber(nb.dwt)}</TableCell>
                <TableCell>{nb.yard}</TableCell>
                <TableCell>{nb.owner}</TableCell>
                <TableCell>{formatDate(nb.orderDate)}</TableCell>
                <TableCell>{formatDate(nb.deliveryDate)}</TableCell>
                <TableCell>
                  <Badge
                    variant={nb.status === "Under Construction" ? "warning" : "secondary"}
                  >
                    {nb.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
