import { getFreightIndex, getFreightRates } from "@/lib/api/searates";

describe("getFreightIndex (mock fallback)", () => {
  it("returns mock market indices when no API key is set", async () => {
    delete process.env.SEARATES_API_KEY;
    const indices = await getFreightIndex();

    expect(indices.length).toBeGreaterThan(0);
    expect(indices[0]).toHaveProperty("name");
    expect(indices[0]).toHaveProperty("value");
    expect(indices[0]).toHaveProperty("change");
    expect(indices[0]).toHaveProperty("changePercent");
    expect(indices[0]).toHaveProperty("unit");
  });

  it("includes Baltic Dry Index", async () => {
    const indices = await getFreightIndex();
    const bdi = indices.find((i) => i.name.includes("Baltic Dry"));
    expect(bdi).toBeDefined();
    expect(bdi!.value).toBe(1847);
  });

  it("includes Avg Open Hatch Rate", async () => {
    const indices = await getFreightIndex();
    const oh = indices.find((i) => i.name.includes("Open Hatch"));
    expect(oh).toBeDefined();
    expect(oh!.unit).toBe("USD/Day");
  });
});

describe("getFreightRates (mock fallback)", () => {
  beforeEach(() => {
    delete process.env.SEARATES_API_KEY;
  });

  it("returns rates for all segments when no segment specified", async () => {
    const rates = await getFreightRates();
    expect(rates.length).toBeGreaterThan(0);

    const segments = new Set(rates.map((r) => r.segment));
    expect(segments.has("open-hatch")).toBe(true);
    expect(segments.has("semi-open")).toBe(true);
    expect(segments.has("multipurpose")).toBe(true);
    expect(segments.has("dry-bulk")).toBe(true);
  });

  it("filters by segment when specified", async () => {
    const rates = await getFreightRates("open-hatch");
    expect(rates.length).toBeGreaterThan(0);
    expect(rates.every((r) => r.segment === "open-hatch")).toBe(true);
  });

  it("each rate has required fields", async () => {
    const rates = await getFreightRates("dry-bulk");
    for (const rate of rates.slice(0, 5)) {
      expect(rate.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof rate.rate).toBe("number");
      expect(rate.rate).toBeGreaterThan(0);
      expect(typeof rate.change).toBe("number");
      expect(rate.route).toBeTruthy();
    }
  });

  it("generates 90 days of data per route", async () => {
    const rates = await getFreightRates("dry-bulk");
    const routes = [...new Set(rates.map((r) => r.route))];
    for (const route of routes) {
      const routeRates = rates.filter((r) => r.route === route);
      expect(routeRates).toHaveLength(90);
    }
  });
});
