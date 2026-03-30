import type {
  FreightRateData,
  MarketIndex,
  ShippingSegment,
  VesselData,
  NewbuildingData,
  CompetitorData,
  MacroSeriesData,
  ForecastPoint,
  TradeBudgetData,
  SeasonalPattern,
  FFAPosition,
  BunkerHedge,
  RiskSummary,
} from "@/lib/types";

export function getMarketIndices(): MarketIndex[] {
  return [
    { name: "Baltic Dry Index (BDI)", value: 1847, change: 42, changePercent: 2.33, unit: "Points" },
    { name: "Baltic Capesize Index", value: 3214, change: -18, changePercent: -0.56, unit: "Points" },
    { name: "Baltic Panamax Index", value: 1523, change: 65, changePercent: 4.46, unit: "Points" },
    { name: "Baltic Supramax Index", value: 1102, change: 23, changePercent: 2.13, unit: "Points" },
    { name: "Baltic Handysize Index", value: 687, change: 11, changePercent: 1.63, unit: "Points" },
    { name: "Avg Open Hatch Rate", value: 18500, change: 350, changePercent: 1.93, unit: "USD/Day" },
  ];
}

const ROUTES: Record<ShippingSegment, string[]> = {
  "open-hatch": [
    "Scandinavia-ECSA", "ECSA-Far East", "Pacific RV", "Atlantic RV",
    "USG-Cont", "Cont-ECSA", "ECSA-Cont", "Far East-ECSA",
    "Cont-Med", "Med-Far East", "Oceania-Far East", "ECSA-Med",
    "Scandinavia-Far East", "USG-ECSA", "WAF-Cont",
  ],
  "semi-open": [
    "Continent-Far East", "USG-Cont", "Med-Far East",
    "Far East-Cont", "Cont-WAF", "ECSA-Cont", "Oceania-Cont",
  ],
  multipurpose: [
    "Global Trip", "Cont-WAF", "Far East-ECSA",
    "Med-WAF", "USG-WAF", "Cont-PG",
  ],
  "dry-bulk": [
    "Capesize TC", "Panamax TC", "Supramax TC", "Handysize TC",
  ],
};

export function getFreightRates(segment?: ShippingSegment): FreightRateData[] {
  const segments: ShippingSegment[] = segment
    ? [segment]
    : ["open-hatch", "semi-open", "multipurpose", "dry-bulk"];
  const baseRates: Record<ShippingSegment, number> = {
    "open-hatch": 18500,
    "semi-open": 16200,
    multipurpose: 14800,
    "dry-bulk": 12400,
  };

  const rates: FreightRateData[] = [];
  const now = new Date();

  for (const seg of segments) {
    for (const route of ROUTES[seg]) {
      for (let i = 89; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const base = baseRates[seg];
        const seasonal = Math.sin((date.getMonth() / 12) * Math.PI * 2) * base * 0.12;
        const trend = (90 - i) * (base * 0.001);
        const noise = (Math.random() - 0.5) * base * 0.06;
        const rate = Math.round(base + seasonal + trend + noise);
        const prevRate = i < 89 ? rates[rates.length - 1]?.rate || rate : rate;
        rates.push({
          date: date.toISOString().split("T")[0],
          segment: seg,
          route,
          rate,
          change: Math.round((rate - prevRate) * 100) / 100,
        });
      }
    }
  }
  return rates;
}

