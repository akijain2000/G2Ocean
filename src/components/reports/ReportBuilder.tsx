"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download } from "lucide-react";

interface ReportConfig {
  modules: string[];
  format: "pdf" | "excel";
  template: string;
}

interface Props {
  config: ReportConfig;
  onConfigChange: (config: ReportConfig) => void;
  onGenerate: () => void;
  loading: boolean;
}

const MODULE_OPTIONS = [
  { id: "market", label: "Market Overview", description: "Freight rates, indices, and segment performance" },
  { id: "fleet", label: "Fleet Data", description: "Vessel positions, fleet composition, newbuildings" },
  { id: "competitors", label: "Competitor Analysis", description: "Market share and fleet comparison" },
  { id: "macro", label: "Macro Trends", description: "Trade volumes, commodity prices, GDP" },
  { id: "forecast", label: "Forecasting", description: "Rate forecasts, trade budget variance, seasonal patterns" },
  { id: "derivatives", label: "Derivatives & Risk", description: "FFA positions, bunker hedges, risk summary" },
];

const TEMPLATE_OPTIONS = [
  { id: "weekly", label: "Weekly Market Report" },
  { id: "monthly", label: "Monthly Fleet Update" },
  { id: "quarterly", label: "Quarterly Competitor Review" },
  { id: "custom", label: "Custom Report" },
];

export function ReportBuilder({ config, onConfigChange, onGenerate, loading }: Props) {
  const toggleModule = (moduleId: string) => {
    const modules = config.modules.includes(moduleId)
      ? config.modules.filter((m) => m !== moduleId)
      : [...config.modules, moduleId];
    onConfigChange({ ...config, modules });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Report Configuration</CardTitle>
        <CardDescription>Select modules and format for your report</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Report Template</label>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_OPTIONS.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => onConfigChange({ ...config, template: tpl.id })}
                className={`p-3 rounded-md border text-sm text-left transition-colors ${
                  config.template === tpl.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-accent"
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Include Modules</label>
          <div className="space-y-2">
            {MODULE_OPTIONS.map((mod) => (
              <label
                key={mod.id}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  config.modules.includes(mod.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={config.modules.includes(mod.id)}
                  onChange={() => toggleModule(mod.id)}
                  className="mt-0.5 h-4 w-4 rounded border-input"
                />
                <div>
                  <p className="text-sm font-medium">{mod.label}</p>
                  <p className="text-xs text-muted-foreground">{mod.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Export Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onConfigChange({ ...config, format: "pdf" })}
              className={`flex items-center gap-2 p-3 rounded-md border text-sm transition-colors ${
                config.format === "pdf"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              <FileText className="h-4 w-4" />
              PDF Document
            </button>
            <button
              onClick={() => onConfigChange({ ...config, format: "excel" })}
              className={`flex items-center gap-2 p-3 rounded-md border text-sm transition-colors ${
                config.format === "excel"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel Spreadsheet
            </button>
          </div>
        </div>

        <Button
          onClick={onGenerate}
          disabled={config.modules.length === 0 || loading}
          className="w-full"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  );
}
