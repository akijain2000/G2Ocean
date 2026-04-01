import { NextResponse } from "next/server";
import { getAllWorldBankSeries } from "@/lib/api/worldbank";

export async function GET() {
  const series = await getAllWorldBankSeries();
  return NextResponse.json({ series, live: series.length > 0 });
}