export function getVessels(segment?: ShippingSegment): VesselData[] {
  const vessels: VesselData[] = [
    // --- G2 Ocean Open Hatch Fleet (55 vessels) ---
    { imo: "9483920", name: "Star Carrier", segment: "open-hatch", dwt: 48200, built: 2012, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 35.4, lon: -5.6, speed: 12.5, heading: 245, destination: "Santos", eta: "2026-04-15", cargo: "pulp" },
    { imo: "9512345", name: "Star Leader", segment: "open-hatch", dwt: 52100, built: 2015, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -23.9, lon: -46.3, speed: 0, heading: 180, destination: "Santos", eta: null, cargo: "forest-products" },
    { imo: "9623456", name: "Star Dalvik", segment: "open-hatch", dwt: 61000, built: 2020, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 1.2, lon: 103.8, speed: 11.8, heading: 90, destination: "Yokohama", eta: "2026-04-10", cargo: "aluminum" },
    { imo: "9612345", name: "Star Kilimanjaro", segment: "open-hatch", dwt: 58000, built: 2019, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 22.3, lon: 114.2, speed: 15.1, heading: 200, destination: "Newcastle", eta: "2026-04-08" },
    { imo: "9634567", name: "Star Osprey", segment: "open-hatch", dwt: 55000, built: 2021, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -15.8, lon: -47.9, speed: 12.0, heading: 30, destination: "Ghent", eta: "2026-05-01", cargo: "steel" },
    { imo: "9401001", name: "Star Endeavour", segment: "open-hatch", dwt: 49800, built: 2010, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 59.3, lon: 18.1, speed: 0, heading: 0, destination: "Stockholm", eta: null, cargo: "paper" },
    { imo: "9401002", name: "Star Falcon", segment: "open-hatch", dwt: 53200, built: 2013, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -3.7, lon: -38.5, speed: 11.2, heading: 350, destination: "Rotterdam", eta: "2026-04-20", cargo: "pulp" },
    { imo: "9401003", name: "Star Gemini", segment: "open-hatch", dwt: 46500, built: 2011, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Ballast", lat: 36.1, lon: -75.8, speed: 14.0, heading: 45, destination: "Norfolk", eta: "2026-04-05" },
    { imo: "9401004", name: "Star Hansa", segment: "open-hatch", dwt: 57200, built: 2017, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 31.2, lon: 121.5, speed: 0, heading: 0, destination: "Shanghai", eta: null, cargo: "aluminum" },
    { imo: "9401005", name: "Star Isfjord", segment: "open-hatch", dwt: 50400, built: 2014, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -33.0, lon: -71.6, speed: 10.5, heading: 270, destination: "San Antonio", eta: "2026-04-12", cargo: "forest-products" },
    { imo: "9401006", name: "Star Jupiter", segment: "open-hatch", dwt: 62000, built: 2022, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 4.0, lon: -9.5, speed: 13.8, heading: 180, destination: "Abidjan", eta: "2026-04-09" },
    { imo: "9401007", name: "Star Kvarven", segment: "open-hatch", dwt: 48900, built: 2012, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 43.3, lon: 5.4, speed: 0, heading: 0, destination: "Marseille", eta: null, cargo: "steel" },
    { imo: "9401008", name: "Star Livorno", segment: "open-hatch", dwt: 54600, built: 2016, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -12.0, lon: -77.0, speed: 11.6, heading: 320, destination: "Callao", eta: "2026-04-18", cargo: "industrial-minerals" },
    { imo: "9401009", name: "Star Meridian", segment: "open-hatch", dwt: 51300, built: 2015, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 35.6, lon: 139.7, speed: 0, heading: 0, destination: "Tokyo", eta: null, cargo: "project-cargo" },
    { imo: "9401010", name: "Star Norlys", segment: "open-hatch", dwt: 59100, built: 2020, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: -34.6, lon: 58.4, speed: 14.3, heading: 90, destination: "Buenos Aires", eta: "2026-04-07" },
    { imo: "9401011", name: "Star Orbit", segment: "open-hatch", dwt: 47500, built: 2010, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 51.4, lon: 3.6, speed: 0, heading: 0, destination: "Flushing", eta: null, cargo: "paper" },
    { imo: "9401012", name: "Star Polaris", segment: "open-hatch", dwt: 55800, built: 2018, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -29.9, lon: 31.0, speed: 11.0, heading: 45, destination: "Durban", eta: "2026-04-22", cargo: "aluminum" },
    { imo: "9401013", name: "Star Quantum", segment: "open-hatch", dwt: 63000, built: 2023, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 13.1, lon: 80.3, speed: 12.2, heading: 270, destination: "Chennai", eta: "2026-04-16", cargo: "pulp" },
    { imo: "9401014", name: "Star Ranger", segment: "open-hatch", dwt: 50100, built: 2014, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 25.3, lon: -80.1, speed: 13.0, heading: 180, destination: "Miami", eta: "2026-04-06" },
    { imo: "9401015", name: "Star Sirius", segment: "open-hatch", dwt: 52700, built: 2016, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 57.7, lon: 11.9, speed: 0, heading: 0, destination: "Gothenburg", eta: null, cargo: "forest-products" },
    { imo: "9401016", name: "Star Trident", segment: "open-hatch", dwt: 58500, built: 2019, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -8.1, lon: -34.9, speed: 10.8, heading: 10, destination: "Recife", eta: "2026-04-19", cargo: "steel" },
    { imo: "9401017", name: "Star Unity", segment: "open-hatch", dwt: 45600, built: 2009, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Port", lat: 53.5, lon: 9.9, speed: 0, heading: 0, destination: "Hamburg", eta: null },
    { imo: "9401018", name: "Star Viking", segment: "open-hatch", dwt: 56400, built: 2017, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 37.5, lon: 126.9, speed: 11.5, heading: 180, destination: "Incheon", eta: "2026-04-14", cargo: "paper" },
    { imo: "9401019", name: "Star Westward", segment: "open-hatch", dwt: 60200, built: 2021, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: -37.8, lon: 144.9, speed: 12.8, heading: 315, destination: "Melbourne", eta: "2026-04-11", cargo: "industrial-minerals" },
    { imo: "9401020", name: "Star Xenon", segment: "open-hatch", dwt: 49300, built: 2013, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 6.9, lon: 79.9, speed: 14.6, heading: 60, destination: "Colombo", eta: "2026-04-08" },
    { imo: "9401021", name: "Canopus Alpha", segment: "open-hatch", dwt: 53900, built: 2016, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 40.4, lon: -74.0, speed: 0, heading: 0, destination: "New York", eta: null, cargo: "project-cargo" },
    { imo: "9401022", name: "Canopus Beta", segment: "open-hatch", dwt: 57600, built: 2018, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -22.9, lon: -43.2, speed: 11.3, heading: 350, destination: "Rio de Janeiro", eta: "2026-04-25", cargo: "pulp" },
    { imo: "9401023", name: "Canopus Gamma", segment: "open-hatch", dwt: 61500, built: 2022, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 14.6, lon: 121.0, speed: 10.9, heading: 90, destination: "Manila", eta: "2026-04-13", cargo: "aluminum" },
    { imo: "9401024", name: "Canopus Delta", segment: "open-hatch", dwt: 50800, built: 2014, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 60.4, lon: 5.3, speed: 13.5, heading: 225, destination: "Bergen", eta: "2026-04-04" },
    { imo: "9401025", name: "Star Antares", segment: "open-hatch", dwt: 54100, built: 2015, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 2.0, lon: 45.3, speed: 12.1, heading: 140, destination: "Mogadishu", eta: "2026-04-17", cargo: "general" },
    { imo: "9401026", name: "Star Bellatrix", segment: "open-hatch", dwt: 47800, built: 2011, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 41.4, lon: 2.2, speed: 0, heading: 0, destination: "Barcelona", eta: null },
    { imo: "9401027", name: "Star Columba", segment: "open-hatch", dwt: 59700, built: 2020, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -25.3, lon: 28.2, speed: 10.5, heading: 200, destination: "Maputo", eta: "2026-04-23", cargo: "steel" },
    { imo: "9401028", name: "Star Deneb", segment: "open-hatch", dwt: 52400, built: 2015, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 56.0, lon: 12.6, speed: 11.7, heading: 270, destination: "Malmö", eta: "2026-04-09", cargo: "forest-products" },
    { imo: "9401029", name: "Star Electra", segment: "open-hatch", dwt: 55300, built: 2017, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: -6.2, lon: 106.8, speed: 14.0, heading: 340, destination: "Jakarta", eta: "2026-04-06" },
    { imo: "9401030", name: "Star Fortuna", segment: "open-hatch", dwt: 63500, built: 2023, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 33.6, lon: -7.6, speed: 12.4, heading: 90, destination: "Casablanca", eta: "2026-04-21", cargo: "pulp" },
    { imo: "9401031", name: "Canopus Epsilon", segment: "open-hatch", dwt: 48600, built: 2012, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 10.0, lon: -61.5, speed: 11.0, heading: 15, destination: "Port of Spain", eta: "2026-04-14", cargo: "paper" },
    { imo: "9401032", name: "Canopus Zeta", segment: "open-hatch", dwt: 56900, built: 2018, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Port", lat: 1.3, lon: 103.9, speed: 0, heading: 0, destination: "Singapore", eta: null },
    { imo: "9401033", name: "Star Horizon", segment: "open-hatch", dwt: 51600, built: 2015, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 45.4, lon: -73.6, speed: 10.2, heading: 60, destination: "Montreal", eta: "2026-05-02", cargo: "aluminum" },
    { imo: "9401034", name: "Star Impulse", segment: "open-hatch", dwt: 60500, built: 2021, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: -27.5, lon: 153.0, speed: 12.6, heading: 330, destination: "Brisbane", eta: "2026-04-10", cargo: "industrial-minerals" },
    { imo: "9401035", name: "Star Jade", segment: "open-hatch", dwt: 47200, built: 2010, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 21.3, lon: -157.8, speed: 15.0, heading: 250, destination: "Honolulu", eta: "2026-04-07" },
    { imo: "9401036", name: "Star Kronos", segment: "open-hatch", dwt: 54800, built: 2016, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 51.9, lon: 4.5, speed: 0, heading: 0, destination: "Rotterdam", eta: null, cargo: "steel" },
    { imo: "9401037", name: "Star Luna", segment: "open-hatch", dwt: 58300, built: 2019, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 29.0, lon: 48.0, speed: 11.4, heading: 135, destination: "Kuwait", eta: "2026-04-16", cargo: "project-cargo" },
    { imo: "9401038", name: "Star Nebula", segment: "open-hatch", dwt: 52000, built: 2015, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 23.1, lon: 113.3, speed: 10.0, heading: 90, destination: "Guangzhou", eta: "2026-04-12", cargo: "general" },
    { imo: "9401039", name: "Star Orion", segment: "open-hatch", dwt: 49500, built: 2013, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: -33.9, lon: 151.2, speed: 13.2, heading: 180, destination: "Sydney", eta: "2026-04-08" },
    { imo: "9401040", name: "Star Pegasus", segment: "open-hatch", dwt: 61800, built: 2022, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 38.7, lon: -9.1, speed: 12.0, heading: 0, destination: "Lisbon", eta: "2026-04-20", cargo: "pulp" },
    { imo: "9401041", name: "Canopus Eta", segment: "open-hatch", dwt: 50200, built: 2014, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 55.0, lon: -1.4, speed: 11.8, heading: 180, destination: "Newcastle UK", eta: "2026-04-24", cargo: "forest-products" },
    { imo: "9401042", name: "Canopus Theta", segment: "open-hatch", dwt: 57100, built: 2018, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 37.9, lon: 23.7, speed: 0, heading: 0, destination: "Piraeus", eta: null },
    { imo: "9401043", name: "Star Resolve", segment: "open-hatch", dwt: 53500, built: 2016, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -2.2, lon: -79.9, speed: 10.6, heading: 300, destination: "Guayaquil", eta: "2026-04-18", cargo: "aluminum" },
    { imo: "9401044", name: "Star Summit", segment: "open-hatch", dwt: 46800, built: 2010, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 54.3, lon: 10.1, speed: 11.1, heading: 90, destination: "Kiel", eta: "2026-04-11", cargo: "paper" },
    { imo: "9401045", name: "Star Tempest", segment: "open-hatch", dwt: 59500, built: 2020, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 12.9, lon: -38.5, speed: 14.5, heading: 270, destination: "Salvador", eta: "2026-04-09" },
    { imo: "9401046", name: "Star Ursa", segment: "open-hatch", dwt: 55600, built: 2017, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 40.7, lon: 29.0, speed: 0, heading: 0, destination: "Izmit", eta: null, cargo: "steel" },
    { imo: "9401047", name: "Star Vega", segment: "open-hatch", dwt: 62500, built: 2023, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -7.2, lon: 112.7, speed: 12.3, heading: 45, destination: "Surabaya", eta: "2026-04-15", cargo: "industrial-minerals" },
    { imo: "9401048", name: "Star Wave", segment: "open-hatch", dwt: 48100, built: 2011, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 52.4, lon: -6.3, speed: 11.5, heading: 180, destination: "Waterford", eta: "2026-04-13", cargo: "pulp" },
    { imo: "9401049", name: "Canopus Iota", segment: "open-hatch", dwt: 56200, built: 2018, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 5.6, lon: -0.2, speed: 13.7, heading: 120, destination: "Tema", eta: "2026-04-06" },
    { imo: "9401050", name: "Canopus Kappa", segment: "open-hatch", dwt: 60800, built: 2021, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 32.1, lon: 131.6, speed: 12.0, heading: 270, destination: "Oita", eta: "2026-04-17", cargo: "forest-products" },
    // --- G2 Ocean Semi-Open Fleet (15 vessels) ---
    { imo: "9567890", name: "Canopus Arrow", segment: "semi-open", dwt: 38500, built: 2018, flag: "SGP", owner: "Grieg Star", operator: "G2 Ocean", status: "Ballast", lat: 51.9, lon: 4.5, speed: 14.2, heading: 310, destination: "Houston", eta: "2026-04-22" },
    { imo: "9478901", name: "Clipper Herald", segment: "semi-open", dwt: 42300, built: 2010, flag: "HKG", owner: "Clipper Group", operator: "G2 Ocean", status: "Laden", lat: -33.9, lon: 18.4, speed: 13.0, heading: 80, destination: "Mumbai", eta: "2026-04-18", cargo: "steel" },
    { imo: "9578901", name: "Star Phoenix", segment: "semi-open", dwt: 44800, built: 2016, flag: "SGP", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 37.8, lon: -122.4, speed: 0, heading: 0, destination: "San Francisco", eta: null },
    { imo: "9402001", name: "Star Atlas", segment: "semi-open", dwt: 40200, built: 2014, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 22.3, lon: 91.8, speed: 11.5, heading: 270, destination: "Chittagong", eta: "2026-04-19", cargo: "aluminum" },
    { imo: "9402002", name: "Star Breeze", segment: "semi-open", dwt: 39600, built: 2013, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 48.9, lon: 2.4, speed: 10.8, heading: 180, destination: "Rouen", eta: "2026-04-15", cargo: "paper" },
    { imo: "9402003", name: "Star Coral", segment: "semi-open", dwt: 43100, built: 2017, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: -1.3, lon: 36.8, speed: 14.0, heading: 90, destination: "Mombasa", eta: "2026-04-10" },
    { imo: "9402004", name: "Star Drift", segment: "semi-open", dwt: 41500, built: 2015, flag: "SGP", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 34.0, lon: -118.2, speed: 12.0, heading: 315, destination: "Long Beach", eta: "2026-04-21", cargo: "project-cargo" },
    { imo: "9402005", name: "Star Eclipse", segment: "semi-open", dwt: 38800, built: 2012, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Port", lat: 47.6, lon: -122.3, speed: 0, heading: 0, destination: "Seattle", eta: null },
    { imo: "9402006", name: "Canopus Lambda", segment: "semi-open", dwt: 42800, built: 2019, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -4.0, lon: 39.7, speed: 11.2, heading: 180, destination: "Mombasa", eta: "2026-04-12", cargo: "industrial-minerals" },
    { imo: "9402007", name: "Canopus Mu", segment: "semi-open", dwt: 40600, built: 2014, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: 55.7, lon: 13.2, speed: 10.5, heading: 270, destination: "Malmö", eta: "2026-04-08", cargo: "general" },
    { imo: "9402008", name: "Star Frontier", segment: "semi-open", dwt: 44100, built: 2020, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 16.8, lon: -99.9, speed: 13.5, heading: 135, destination: "Acapulco", eta: "2026-04-07" },
    { imo: "9402009", name: "Star Glacier", segment: "semi-open", dwt: 39200, built: 2013, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 59.9, lon: 10.7, speed: 0, heading: 0, destination: "Oslo", eta: null, cargo: "pulp" },
    // --- G2 Ocean Multipurpose Fleet (12 vessels) ---
    { imo: "9534567", name: "Star Grip", segment: "multipurpose", dwt: 28700, built: 2014, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 29.7, lon: -95.3, speed: 0, heading: 0, destination: "Houston", eta: null },
    { imo: "9501234", name: "Star Minerva", segment: "multipurpose", dwt: 31200, built: 2013, flag: "NIS", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 13.4, lon: -59.6, speed: 10.8, heading: 15, destination: "Antwerp", eta: "2026-04-20", cargo: "project-cargo" },
    { imo: "9403001", name: "Star Apex", segment: "multipurpose", dwt: 25400, built: 2011, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 6.5, lon: 3.4, speed: 11.2, heading: 180, destination: "Lagos", eta: "2026-04-16", cargo: "steel" },
    { imo: "9403002", name: "Star Beacon", segment: "multipurpose", dwt: 29800, built: 2015, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: -6.8, lon: 39.3, speed: 10.5, heading: 270, destination: "Dar es Salaam", eta: "2026-04-22", cargo: "general" },
    { imo: "9403003", name: "Star Compass", segment: "multipurpose", dwt: 27300, built: 2013, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: 25.0, lon: 55.3, speed: 13.0, heading: 45, destination: "Dubai", eta: "2026-04-09" },
    { imo: "9403004", name: "Star Dawn", segment: "multipurpose", dwt: 32500, built: 2017, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -20.2, lon: 57.5, speed: 11.8, heading: 135, destination: "Port Louis", eta: "2026-04-18", cargo: "aluminum" },
    { imo: "9403005", name: "Canopus Nu", segment: "multipurpose", dwt: 26800, built: 2012, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 45.5, lon: -73.6, speed: 0, heading: 0, destination: "Montreal", eta: null },
    { imo: "9403006", name: "Star Echo", segment: "multipurpose", dwt: 30100, built: 2016, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: -12.4, lon: 130.8, speed: 10.0, heading: 90, destination: "Darwin", eta: "2026-04-14", cargo: "industrial-minerals" },
    { imo: "9403007", name: "Star Focus", segment: "multipurpose", dwt: 28200, built: 2014, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 33.3, lon: 44.4, speed: 11.0, heading: 45, destination: "Baghdad", eta: "2026-04-24", cargo: "project-cargo" },
    { imo: "9403008", name: "Star Gallant", segment: "multipurpose", dwt: 31800, built: 2018, flag: "NIS", owner: "Grieg Star", operator: "G2 Ocean", status: "Ballast", lat: 42.3, lon: -71.0, speed: 14.2, heading: 0, destination: "Boston", eta: "2026-04-06" },
    // --- G2 Ocean Dry Bulk Fleet (8 vessels) ---
    { imo: "9545678", name: "Star Laguna", segment: "dry-bulk", dwt: 82000, built: 2016, flag: "PAN", owner: "Grieg Star", operator: "G2 Ocean", status: "Laden", lat: -5.8, lon: -35.2, speed: 11.4, heading: 350, destination: "Rotterdam", eta: "2026-04-25", cargo: "general" },
    { imo: "9589012", name: "Star Navigator", segment: "dry-bulk", dwt: 76500, built: 2017, flag: "NOR", owner: "Grieg Star", operator: "G2 Ocean", status: "Ballast", lat: 48.3, lon: -4.5, speed: 13.5, heading: 270, destination: "Hampton Roads", eta: "2026-04-12" },
    { imo: "9404001", name: "Star Crest", segment: "dry-bulk", dwt: 79000, built: 2015, flag: "PAN", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 38.3, lon: -76.6, speed: 10.8, heading: 90, destination: "Baltimore", eta: "2026-04-14", cargo: "general" },
    { imo: "9404002", name: "Star Diamond", segment: "dry-bulk", dwt: 84500, built: 2019, flag: "NOR", owner: "Grieg Star", operator: "G2 Ocean", status: "Port", lat: 51.4, lon: 3.6, speed: 0, heading: 0, destination: "Flushing", eta: null },
    { imo: "9404003", name: "Star Emerald", segment: "dry-bulk", dwt: 78200, built: 2016, flag: "PAN", owner: "Gearbulk", operator: "G2 Ocean", status: "Laden", lat: 30.5, lon: 122.2, speed: 11.5, heading: 45, destination: "Ningbo", eta: "2026-04-16", cargo: "general" },
    { imo: "9404004", name: "Star Flint", segment: "dry-bulk", dwt: 81300, built: 2018, flag: "NOR", owner: "Gearbulk", operator: "G2 Ocean", status: "Ballast", lat: -35.3, lon: 149.1, speed: 14.0, heading: 270, destination: "Port Kembla", eta: "2026-04-10" },
    // --- Competitor vessels ---
    { imo: "9456789", name: "Pacific Falcon", segment: "dry-bulk", dwt: 72000, built: 2009, flag: "PAN", owner: "Pacific Basin", operator: "Pacific Basin", status: "Laden", lat: 10.5, lon: 107.0, speed: 11.9, heading: 45, destination: "Qingdao", eta: "2026-04-14", cargo: "general" },
    { imo: "9523456", name: "Thorco Cloud", segment: "multipurpose", dwt: 18500, built: 2014, flag: "DNK", owner: "Thorco", operator: "Thorco Projects", status: "Laden", lat: 6.4, lon: 3.4, speed: 10.2, heading: 180, destination: "Luanda", eta: "2026-04-09", cargo: "project-cargo" },
    { imo: "9601234", name: "AAL Dalian", segment: "multipurpose", dwt: 31000, built: 2019, flag: "SGP", owner: "AAL Shipping", operator: "AAL Shipping", status: "Ballast", lat: 25.0, lon: 55.2, speed: 14.5, heading: 90, destination: "Mumbai", eta: "2026-04-11" },
    { imo: "9567891", name: "Chipolbrok Moon", segment: "open-hatch", dwt: 40200, built: 2015, flag: "HKG", owner: "Chipolbrok", operator: "Chipolbrok", status: "Laden", lat: 31.2, lon: 121.5, speed: 0, heading: 0, destination: "Shanghai", eta: null, cargo: "steel" },
    { imo: "9405001", name: "Pacific Breeze", segment: "dry-bulk", dwt: 75000, built: 2012, flag: "HKG", owner: "Pacific Basin", operator: "Pacific Basin", status: "Laden", lat: 22.3, lon: 114.2, speed: 11.5, heading: 180, destination: "Hong Kong", eta: "2026-04-13", cargo: "general" },
    { imo: "9405002", name: "Thorco Rain", segment: "multipurpose", dwt: 19200, built: 2016, flag: "DNK", owner: "Thorco", operator: "Thorco Projects", status: "Laden", lat: -4.1, lon: 39.7, speed: 10.8, heading: 90, destination: "Mombasa", eta: "2026-04-17", cargo: "project-cargo" },
    { imo: "9405003", name: "AAL Melbourne", segment: "multipurpose", dwt: 33000, built: 2020, flag: "SGP", owner: "AAL Shipping", operator: "AAL Shipping", status: "Laden", lat: -37.8, lon: 144.9, speed: 12.0, heading: 0, destination: "Melbourne", eta: "2026-04-19", cargo: "steel" },
    { imo: "9405004", name: "Chipolbrok Sun", segment: "open-hatch", dwt: 42500, built: 2017, flag: "HKG", owner: "Chipolbrok", operator: "Chipolbrok", status: "Ballast", lat: 34.7, lon: 136.9, speed: 13.5, heading: 270, destination: "Nagoya", eta: "2026-04-11" },
    { imo: "9405005", name: "BBC Rhine", segment: "multipurpose", dwt: 21400, built: 2013, flag: "ATG", owner: "BBC Chartering", operator: "BBC Chartering", status: "Laden", lat: 53.5, lon: 8.1, speed: 11.0, heading: 90, destination: "Bremerhaven", eta: "2026-04-15", cargo: "project-cargo" },
    { imo: "9405006", name: "Spliethoff Douro", segment: "open-hatch", dwt: 45600, built: 2011, flag: "NLD", owner: "Spliethoff", operator: "Spliethoff", status: "Laden", lat: 52.4, lon: 4.9, speed: 10.5, heading: 270, destination: "Amsterdam", eta: "2026-04-12", cargo: "forest-products" },
    { imo: "9405007", name: "NYK Pegasus", segment: "dry-bulk", dwt: 80000, built: 2018, flag: "PAN", owner: "NYK Bulk", operator: "NYK Bulk", status: "Laden", lat: 35.4, lon: 139.6, speed: 12.2, heading: 180, destination: "Yokohama", eta: "2026-04-16", cargo: "general" },
    { imo: "9405008", name: "Spliethoff Elbe", segment: "semi-open", dwt: 38900, built: 2014, flag: "NLD", owner: "Spliethoff", operator: "Spliethoff", status: "Laden", lat: 41.0, lon: 28.9, speed: 10.0, heading: 180, destination: "Istanbul", eta: "2026-04-20", cargo: "aluminum" },
  ];
  return segment ? vessels.filter((v) => v.segment === segment) : vessels;
}

export function getNewbuildings(segment?: ShippingSegment): NewbuildingData[] {
  const builds: NewbuildingData[] = [
    { id: 1, vesselName: "Star Aurora", segment: "open-hatch", dwt: 62000, yard: "Oshima Shipbuilding", owner: "Gearbulk", orderDate: "2024-06-15", deliveryDate: "2026-09-01", status: "Under Construction" },
    { id: 2, vesselName: "Star Boreas", segment: "open-hatch", dwt: 62000, yard: "Oshima Shipbuilding", owner: "Gearbulk", orderDate: "2024-06-15", deliveryDate: "2027-01-15", status: "On Order" },
    { id: 3, vesselName: null, segment: "semi-open", dwt: 45000, yard: "Jiangsu New Yangzijiang", owner: "Grieg Star", orderDate: "2025-01-20", deliveryDate: "2027-06-01", status: "On Order" },
    { id: 4, vesselName: null, segment: "semi-open", dwt: 45000, yard: "Jiangsu New Yangzijiang", owner: "Grieg Star", orderDate: "2025-01-20", deliveryDate: "2027-10-01", status: "On Order" },
    { id: 5, vesselName: "Star Cygnus", segment: "open-hatch", dwt: 58000, yard: "CSSC Chengxi", owner: "Gearbulk", orderDate: "2025-03-10", deliveryDate: "2027-08-01", status: "On Order" },
    { id: 6, vesselName: null, segment: "dry-bulk", dwt: 82000, yard: "Namura Shipbuilding", owner: "Grieg Star", orderDate: "2024-11-01", deliveryDate: "2026-12-01", status: "Under Construction" },
    { id: 7, vesselName: "Pacific Venture", segment: "dry-bulk", dwt: 85000, yard: "JMU", owner: "Pacific Basin", orderDate: "2025-02-15", deliveryDate: "2027-04-01", status: "On Order" },
    { id: 8, vesselName: null, segment: "multipurpose", dwt: 32000, yard: "Damen Shipyards", owner: "Thorco", orderDate: "2025-05-20", deliveryDate: "2027-09-01", status: "On Order" },
    { id: 9, vesselName: "Star Zenith", segment: "open-hatch", dwt: 64000, yard: "Oshima Shipbuilding", owner: "Gearbulk", orderDate: "2025-06-01", deliveryDate: "2028-02-01", status: "On Order" },
    { id: 10, vesselName: null, segment: "open-hatch", dwt: 60000, yard: "CSSC Chengxi", owner: "Grieg Star", orderDate: "2025-08-15", deliveryDate: "2028-04-01", status: "On Order" },
  ];
  return segment ? builds.filter((b) => b.segment === segment) : builds;
}

export function getCompetitors(): CompetitorData[] {
  return [
    { name: "G2 Ocean", vessels: 95, totalDwt: 4950000, avgAge: 10.8, segments: { "open-hatch": 55, "semi-open": 15, multipurpose: 17, "dry-bulk": 8 } },
    { name: "Pacific Basin", vessels: 38, totalDwt: 1620000, avgAge: 8.5, segments: { "open-hatch": 2, "semi-open": 4, multipurpose: 6, "dry-bulk": 26 } },
    { name: "Thorco Projects", vessels: 28, totalDwt: 580000, avgAge: 9.8, segments: { "open-hatch": 3, "semi-open": 2, multipurpose: 20, "dry-bulk": 3 } },
    { name: "AAL Shipping", vessels: 18, totalDwt: 520000, avgAge: 7.2, segments: { "open-hatch": 4, "semi-open": 3, multipurpose: 10, "dry-bulk": 1 } },
    { name: "Chipolbrok", vessels: 15, totalDwt: 620000, avgAge: 12.1, segments: { "open-hatch": 10, "semi-open": 2, multipurpose: 2, "dry-bulk": 1 } },
    { name: "BBC Chartering", vessels: 22, totalDwt: 490000, avgAge: 11.3, segments: { "open-hatch": 1, "semi-open": 3, multipurpose: 16, "dry-bulk": 2 } },
    { name: "Spliethoff", vessels: 35, totalDwt: 1150000, avgAge: 13.5, segments: { "open-hatch": 12, "semi-open": 8, multipurpose: 10, "dry-bulk": 5 } },
    { name: "NYK Bulk", vessels: 25, totalDwt: 1380000, avgAge: 9.0, segments: { "open-hatch": 5, "semi-open": 3, multipurpose: 2, "dry-bulk": 15 } },
  ];
}

const FRED_SERIES_CONFIG = {
  TRADE_VOLUME: { id: "WDTIVOL", title: "World Trade Volume", unit: "Index (2010=100)" },
  COMMODITY_INDEX: { id: "PALLFNFINDEXM", title: "Global Commodity Price Index", unit: "Index (2016=100)" },
  IRON_ORE: { id: "PIORECRUSDM", title: "Iron Ore Price", unit: "USD/DMT" },
  COAL: { id: "PCOALAUUSDM", title: "Coal Price (Australian)", unit: "USD/MT" },
  PULP: { id: "PPULPUSDM", title: "Pulp Price (NBSK)", unit: "USD/MT" },
  ALUMINUM: { id: "PALUMUSDM", title: "Aluminum Price (LME)", unit: "USD/MT" },
  STEEL: { id: "PSTEEUSDM", title: "Steel Price (HRC)", unit: "USD/MT" },
  GDP_WORLD: { id: "NYGDPMKTPCDWLD", title: "World GDP", unit: "Current USD" },
  GDP_CHINA: { id: "NYGDPMKTPCDCHN", title: "China GDP", unit: "Current USD" },
  GDP_EU: { id: "NYGDPMKTPCDEUU", title: "EU GDP", unit: "Current USD" },
};

export function getAllMacroSeries(): MacroSeriesData[] {
  const baseValues: Record<string, number> = {
    TRADE_VOLUME: 110, COMMODITY_INDEX: 145, IRON_ORE: 108,
    COAL: 135, PULP: 850, ALUMINUM: 2450, STEEL: 680,
    GDP_WORLD: 105e12, GDP_CHINA: 18.3e12, GDP_EU: 16.8e12,
  };
  const now = new Date();

  return Object.entries(FRED_SERIES_CONFIG).map(([key, config]) => {
    const base = baseValues[key] || 100;
    const isGDP = key.startsWith("GDP");
    const points = isGDP ? 20 : 60;
    const data: { date: string; value: number }[] = [];

    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), 1);
      if (isGDP) date.setFullYear(date.getFullYear() - i);
      else date.setMonth(date.getMonth() - i);
      const trend = (points - i) * base * (isGDP ? 0.025 : 0.003);
      const cycle = Math.sin(((points - i) / points) * Math.PI * 3) * base * 0.08;
      const noise = (Math.random() - 0.5) * base * 0.04;
      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round((base + trend + cycle + noise) * 100) / 100,
      });
    }
    return { seriesId: config.id, title: config.title, unit: config.unit, data };
  });
}

