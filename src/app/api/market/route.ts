import { NextResponse } from "next/server";
import { getFreightIndex, getFreightRates } from "@/lib/api/searates";

export async function GET() {
  const [indices, rates] = await Promise.all([
    getFreightIndex(),
    getFreightRates(),
  ]);

  return NextResponse.json({ indices, rates, live: isLive() });
}

function isLive(): boolean {
  const key = process.env.SEARATES_API_KEY;
  return !!key && key !== "demo" && key !== "your_searates_api_key_here";
}
