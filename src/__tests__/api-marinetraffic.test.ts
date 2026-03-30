import { getVessels, getNewbuildings, getCompetitors } from "@/lib/api/marinetraffic";

describe("getVessels (mock fallback)", () => {
  beforeEach(() => {
    delete process.env.MARINETRAFFIC_API_KEY;
  });

  it("returns all mock vessels when no segment specified", async () => {
    const vessels = await getVessels();
    expect(vessels.length).toBeGreaterThan(0);
    expect(vessels.length).toBe(16);
  });

  it("filters vessels by segment", async () => {
    const ohVessels = await getVessels("open-hatch");
    expect(ohVessels.length).toBeGreaterThan(0);
    expect(ohVessels.every((v) => v.segment === "open-hatch")).toBe(true);
  });

  it("each vessel has required fields", async () => {
    const vessels = await getVessels();
    for (const v of vessels) {
      expect(v.imo).toMatch(/^\d+$/);
      expect(v.name).toBeTruthy();
      expect(v.segment).toBeTruthy();
      expect(typeof v.dwt).toBe("number");
      expect(v.dwt).toBeGreaterThan(0);
      expect(typeof v.built).toBe("number");
      expect(v.flag).toBeTruthy();
      expect(v.owner).toBeTruthy();
      expect(v.operator).toBeTruthy();
      expect(v.status).toBeTruthy();
    }
  });

  it("vessels have valid position data", async () => {
    const vessels = await getVessels();
    for (const v of vessels) {
      if (v.lat != null) {
        expect(v.lat).toBeGreaterThanOrEqual(-90);
        expect(v.lat).toBeLessThanOrEqual(90);
      }
      if (v.lon != null) {
        expect(v.lon).toBeGreaterThanOrEqual(-180);
        expect(v.lon).toBeLessThanOrEqual(180);
      }
    }
  });
});

describe("getNewbuildings (mock)", () => {
  it("returns newbuilding orders", async () => {
    const builds = await getNewbuildings();
    expect(builds.length).toBe(8);
  });

  it("filters by segment", async () => {
    const dryBulk = await getNewbuildings("dry-bulk");
    expect(dryBulk.length).toBeGreaterThan(0);
    expect(dryBulk.every((b) => b.segment === "dry-bulk")).toBe(true);
  });

  it("each build has required fields", async () => {
    const builds = await getNewbuildings();
    for (const b of builds) {
      expect(typeof b.id).toBe("number");
      expect(b.segment).toBeTruthy();
      expect(b.dwt).toBeGreaterThan(0);
      expect(b.yard).toBeTruthy();
      expect(b.owner).toBeTruthy();
      expect(b.orderDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(b.deliveryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(["Under Construction", "On Order"]).toContain(b.status);
    }
  });
});

describe("getCompetitors (mock)", () => {
  it("returns competitor data", async () => {
    const competitors = await getCompetitors();
    expect(competitors.length).toBe(8);
  });

  it("includes G2 Ocean", async () => {
    const competitors = await getCompetitors();
    const g2 = competitors.find((c) => c.name === "G2 Ocean");
    expect(g2).toBeDefined();
    expect(g2!.vessels).toBe(42);
  });

  it("each competitor has segment breakdown", async () => {
    const competitors = await getCompetitors();
    for (const c of competitors) {
      expect(typeof c.segments["open-hatch"]).toBe("number");
      expect(typeof c.segments["semi-open"]).toBe("number");
      expect(typeof c.segments["multipurpose"]).toBe("number");
      expect(typeof c.segments["dry-bulk"]).toBe("number");
    }
  });

  it("competitor total DWT and avgAge are positive", async () => {
    const competitors = await getCompetitors();
    for (const c of competitors) {
      expect(c.totalDwt).toBeGreaterThan(0);
      expect(c.avgAge).toBeGreaterThan(0);
      expect(c.vessels).toBeGreaterThan(0);
    }
  });
});