// --- Forecasting Data ---

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getForecastData(segment?: ShippingSegment): ForecastPoint[] {
  const baseRate = segment
    ? ({ "open-hatch": 18500, "semi-open": 16200, multipurpose: 14800, "dry-bulk": 12400 }[segment])
    : 18500;
  const now = new Date();
  const points: ForecastPoint[] = [];

  for (let i = -90; i <= 365; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const dayIndex = i + 90;
    const seasonal = Math.sin((date.getMonth() / 12) * Math.PI * 2) * baseRate * 0.1;
    const trend = dayIndex * (baseRate * 0.0003);
    const noise = (Math.random() - 0.5) * baseRate * 0.04;
    const value = baseRate + seasonal + trend + noise;

    if (i <= 0) {
      const bandWidth = baseRate * 0.02;
      points.push({
        date: dateStr,
        actual: Math.round(value),
        forecast: Math.round(value),
        lower: Math.round(value - bandWidth),
        upper: Math.round(value + bandWidth),
      });
    } else {
      const bandWidth = baseRate * 0.02 + (i / 365) * baseRate * 0.15;
      points.push({
        date: dateStr,
        forecast: Math.round(value),
        lower: Math.round(value - bandWidth),
        upper: Math.round(value + bandWidth),
      });
    }
  }
  return points;
}

