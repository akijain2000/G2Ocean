import { NextResponse } from "next/server";
import { getVessels, getNewbuildings } from "@/lib/api/marinetraffic";
import { getVesselPositions } from "@/lib/api/vesselapi";

export async function GET() {
  const vesselApiData = await getVesselPositions();
  const [mtVessels, newbuildings] = await Promise.all([
    getVessels(),
    getNewbuildings(),
  ]);

  const vessels = vesselApiData || mtVessels;
  const live = vesselApiData !== null || isMarineTrafficLive();

  return NextResponse.json({ vessels, newbuildings, live });
}

function isMarineTrafficLive(): boolean {
  const key = process.env.MARINETRAFFIC_API_KEY;
  return !!key && key !== "demo" && key !== "your_marinetraffic_api_key_here";
}
