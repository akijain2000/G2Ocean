import type { FreightRateData, MarketIndex, ShippingSegment } from "@/lib/types";

const BASE_URL = "https://api.searates.com/v1";

async function fetchFromSeaRates<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  const apiKey = process.env.SEARATES_API_KEY;
  if (!apiKey || apiKey === "demo") return null;

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("api_key", apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getFreightIndex(): Promise<MarketIndex[]> {
  const data = await fetchFromSeaRates<Record<string, unknown>>("/freight-index");
  if (data) {
    return Object.entries(data).map(([key, val]: [string, unknown]) => ({
      name: key,
      value: (val as Record<string, number>)?.value ?? 0,
      change: (val as Record<string, number>)?.change ?? 0,
      changePercent: (val as Record<string, number>)?.changePercent ?? 0,
      unit: "USD/TEU",
    }));
  }
  return getMockMarketIndices();
}

export async function getFreightRates(segment?: ShippingSegment): Promise<FreightRateData[]> {
  const data = await fetchFromSeaRates<FreightRateData[]>("/rates", segment ? { segment } : undefined);
  if (data) return data;
  return getMockFreightRates(segment);
}

function getMockMarketIndices(): MarketIndex[] {
  return [
    { name: "Baltic Dry Index (BDI)", value: 1847, change: 42, changePercent: 2.33, unit: "Points" },
    { name: "Baltic Capesize Index", value: 3214, change: -18, changePercent: -0.56, unit: "Points" },
    { name: "Baltic Panamax Index", value: 1523, change: 65, changePercent: 4.46, unit: "Points" },
    { name: "Baltic Supramax Index", value: 1102, change: 23, changePercent: 2.13, unit: "Points" },
    { name: "Baltic Handysize Index", value: 687, change: 11, changePercent: 1.63, unit: "Points" },
    { name: "Avg Open Hatch Rate", value: 18500, change: 350, changePercent: 1.93, unit: "USD/Day" },
  ];
}

function getMockFreightRates(segment?: ShippingSegment): FreightRateData[] {
  const segments: ShippingSegment[] = segment
    ? [segment]
    : ["open-hatch", "semi-open", "multipurpose", "dry-bulk"];
  const baseRates: Record<ShippingSegment, number> = {
    "open-hatch": 18500,
    "semi-open": 16200,
    multipurpose: 14800,
    "dry-bulk": 12400,
  };
  const routes: Record<ShippingSegment, string[]> = {
    "open-hatch": ["Pacific RV", "Atlantic RV", "ECSA-Far East"],
    "semi-open": ["Continent-Far East", "USG-Cont", "Med-Far East"],
    multipurpose: ["Global Trip", "Cont-WAF", "Far East-ECSA"],
    "dry-bulk": ["Capesize TC", "Panamax TC", "Supramax TC"],
  };

  const rates: FreightRateData[] = [];
  const now = new Date();

  for (const seg of segments) {
    for (const route of routes[seg]) {
      for (let i = 89; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const base = baseRates[seg];
        const seasonal = Math.sin((date.getMonth() / 12) * Math.PI * 2) * base * 0.12;
        const trend = (90 - i) * (base * 0.001);
        const noise = (Math.random() - 0.5) * base * 0.06;
        const rate = Math.round(base + seasonal + trend + noise);
        const prevRate = i < 89 ? rates[rates.length - 1]?.rate || rate : rate;
        rates.push({
          date: date.toISOString().split("T")[0],
          segment: seg,
          route,
          rate,
          change: Math.round((rate - prevRate) * 100) / 100,
        });
      }
    }
  }
  return rates;
}