export function getTradeBudget(): TradeBudgetData[] {
  const allRoutes: { route: string; segment: ShippingSegment }[] = [];
  for (const [seg, routes] of Object.entries(ROUTES)) {
    for (const r of routes) {
      allRoutes.push({ route: r, segment: seg as ShippingSegment });
    }
  }

  const baseRates: Record<ShippingSegment, number> = {
    "open-hatch": 18500, "semi-open": 16200, multipurpose: 14800, "dry-bulk": 12400,
  };

  return allRoutes.map(({ route, segment }) => {
    const base = baseRates[segment];
    const budgetedRate = Math.round(base * (0.9 + Math.random() * 0.2));
    const currentRate = Math.round(base * (0.85 + Math.random() * 0.3));
    const variance = currentRate - budgetedRate;
    return {
      route,
      segment,
      budgetedRate,
      currentRate,
      variance,
      variancePercent: Math.round((variance / budgetedRate) * 10000) / 100,
      voyages: Math.floor(Math.random() * 20) + 2,
    };
  });
}

export function getSeasonalPatterns(segment?: ShippingSegment): SeasonalPattern[] {
  const base = segment
    ? ({ "open-hatch": 18500, "semi-open": 16200, multipurpose: 14800, "dry-bulk": 12400 }[segment])
    : 18500;

  return MONTHS.map((month, i) => {
    const seasonal = Math.sin((i / 12) * Math.PI * 2) * base * 0.12;
    const avg = Math.round(base + seasonal);
    const spread = base * 0.08;
    return {
      month,
      avgRate: avg,
      minRate: Math.round(avg - spread - Math.random() * spread * 0.5),
      maxRate: Math.round(avg + spread + Math.random() * spread * 0.5),
    };
  });
}

