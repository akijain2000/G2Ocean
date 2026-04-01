import { NextResponse } from "next/server";
import { getCompetitors } from "@/lib/api/marinetraffic";

export async function GET() {
  const competitors = await getCompetitors();

  return NextResponse.json({ competitors, live: isLive() });
}

function isLive(): boolean {
  const key = process.env.MARINETRAFFIC_API_KEY;
  return !!key && key !== "demo" && key !== "your_marinetraffic_api_key_here";
}
