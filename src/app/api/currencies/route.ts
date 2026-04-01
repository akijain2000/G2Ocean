import { NextResponse } from "next/server";
import { getLatestRates, getAllShippingCurrencies } from "@/lib/api/exchangerates";

export async function GET() {
  const [latest, timeSeries] = await Promise.all([
    getLatestRates(),
    getAllShippingCurrencies(),
  ]);

  return NextResponse.json({
    latest,
    timeSeries,
    live: latest !== null,
  });
}
