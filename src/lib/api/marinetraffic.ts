import type { VesselData, NewbuildingData, CompetitorData, ShippingSegment } from "@/lib/types";

const BASE_URL = "https://services.marinetraffic.com/api/exportvessel/v:8";

async function fetchFromMarineTraffic<T>(endpoint: string): Promise<T | null> {
  const apiKey = process.env.MARINETRAFFIC_API_KEY;
  if (!apiKey || apiKey === "demo") return null;

  try {
    const res = await fetch(`${BASE_URL}/${apiKey}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getVessels(segment?: ShippingSegment): Promise<VesselData[]> {
  const data = await fetchFromMarineTraffic<VesselData[]>("/protocol:jsono");
  if (data) return segment ? data.filter((v) => v.segment === segment) : data;
  return getMockVessels(segment);
}

export async function getNewbuildings(segment?: ShippingSegment): Promise<NewbuildingData[]> {
  return getMockNewbuildings(segment);
}

export async function getCompetitors(): Promise<CompetitorData[]> {
  return getMockCompetitors();
}

function getMockVessels(segment?: ShippingSegment): VesselData[] {
  const vessels: VesselData[] = [
    { imo: "9483920", name: "Star Carrier", segment: "open-hatch", dwt: 48200, built: 2012, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 35.4, lon: -5.6, speed: 12.5, heading: 245, destination: "Santos", eta: "2026-04-15" },
    { imo: "9512345", name: "Star Leader", segment: "open-hatch", dwt: 52100, built: 2015, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -23.9, lon: -46.3, speed: 0, heading: 180, destination: "Santos", eta: null },
    { imo: "9567890", name: "Canopus Arrow", segment: "semi-open", dwt: 38500, built: 2018, flag: "SGP", owner: "Grieg Star", operator: "G2 Ocean", status: "Ballast", lat: 51.9, lon: 4.5, speed: 14.2, heading: 310, destination: "Houston", eta: "2026-04-22" },
    { imo: "9623456", name: "Star Dalvik", segment: "open-hatch", dwt: 61000, built: 2020, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 1.2, lon: 103.8, speed: 11.8, heading: 90, destination: "Yokohama", eta: "2026-04-10" },
    { imo: "9534567", name: "Star Grip", segment: "multipurpose", dwt: 28700, built: 2014, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 29.7, lon: -95.3, speed: 0, heading: 0, destination: "Houston", eta: null },
    { imo: "9478901", name: "Clipper Herald", segment: "semi-open", dwt: 42300, built: 2010, flag: "HKG", owner: "Clipper Group", operator: "G2 Ocean", status: "Laden", lat: -33.9, lon: 18.4, speed: 13.0, heading: 80, destination: "Mumbai", eta: "2026-04-18" },
    { imo: "9612345", name: "Star Kilimanjaro", segment: "open-hatch", dwt: 58000, built: 2019, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 22.3, lon: 114.2, speed: 15.1, heading: 200, destination: "Newcastle", eta: "2026-04-08" },
    { imo: "9545678", name: "Star Laguna", segment: "dry-bulk", dwt: 82000, built: 2016, flag: "PAN", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: -5.8, lon: -35.2, speed: 11.4, heading: 350, destination: "Rotterdam", eta: "2026-04-25" },
    { imo: "9501234", name: "Star Minerva", segment: "multipurpose", dwt: 31200, built: 2013, flag: "NIS", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 13.4, lon: -59.6, speed: 10.8, heading: 15, destination: "Antwerp", eta: "2026-04-20" },
    { imo: "9589012", name: "Star Navigator", segment: "dry-bulk", dwt: 76500, built: 2017, flag: "NOR", owner: "Grieg Star", operator: "G2 Ocean", status: "Ballast", lat: 48.3, lon: -4.5, speed: 13.5, heading: 270, destination: "Hampton Roads", eta: "2026-04-12" },
    { imo: "9634567", name: "Star Osprey", segment: "open-hatch", dwt: 55000, built: 2021, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -15.8, lon: -47.9, speed: 12.0, heading: 30, destination: "Ghent", eta: "2026-05-01" },
    { imo: "9578901", name: "Star Phoenix", segment: "semi-open", dwt: 44800, built: 2016, flag: "SGP", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 37.8, lon: -122.4, speed: 0, heading: 0, destination: "San Francisco", eta: null },
    { imo: "9456789", name: "Pacific Falcon", segment: "dry-bulk", dwt: 72000, built: 2009, flag: "PAN", owner: "Pacific Basin", operator: "Pacific Basin", status: "Laden", lat: 10.5, lon: 107.0, speed: 11.9, heading: 45, destination: "Qingdao", eta: "2026-04-14" },
    { imo: "9523456", name: "Thorco Cloud", segment: "multipurpose", dwt: 18500, built: 2014, flag: "DNK", owner: "Thorco", operator: "Thorco Projects", status: "Laden", lat: 6.4, lon: 3.4, speed: 10.2, heading: 180, destination: "Luanda", eta: "2026-04-09" },
    { imo: "9601234", name: "AAL Dalian", segment: "multipurpose", dwt: 31000, built: 2019, flag: "SGP", owner: "AAL Shipping", operator: "AAL Shipping", status: "Ballast", lat: 25.0, lon: 55.2, speed: 14.5, heading: 90, destination: "Mumbai", eta: "2026-04-11" },
    { imo: "9567891", name: "Chipolbrok Moon", segment: "open-hatch", dwt: 40200, built: 2015, flag: "HKG", owner: "Chipolbrok", operator: "Chipolbrok", status: "Laden", lat: 31.2, lon: 121.5, speed: 0, heading: 0, destination: "Shanghai", eta: null },
  ];

  return segment ? vessels.filter((v) => v.segment === segment) : vessels;
}

function getMockNewbuildings(segment?: ShippingSegment): NewbuildingData[] {
  const builds: NewbuildingData[] = [
    { id: 1, vesselName: "Star Aurora", segment: "open-hatch", dwt: 62000, yard: "Oshima Shipbuilding", owner: "Gearbulk", orderDate: "2024-06-15", deliveryDate: "2026-09-01", status: "Under Construction" },
    { id: 2, vesselName: "Star Boreas", segment: "open-hatch", dwt: 62000, yard: "Oshima Shipbuilding", owner: "Gearbulk", orderDate: "2024-06-15", deliveryDate: "2027-01-15", status: "On Order" },
    { id: 3, vesselName: null, segment: "semi-open", dwt: 45000, yard: "Jiangsu New Yangzijiang", owner: "Grieg Star", orderDate: "2025-01-20", deliveryDate: "2027-06-01", status: "On Order" },
    { id: 4, vesselName: null, segment: "semi-open", dwt: 45000, yard: "Jiangsu New Yangzijiang", owner: "Grieg Star", orderDate: "2025-01-20", deliveryDate: "2027-10-01", status: "On Order" },
    { id: 5, vesselName: "Star Cygnus", segment: "open-hatch", dwt: 58000, yard: "CSSC Chengxi", owner: "Gearbulk", orderDate: "2025-03-10", deliveryDate: "2027-08-01", status: "On Order" },
    { id: 6, vesselName: null, segment: "dry-bulk", dwt: 82000, yard: "Namura Shipbuilding", owner: "Grieg Star", orderDate: "2024-11-01", deliveryDate: "2026-12-01", status: "Under Construction" },
    { id: 7, vesselName: "Pacific Venture", segment: "dry-bulk", dwt: 85000, yard: "JMU", owner: "Pacific Basin", orderDate: "2025-02-15", deliveryDate: "2027-04-01", status: "On Order" },
    { id: 8, vesselName: null, segment: "multipurpose", dwt: 32000, yard: "Damen Shipyards", owner: "Thorco", orderDate: "2025-05-20", deliveryDate: "2027-09-01", status: "On Order" },
  ];
  return segment ? builds.filter((b) => b.segment === segment) : builds;
}

function getMockCompetitors(): CompetitorData[] {
  return [
    { name: "G2 Ocean", vessels: 42, totalDwt: 1890000, avgAge: 10.2, segments: { "open-hatch": 18, "semi-open": 10, multipurpose: 8, "dry-bulk": 6 } },
    { name: "Pacific Basin", vessels: 38, totalDwt: 1620000, avgAge: 8.5, segments: { "open-hatch": 2, "semi-open": 4, multipurpose: 6, "dry-bulk": 26 } },
    { name: "Thorco Projects", vessels: 28, totalDwt: 580000, avgAge: 9.8, segments: { "open-hatch": 3, "semi-open": 2, multipurpose: 20, "dry-bulk": 3 } },
    { name: "AAL Shipping", vessels: 18, totalDwt: 520000, avgAge: 7.2, segments: { "open-hatch": 4, "semi-open": 3, multipurpose: 10, "dry-bulk": 1 } },
    { name: "Chipolbrok", vessels: 15, totalDwt: 620000, avgAge: 12.1, segments: { "open-hatch": 10, "semi-open": 2, multipurpose: 2, "dry-bulk": 1 } },
    { name: "BBC Chartering", vessels: 22, totalDwt: 490000, avgAge: 11.3, segments: { "open-hatch": 1, "semi-open": 3, multipurpose: 16, "dry-bulk": 2 } },
    { name: "Spliethoff", vessels: 35, totalDwt: 1150000, avgAge: 13.5, segments: { "open-hatch": 12, "semi-open": 8, multipurpose: 10, "dry-bulk": 5 } },
    { name: "NYK Bulk", vessels: 25, totalDwt: 1380000, avgAge: 9.0, segments: { "open-hatch": 5, "semi-open": 3, multipurpose: 2, "dry-bulk": 15 } },
  ];
}
