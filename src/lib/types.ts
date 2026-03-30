export type ShippingSegment = "open-hatch" | "semi-open" | "multipurpose" | "dry-bulk";

export const SEGMENTS: { value: ShippingSegment; label: string; color: string }[] = [
  { value: "open-hatch", label: "Open Hatch", color: "#0066CC" },
  { value: "semi-open", label: "Semi-Open", color: "#00A651" },
  { value: "multipurpose", label: "Multipurpose", color: "#FF8C00" },
  { value: "dry-bulk", label: "Dry Bulk", color: "#CC0033" },
];

export interface FreightRateData {
  date: string;
  segment: ShippingSegment;
  route: string;
  rate: number;
  change: number;
}

export interface VesselData {
  imo: string;
  name: string;
  segment: ShippingSegment;
  dwt: number;
  built: number;
  flag: string;
  owner: string;
  operator: string;
  status: string;
  lat: number | null;
  lon: number | null;
  speed: number | null;
  heading: number | null;
  destination: string | null;
  eta: string | null;
}

export interface NewbuildingData {
  id: number;
  vesselName: string | null;
  segment: ShippingSegment;
  dwt: number;
  yard: string;
  owner: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
}

export interface MacroSeriesData {
  seriesId: string;
  title: string;
  unit: string;
  data: { date: string; value: number }[];
}

export interface CompetitorData {
  name: string;
  vessels: number;
  totalDwt: number;
  avgAge: number;
  segments: Record<ShippingSegment, number>;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  unit: string;
}
