export type ShippingSegment = "open-hatch" | "semi-open" | "multipurpose" | "dry-bulk";

export const SEGMENTS: { value: ShippingSegment; label: string; color: string }[] = [
  { value: "open-hatch", label: "Open Hatch", color: "#0066CC" },
  { value: "semi-open", label: "Semi-Open", color: "#00A651" },
  { value: "multipurpose", label: "Multipurpose", color: "#FF8C00" },
  { value: "dry-bulk", label: "Dry Bulk", color: "#CC0033" },
];

export type CommodityType =
  | "pulp"
  | "paper"
  | "forest-products"
  | "aluminum"
  | "steel"
  | "industrial-minerals"
  | "project-cargo"
  | "general";

export const COMMODITIES: { value: CommodityType; label: string; color: string }[] = [
  { value: "pulp", label: "Pulp", color: "#8B5E3C" },
  { value: "paper", label: "Paper", color: "#D4A574" },
  { value: "forest-products", label: "Forest Products", color: "#228B22" },
  { value: "aluminum", label: "Aluminum", color: "#A8A9AD" },
  { value: "steel", label: "Steel", color: "#4682B4" },
  { value: "industrial-minerals", label: "Industrial Minerals", color: "#DAA520" },
  { value: "project-cargo", label: "Project Cargo", color: "#9B59B6" },
  { value: "general", label: "General Cargo", color: "#7F8C8D" },
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
  cargo?: CommodityType;
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

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast: number;
  lower: number;
  upper: number;
}

export interface TradeBudgetData {
  route: string;
  segment: ShippingSegment;
  budgetedRate: number;
  currentRate: number;
  variance: number;
  variancePercent: number;
  voyages: number;
}

export interface SeasonalPattern {
  month: string;
  avgRate: number;
  minRate: number;
  maxRate: number;
}

export interface FFAPosition {
  id: number;
  route: string;
  period: string;
  direction: "buy" | "sell";
  contractRate: number;
  currentRate: number;
  lots: number;
  mtm: number;
  expiryDate: string;
}

export interface BunkerHedge {
  id: number;
  fuelType: "VLSFO" | "HSFO" | "MGO";
  period: string;
  hedgedPrice: number;
  currentPrice: number;
  volume: number;
  mtm: number;
  expiryDate: string;
}

export interface RiskSummary {
  totalFFAExposure: number;
  totalBunkerExposure: number;
  netMtM: number;
  freightVaR: number;
  bunkerVaR: number;
  hedgeRatio: number;
}
