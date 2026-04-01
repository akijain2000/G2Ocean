import type { MacroSeriesData } from "@/lib/types";

const BASE_URL = "https://api.stlouisfed.org/fred";

interface FredObservation {
  date: string;
  value: string;
}

interface FredSeriesResponse {
  observations: FredObservation[];
}

export const FRED_SERIES = {
  TRADE_VOLUME: { id: "WDTIVOL", title: "World Trade Volume", unit: "Index (2010=100)" },
  COMMODITY_INDEX: { id: "PALLFNFINDEXM", title: "Global Commodity Price Index", unit: "Index (2016=100)" },
  IRON_ORE: { id: "PIORECRUSDM", title: "Iron Ore Price", unit: "USD/DMT" },
  COAL: { id: "PCOALAUUSDM", title: "Coal Price (Australian)", unit: "USD/MT" },
  PULP: { id: "PPULPUSDM", title: "Pulp Price (NBSK)", unit: "USD/MT" },
  ALUMINUM: { id: "PALUMUSDM", title: "Aluminum Price (LME)", unit: "USD/MT" },
  STEEL: { id: "PSTEEUSDM", title: "Steel Price (HRC)", unit: "USD/MT" },
  GDP_WORLD: { id: "NYGDPMKTPCDWLD", title: "World GDP", unit: "Current USD" },
  GDP_CHINA: { id: "NYGDPMKTPCDCHN", title: "China GDP", unit: "Current USD" },
  GDP_EU: { id: "NYGDPMKTPCDEUU", title: "EU GDP", unit: "Current USD" },
};

async function fetchFredSeries(seriesId: string): Promise<FredObservation[] | null> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey || apiKey === "demo") return null;

  try {
    const url = `${BASE_URL}/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=120`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data: FredSeriesResponse = await res.json();
    return data.observations.filter((o) => o.value !== ".");
  } catch {
    return null;
  }
}

export async function getMacroSeries(seriesKey: keyof typeof FRED_SERIES): Promise<MacroSeriesData> {
  const config = FRED_SERIES[seriesKey];
  const observations = await fetchFredSeries(config.id);

  if (observations) {
    return {
      seriesId: config.id,
      title: config.title,
      unit: config.unit,
      data: observations
        .map((o) => ({ date: o.date, value: parseFloat(o.value) }))
        .filter((o) => !isNaN(o.value))
        .reverse(),
    };
  }

  return getMockMacroSeries(seriesKey);
}

export async function getAllMacroSeries(): Promise<MacroSeriesData[]> {
  const keys = Object.keys(FRED_SERIES) as (keyof typeof FRED_SERIES)[];
  return Promise.all(keys.map((k) => getMacroSeries(k)));
}

function getMockMacroSeries(key: keyof typeof FRED_SERIES): MacroSeriesData {
  const config = FRED_SERIES[key];
  const data: { date: string; value: number }[] = [];
  const now = new Date();

  const baseValues: Record<string, number> = {
    TRADE_VOLUME: 110,
    COMMODITY_INDEX: 145,
    IRON_ORE: 108,
    COAL: 135,
    PULP: 850,
    ALUMINUM: 2450,
    STEEL: 680,
    GDP_WORLD: 105e12,
    GDP_CHINA: 18.3e12,
    GDP_EU: 16.8e12,
  };

  const base = baseValues[key] || 100;
  const isGDP = key.startsWith("GDP");
  const points = isGDP ? 20 : 60;

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), 1);
    if (isGDP) {
      date.setFullYear(date.getFullYear() - i);
    } else {
      date.setMonth(date.getMonth() - i);
    }
    const trend = (points - i) * base * (isGDP ? 0.025 : 0.003);
    const cycle = Math.sin(((points - i) / points) * Math.PI * 3) * base * 0.08;
    const noise = (Math.random() - 0.5) * base * 0.04;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round((base + trend + cycle + noise) * 100) / 100,
    });
  }

  return { seriesId: config.id, title: config.title, unit: config.unit, data };
}
