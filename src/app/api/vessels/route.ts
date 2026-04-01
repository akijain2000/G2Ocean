import { NextResponse } from "next/server";
import { getVessels, getNewbuildings } from "@/lib/api/marinetraffic";

export async function GET() {
  const [vessels, newbuildings] = await Promise.all([
    getVessels(),
    getNewbuildings(),
  ]);

  return NextResponse.json({ vessels, newbuildings, live: isLive() });
}

function isLive(): boolean {
  const key = process.env.MARINETRAFFIC_API_KEY;
  return !!key && key !== "demo" && key !== "your_marinetraffic_api_key_here";
}
