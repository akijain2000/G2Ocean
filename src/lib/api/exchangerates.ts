const BASE_URL = "https://api.frankfurter.dev";

export interface ExchangeRateData {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface CurrencyTimeSeries {
  currency: string;
  label: string;
  data: { date: string; value: number }[];
}

const SHIPPING_CURRENCIES = {
  NOK: "Norwegian Krone",
  EUR: "Euro",
  GBP: "British Pound",
  SGD: "Singapore Dollar",
  CNY: "Chinese Yuan",
  BRL: "Brazilian Real",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
};

export async function getLatestRates(): Promise<ExchangeRateData | null> {
  try {
    const currencies = Object.keys(SHIPPING_CURRENCIES).join(",");
    const res = await fetch(`${BASE_URL}/v1/latest?base=USD&symbols=${currencies}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getCurrencyTimeSeries(
  currency: string,
  days: number = 90
): Promise<CurrencyTimeSeries | null> {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    const res = await fetch(
      `${BASE_URL}/v1/${startStr}..${endStr}?base=USD&symbols=${currency}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const json = await res.json();
    const rates = json.rates as Record<string, Record<string, number>>;

    const data = Object.entries(rates)
      .map(([date, values]) => ({ date, value: values[currency] }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      currency,
      label: SHIPPING_CURRENCIES[currency as keyof typeof SHIPPING_CURRENCIES] || currency,
      data,
    };
  } catch {
    return null;
  }
}

export async function getAllShippingCurrencies(): Promise<CurrencyTimeSeries[]> {
  const keys = Object.keys(SHIPPING_CURRENCIES);
  const results = await Promise.all(keys.map((k) => getCurrencyTimeSeries(k)));
  return results.filter((r): r is CurrencyTimeSeries => r !== null);
}
