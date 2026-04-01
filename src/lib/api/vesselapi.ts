import type { VesselData, ShippingSegment } from "@/lib/types";

const BASE_URL = "https://api.vesselapi.com/v1";

interface VesselApiResponse {
  mmsi?: string;
  imo?: string;
  name?: string;
  ship_type?: number;
  latitude?: number;
  longitude?: number;
  speed?: number;
  heading?: number;
  destination?: string;
  eta?: string;
  flag?: string;
  dwt?: number;
  year_built?: number;
  status?: string;
}

function shipTypeToSegment(shipType?: number): ShippingSegment {
  if (!shipType) return "dry-bulk";
  if (shipType >= 70 && shipType <= 79) return "dry-bulk";
  if (shipType >= 80 && shipType <= 89) return "open-hatch";
  return "multipurpose";
}

async function fetchFromVesselApi<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  const apiKey = process.env.VESSELAPI_KEY;
  if (!apiKey || apiKey === "demo") return null;

  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 7200 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const G2_OCEAN_VESSELS = [
  "Star Carrier", "Star Leader", "Star Dalvik", "Star Grip",
  "Star Kilimanjaro", "Star Laguna", "Star Minerva", "Star Navigator",
  "Star Osprey", "Star Phoenix",
];

export async function getVesselPositions(): Promise<VesselData[] | null> {
  const apiKey = process.env.VESSELAPI_KEY;
  if (!apiKey || apiKey === "demo") return null;

  const results: VesselData[] = [];

  for (const name of G2_OCEAN_VESSELS.slice(0, 5)) {
    const data = await fetchFromVesselApi<{ data?: VesselApiResponse[] }>("/vessels/search", { q: name });
    if (data?.data && data.data.length > 0) {
      const v = data.data[0];
      results.push({
        imo: v.imo || "",
        name: v.name || name,
        segment: shipTypeToSegment(v.ship_type),
        dwt: v.dwt || 45000,
        built: v.year_built || 2015,
        flag: v.flag || "NOR",
        owner: "G2 Ocean",
        operator: "G2 Ocean",
        status: v.status || "Unknown",
        lat: v.latitude || null,
        lon: v.longitude || null,
        speed: v.speed || null,
        heading: v.heading || null,
        destination: v.destination || null,
        eta: v.eta || null,
      });
    }
  }

  return results.length > 0 ? results : null;
}