// --- Derivatives & Risk Data ---

export function getFFAPositions(): FFAPosition[] {
  return [
    { id: 1, route: "Pacific RV", period: "Q2 2026", direction: "buy", contractRate: 17800, currentRate: 18200, lots: 5, mtm: 60000, expiryDate: "2026-06-30" },
    { id: 2, route: "Atlantic RV", period: "Q2 2026", direction: "sell", contractRate: 19500, currentRate: 18900, lots: 3, mtm: 54000, expiryDate: "2026-06-30" },
    { id: 3, route: "ECSA-Far East", period: "Q3 2026", direction: "buy", contractRate: 18000, currentRate: 18500, lots: 4, mtm: 60000, expiryDate: "2026-09-30" },
    { id: 4, route: "Scandinavia-ECSA", period: "Q3 2026", direction: "buy", contractRate: 17200, currentRate: 17800, lots: 6, mtm: 108000, expiryDate: "2026-09-30" },
    { id: 5, route: "Cont-ECSA", period: "Q4 2026", direction: "sell", contractRate: 19200, currentRate: 19800, lots: 3, mtm: -54000, expiryDate: "2026-12-31" },
    { id: 6, route: "Capesize TC", period: "Cal 2027", direction: "buy", contractRate: 12000, currentRate: 12800, lots: 8, mtm: 192000, expiryDate: "2027-12-31" },
    { id: 7, route: "Panamax TC", period: "Q2 2026", direction: "sell", contractRate: 14500, currentRate: 13800, lots: 4, mtm: 84000, expiryDate: "2026-06-30" },
    { id: 8, route: "USG-Cont", period: "Q3 2026", direction: "buy", contractRate: 16800, currentRate: 17100, lots: 5, mtm: 45000, expiryDate: "2026-09-30" },
    { id: 9, route: "Continent-Far East", period: "Q4 2026", direction: "buy", contractRate: 15900, currentRate: 16400, lots: 3, mtm: 45000, expiryDate: "2026-12-31" },
    { id: 10, route: "Pacific RV", period: "Cal 2027", direction: "sell", contractRate: 19000, currentRate: 18200, lots: 6, mtm: 144000, expiryDate: "2027-12-31" },
    { id: 11, route: "Supramax TC", period: "Q2 2026", direction: "buy", contractRate: 13200, currentRate: 13600, lots: 5, mtm: 60000, expiryDate: "2026-06-30" },
    { id: 12, route: "Far East-ECSA", period: "Q3 2026", direction: "sell", contractRate: 17500, currentRate: 17200, lots: 4, mtm: 36000, expiryDate: "2026-09-30" },
  ];
}

