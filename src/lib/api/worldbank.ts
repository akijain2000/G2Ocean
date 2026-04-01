import type { MacroSeriesData } from "@/lib/types";

const BASE_URL = "https://api.worldbank.org/v2";

interface WBIndicatorValue {
  date: string;
  value: number | null;
}

export const WB_INDICATORS = {
  TRADE_GOODS_SERVICES: {
    id: "NE.TRD.GNFS.CD",
    title: "Trade in Goods & Services",
    unit: "Current USD",
  },
  TRADE_PERCENT_GDP: {
    id: "NE.TRD.GNFS.ZS",
    title: "Trade (% of GDP)",
    unit: "% of GDP",
  },
  GDP_GROWTH_WORLD: {
    id: "NY.GDP.MKTP.KD.ZG",
    title: "GDP Growth (Annual %)",
    unit: "Annual %",
    country: "WLD",
  },
  GDP_GROWTH_CHINA: {
    id: "NY.GDP.MKTP.KD.ZG",
    title: "China GDP Growth",
    unit: "Annual %",
    country: "CHN",
  },
  GDP_GROWTH_EU: {
    id: "NY.GDP.MKTP.KD.ZG",
    title: "EU GDP Growth",
    unit: "Annual %",
    country: "EUU",
  },
  CONTAINER_PORT: {
    id: "IS.SHP.GOOD.TU",
    title: "Container Port Traffic",
    unit: "TEU",
    country: "WLD",
  },
  MERCHANDISE_TRADE: {
    id: "TG.VAL.TOTL.GD.ZS",
    title: "Merchandise Trade (% of GDP)",
    unit: "% of GDP",
  },
};

async function fetchWorldBankSeries(
  indicatorId: string,
  country: string = "WLD",
  years: number = 20
): Promise<{ date: string; value: number }[] | null> {
  try {
    const url = `${BASE_URL}/country/${country}/indicator/${indicatorId}?format=json&per_page=${years}&mrv=${years}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const json = await res.json();
    if (!Array.isArray(json) || json.length < 2) return null;

    const dataArray = json[1] as WBIndicatorValue[];
    if (!dataArray || !Array.isArray(dataArray)) return null;

    return dataArray
      .filter((item) => item.value !== null)
      .map((item) => ({
        date: `${item.date}-12-31`,
        value: item.value!,
      }))
      .reverse();
  } catch {
    return null;
  }
}

export async function getWorldBankSeries(
  key: keyof typeof WB_INDICATORS
): Promise<MacroSeriesData | null> {
  const config = WB_INDICATORS[key];
  const country = (config as { country?: string }).country || "WLD";
  const data = await fetchWorldBankSeries(config.id, country);

  if (!data || data.length === 0) return null;

  return {
    seriesId: `WB_${key}`,
    title: config.title,
    unit: config.unit,
    data,
  };
}

export async function getAllWorldBankSeries(): Promise<MacroSeriesData[]> {
  const keys = Object.keys(WB_INDICATORS) as (keyof typeof WB_INDICATORS)[];
  const results = await Promise.all(keys.map((k) => getWorldBankSeries(k)));
  return results.filter((r): r is MacroSeriesData => r !== null);
}
