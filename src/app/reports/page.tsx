"use client";

import { useState } from "react";
import { ReportBuilder } from "@/components/reports/ReportBuilder";
import { ReportPreview } from "@/components/reports/ReportPreview";
import { exportToPDF, exportToExcel } from "@/lib/utils/export";
import type { MarketIndex, FreightRateData, VesselData, NewbuildingData, CompetitorData, MacroSeriesData } from "@/lib/types";
import {
  getMarketIndices,
  getFreightRates,
  getVessels,
  getNewbuildings,
  getCompetitors,
  getAllMacroSeries,
} from "@/lib/data";
import { formatNumber, formatCompact, formatPercent, formatDate } from "@/lib/utils/formatters";

interface ExportData {
  indices?: MarketIndex[];
  freightRates?: FreightRateData[];
  vessels?: VesselData[];
  newbuildings?: NewbuildingData[];
  competitors?: CompetitorData[];
  macro?: MacroSeriesData[];
}

interface ReportConfig {
  modules: string[];
  format: "pdf" | "excel";
  template: string;
}

export default function ReportsPage() {
  const [config, setConfig] = useState<ReportConfig>({
    modules: ["market", "fleet"],
    format: "pdf",
    template: "weekly",
  });
  const [previewData, setPreviewData] = useState<ExportData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const { modules } = config;
      const data: ExportData = {};

      if (modules.includes("market")) {
        data.indices = getMarketIndices();
        data.freightRates = getFreightRates();
      }
      if (modules.includes("fleet")) {
        data.vessels = getVessels();
        data.newbuildings = getNewbuildings();
      }
      if (modules.includes("competitors")) {
        data.competitors = getCompetitors();
      }
      if (modules.includes("macro")) {
        data.macro = getAllMacroSeries();
      }

      setPreviewData(data);

      const sections = buildSections(data, config.modules);
      const title = getTitle(config.template);

      if (config.format === "pdf") {
        exportToPDF(title, sections);
      } else {
        exportToExcel(title, sections);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Report Generator</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create customized reports with market, fleet, and competitor data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportBuilder
          config={config}
          onConfigChange={setConfig}
          onGenerate={generateReport}
          loading={loading}
        />
        <ReportPreview data={previewData} modules={config.modules} />
      </div>
    </div>
  );
}

function getTitle(template: string): string {
  const titles: Record<string, string> = {
    weekly: "Weekly Market Report",
    monthly: "Monthly Fleet Update",
    quarterly: "Quarterly Competitor Review",
    custom: "Custom Intelligence Report",
  };
  return titles[template] || "G2 Ocean Report";
}

function buildSections(data: ExportData, modules: string[]) {
  const sections: { title: string; headers: string[]; rows: (string | number)[][] }[] = [];

  if (modules.includes("market") && data.indices) {
    sections.push({
      title: "Market Indices",
      headers: ["Index", "Value", "Change", "Change %", "Unit"],
      rows: data.indices.map((i) => [
        i.name,
        formatNumber(i.value),
        i.change > 0 ? `+${i.change}` : String(i.change),
        formatPercent(i.changePercent),
        i.unit,
      ]),
    });
  }

  if (modules.includes("fleet") && data.vessels) {
    sections.push({
      title: "Fleet Overview",
      headers: ["Vessel", "IMO", "Segment", "DWT", "Built", "Status", "Destination"],
      rows: data.vessels.map((v) => [
        v.name, v.imo, v.segment, formatNumber(v.dwt), v.built, v.status, v.destination || "—",
      ]),
    });
  }

  if (modules.includes("fleet") && data.newbuildings) {
    sections.push({
      title: "Newbuilding Orders",
      headers: ["Vessel", "Segment", "DWT", "Yard", "Owner", "Delivery", "Status"],
      rows: data.newbuildings.map((n) => [
        n.vesselName || "TBN", n.segment, formatNumber(n.dwt), n.yard, n.owner, formatDate(n.deliveryDate), n.status,
      ]),
    });
  }

  if (modules.includes("competitors") && data.competitors) {
    sections.push({
      title: "Competitor Analysis",
      headers: ["Operator", "Vessels", "Total DWT", "Avg Age", "Open Hatch", "Semi-Open", "MPP", "Dry Bulk"],
      rows: data.competitors.map((c) => [
        c.name, c.vessels, formatCompact(c.totalDwt), `${c.avgAge} yrs`,
        c.segments["open-hatch"], c.segments["semi-open"], c.segments["multipurpose"], c.segments["dry-bulk"],
      ]),
    });
  }

  if (modules.includes("macro") && data.macro) {
    for (const series of data.macro) {
      const latestData = series.data.slice(-12);
      sections.push({
        title: series.title,
        headers: ["Date", "Value", "Unit"],
        rows: latestData.map((d) => [formatDate(d.date), formatNumber(d.value, 2), series.unit]),
      });
    }
  }

  return sections;
}