export function getBunkerHedges(): BunkerHedge[] {
  return [
    { id: 1, fuelType: "VLSFO", period: "Q2 2026", hedgedPrice: 580, currentPrice: 595, volume: 15000, mtm: -225000, expiryDate: "2026-06-30" },
    { id: 2, fuelType: "VLSFO", period: "Q3 2026", hedgedPrice: 590, currentPrice: 605, volume: 12000, mtm: -180000, expiryDate: "2026-09-30" },
    { id: 3, fuelType: "VLSFO", period: "Q4 2026", hedgedPrice: 575, currentPrice: 610, volume: 10000, mtm: -350000, expiryDate: "2026-12-31" },
    { id: 4, fuelType: "MGO", period: "Q2 2026", hedgedPrice: 820, currentPrice: 835, volume: 5000, mtm: -75000, expiryDate: "2026-06-30" },
    { id: 5, fuelType: "MGO", period: "Q3 2026", hedgedPrice: 810, currentPrice: 840, volume: 4000, mtm: -120000, expiryDate: "2026-09-30" },
    { id: 6, fuelType: "HSFO", period: "Q2 2026", hedgedPrice: 420, currentPrice: 405, volume: 8000, mtm: 120000, expiryDate: "2026-06-30" },
    { id: 7, fuelType: "HSFO", period: "Q3 2026", hedgedPrice: 430, currentPrice: 415, volume: 6000, mtm: 90000, expiryDate: "2026-09-30" },
    { id: 8, fuelType: "VLSFO", period: "Cal 2027", hedgedPrice: 570, currentPrice: 600, volume: 20000, mtm: -600000, expiryDate: "2027-12-31" },
  ];
}

