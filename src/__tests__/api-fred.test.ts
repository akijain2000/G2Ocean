import { getMacroSeries, getAllMacroSeries, FRED_SERIES } from "@/lib/api/fred";

describe("FRED_SERIES constants", () => {
  it("has 8 series defined", () => {
    expect(Object.keys(FRED_SERIES)).toHaveLength(8);
  });

  it("each series has id, title, and unit", () => {
    for (const [, config] of Object.entries(FRED_SERIES)) {
      expect(config.id).toBeTruthy();
      expect(config.title).toBeTruthy();
      expect(config.unit).toBeTruthy();
    }
  });
});

describe("getMacroSeries (mock fallback)", () => {
  beforeEach(() => {
    delete process.env.FRED_API_KEY;
  });

  it("returns trade volume data", async () => {
    const series = await getMacroSeries("TRADE_VOLUME");
    expect(series.seriesId).toBe("WDTIVOL");
    expect(series.title).toBe("World Trade Volume");
    expect(series.data.length).toBe(60);
  });

  it("returns GDP data with fewer points", async () => {
    const series = await getMacroSeries("GDP_WORLD");
    expect(series.seriesId).toBe("NYGDPMKTPCDWLD");
    expect(series.data.length).toBe(20);
  });

  it("data points have date and value", async () => {
    const series = await getMacroSeries("IRON_ORE");
    for (const point of series.data) {
      expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof point.value).toBe("number");
      expect(isNaN(point.value)).toBe(false);
    }
  });

  it("data is sorted chronologically", async () => {
    const series = await getMacroSeries("COMMODITY_INDEX");
    for (let i = 1; i < series.data.length; i++) {
      expect(series.data[i].date >= series.data[i - 1].date).toBe(true);
    }
  });

  it("mock data values are positive", async () => {
    const series = await getMacroSeries("COAL");
    for (const point of series.data) {
      expect(point.value).toBeGreaterThan(0);
    }
  });
});

describe("getAllMacroSeries", () => {
  beforeEach(() => {
    delete process.env.FRED_API_KEY;
  });

  it("returns data for all 8 series", async () => {
    const allSeries = await getAllMacroSeries();
    expect(allSeries).toHaveLength(8);
  });

  it("each series has non-empty data", async () => {
    const allSeries = await getAllMacroSeries();
    for (const series of allSeries) {
      expect(series.data.length).toBeGreaterThan(0);
      expect(series.title).toBeTruthy();
      expect(series.seriesId).toBeTruthy();
    }
  });
});
