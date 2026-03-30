import { SEGMENTS } from "@/lib/types";

describe("SEGMENTS constant", () => {
  it("contains 4 shipping segments", () => {
    expect(SEGMENTS).toHaveLength(4);
  });

  it("has correct segment values", () => {
    const values = SEGMENTS.map((s) => s.value);
    expect(values).toContain("open-hatch");
    expect(values).toContain("semi-open");
    expect(values).toContain("multipurpose");
    expect(values).toContain("dry-bulk");
  });

  it("each segment has label and color", () => {
    for (const seg of SEGMENTS) {
      expect(seg.label).toBeTruthy();
      expect(seg.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
