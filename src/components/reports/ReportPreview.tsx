"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Ship, Users, TrendingUp, BarChart3 } from "lucide-react";
import type { MarketIndex, VesselData, CompetitorData, MacroSeriesData, FreightRateData, NewbuildingData } from "@/lib/types";
import { formatNumber, formatCompact, formatPercent } from "@/lib/utils/formatters";

interface ExportData {
  indices?: MarketIndex[];
  freightRates?: FreightRateData[];
  vessels?: VesselData[];
  newbuildings?: NewbuildingData[];
  competitors?: CompetitorData[];
  macro?: MacroSeriesData[];
}

interface Props {
  data: ExportData | null;
  modules: string[];
}

export function ReportPreview({ data, modules }: Props) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Configure and generate a report to see the preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Report Preview</CardTitle>
          <Badge variant="secondary">{modules.length} modules</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[600px] overflow-auto">
        <div className="border-b pb-4">
          <h3 className="text-lg font-bold text-primary">G2 Ocean Market Intelligence Report</h3>
          <p className="text-xs text-muted-foreground">
            Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {data.indices && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4 text-primary" />
              Market Indices
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.indices.map((idx) => (
                <div key={idx.name} className="p-2 rounded-md bg-muted/50 text-xs">
                  <p className="text-muted-foreground">{idx.name}</p>
                  <p className="font-semibold tabular-nums">
                    {formatNumber(idx.value)} <span className={idx.change >= 0 ? "text-emerald-600" : "text-red-600"}>{formatPercent(idx.changePercent)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.vessels && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Ship className="h-4 w-4 text-primary" />
              Fleet Summary
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-muted-foreground">Total Vessels</p>
                <p className="font-semibold text-lg">{data.vessels.length}</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-muted-foreground">Total DWT</p>
                <p className="font-semibold text-lg">{formatCompact(data.vessels.reduce((s, v) => s + v.dwt, 0))}</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-muted-foreground">Newbuildings</p>
                <p className="font-semibold text-lg">{data.newbuildings?.length || 0}</p>
              </div>
            </div>
          </div>
        )}

        {data.competitors && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-primary" />
              Competitor Summary ({data.competitors.length} operators)
            </div>
            <div className="space-y-1">
              {data.competitors.slice(0, 5).map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/50">
                  <span className="font-medium">{c.name}</span>
                  <span className="tabular-nums">{c.vessels} vessels / {formatCompact(c.totalDwt)} DWT</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.macro && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-primary" />
              Macro Indicators
            </div>
            <div className="space-y-1">
              {data.macro.map((s) => {
                if (!s.data.length) return null;
                const latest = s.data[s.data.length - 1];
                return (
                  <div key={s.seriesId} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/50">
                    <span>{s.title}</span>
                    <span className="tabular-nums font-medium">
                      {latest.value > 1e9 ? formatCompact(latest.value) : formatNumber(latest.value, 2)} {s.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
