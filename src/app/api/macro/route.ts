import { NextResponse } from "next/server";
import { getAllMacroSeries } from "@/lib/api/fred";

export async function GET() {
  const series = await getAllMacroSeries();

  return NextResponse.json({ series, live: isLive() });
}

function isLive(): boolean {
  const key = process.env.FRED_API_KEY;
  return !!key && key !== "demo" && key !== "your_fred_api_key_here";
}
