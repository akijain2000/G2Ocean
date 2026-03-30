import {
  formatNumber,
  formatCurrency,
  formatCompact,
  formatPercent,
  formatDate,
  formatDateShort,
  formatDateWithYear,
} from "@/lib/utils/formatters";

describe("formatNumber", () => {
  it("formats integers with commas", () => {
    expect(formatNumber(1847)).toBe("1,847");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });

  it("handles zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatNumber(-1500)).toBe("-1,500");
  });

  it("respects decimal places", () => {
    expect(formatNumber(1234.567, 2)).toBe("1,234.57");
    expect(formatNumber(100, 3)).toBe("100.000");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    expect(formatCurrency(18500)).toBe("$18,500");
    expect(formatCurrency(0)).toBe("$0");
  });

  it("formats negative values", () => {
    expect(formatCurrency(-500)).toBe("-$500");
  });

  it("supports other currencies", () => {
    const result = formatCurrency(1000, "EUR");
    expect(result).toContain("1,000");
  });
});

describe("formatCompact", () => {
  it("formats trillions", () => {
    expect(formatCompact(1.5e12)).toBe("1.5T");
    expect(formatCompact(105e12)).toBe("105.0T");
  });

  it("formats billions", () => {
    expect(formatCompact(2.3e9)).toBe("2.3B");
  });

  it("formats millions", () => {
    expect(formatCompact(1.9e6)).toBe("1.9M");
    expect(formatCompact(780000)).toBe("780.0K");
  });

  it("formats thousands", () => {
    expect(formatCompact(1500)).toBe("1.5K");
  });

  it("returns raw value for small numbers", () => {
    expect(formatCompact(42)).toBe("42");
    expect(formatCompact(999)).toBe("999");
  });
});

describe("formatPercent", () => {
  it("adds + sign for positive values", () => {
    expect(formatPercent(2.33)).toBe("+2.33%");
  });

  it("negative values keep their sign", () => {
    expect(formatPercent(-0.56)).toBe("-0.56%");
  });

  it("zero has no sign", () => {
    expect(formatPercent(0)).toBe("0.00%");
  });

  it("respects custom decimals", () => {
    expect(formatPercent(4.567, 1)).toBe("+4.6%");
    expect(formatPercent(-1.2, 0)).toBe("-1%");
  });
});

describe("formatDate", () => {
  it("formats a date string to human-readable", () => {
    const result = formatDate("2026-03-30");
    expect(result).toContain("Mar");
    expect(result).toContain("30");
    expect(result).toContain("2026");
  });
});

describe("formatDateShort", () => {
  it("formats without year", () => {
    const result = formatDateShort("2026-03-30");
    expect(result).toContain("Mar");
    expect(result).toContain("30");
    expect(result).not.toContain("2026");
  });
});

describe("formatDateWithYear", () => {
  it("shows abbreviated year", () => {
    const result = formatDateWithYear("2026-03-15");
    expect(result).toContain("Mar");
    expect(result).toContain("'26");
  });

  it("works for different years", () => {
    expect(formatDateWithYear("2021-01-01")).toContain("'21");
    expect(formatDateWithYear("2024-12-25")).toContain("'24");
  });
});