export function getRiskSummary(): RiskSummary {
  const ffaPositions = getFFAPositions();
  const bunkerHedges = getBunkerHedges();
  const ffaMtm = ffaPositions.reduce((sum, p) => sum + p.mtm, 0);
  const bunkerMtm = bunkerHedges.reduce((sum, h) => sum + h.mtm, 0);

  return {
    totalFFAExposure: ffaPositions.reduce((sum, p) => sum + Math.abs(p.contractRate * p.lots * 30), 0),
    totalBunkerExposure: bunkerHedges.reduce((sum, h) => sum + h.hedgedPrice * h.volume, 0),
    netMtM: ffaMtm + bunkerMtm,
    freightVaR: Math.round(Math.abs(ffaMtm) * 0.15),
    bunkerVaR: Math.round(Math.abs(bunkerMtm) * 0.12),
    hedgeRatio: 0.68,
  };
}

export function getBunkerPriceHistory(): { date: string; vlsfo: number; hsfo: number; mgo: number }[] {
  const now = new Date();
  const data: { date: string; vlsfo: number; hsfo: number; mgo: number }[] = [];

  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayFactor = (90 - i) / 90;
    const noise = () => (Math.random() - 0.5) * 15;

    data.push({
      date: date.toISOString().split("T")[0],
      vlsfo: Math.round(570 + dayFactor * 25 + Math.sin(dayFactor * Math.PI * 4) * 12 + noise()),
      hsfo: Math.round(400 + dayFactor * 5 + Math.sin(dayFactor * Math.PI * 3) * 10 + noise()),
      mgo: Math.round(800 + dayFactor * 35 + Math.sin(dayFactor * Math.PI * 5) * 15 + noise()),
    });
  }
  return data;
}
