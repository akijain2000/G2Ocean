import "@testing-library/jest-dom/jest-globals";
import { render, screen } from "@testing-library/react";
import { MarketIndexCard } from "@/components/dashboard/MarketIndexCard";
import type { MarketIndex } from "@/lib/types";

describe("MarketIndexCard", () => {
  const positiveIndex: MarketIndex = {
    name: "Baltic Dry Index (BDI)",
    value: 1847,
    change: 42,
    changePercent: 2.33,
    unit: "Points",
  };

  const negativeIndex: MarketIndex = {
    name: "Baltic Capesize Index",
    value: 3214,
    change: -18,
    changePercent: -0.56,
    unit: "Points",
  };

  it("renders the index name", () => {
    render(<MarketIndexCard index={positiveIndex} />);
    expect(screen.getByText("Baltic Dry Index (BDI)")).toBeInTheDocument();
  });

  it("renders the formatted value", () => {
    render(<MarketIndexCard index={positiveIndex} />);
    expect(screen.getByText("1,847")).toBeInTheDocument();
  });

  it("renders the unit", () => {
    render(<MarketIndexCard index={positiveIndex} />);
    expect(screen.getByText("Points")).toBeInTheDocument();
  });

  it("shows positive change with + sign", () => {
    render(<MarketIndexCard index={positiveIndex} />);
    expect(screen.getByText("+2.33%")).toBeInTheDocument();
    expect(screen.getByText("+42 today")).toBeInTheDocument();
  });

  it("shows negative change without + sign", () => {
    render(<MarketIndexCard index={negativeIndex} />);
    expect(screen.getByText("-0.56%")).toBeInTheDocument();
    expect(screen.getByText("-18 today")).toBeInTheDocument();
  });

  it("applies green styling for positive changes", () => {
    const { container } = render(<MarketIndexCard index={positiveIndex} />);
    const badge = container.querySelector(".bg-emerald-500\\/10");
    expect(badge).toBeInTheDocument();
  });

  it("applies red styling for negative changes", () => {
    const { container } = render(<MarketIndexCard index={negativeIndex} />);
    const badge = container.querySelector(".bg-red-500\\/10");
    expect(badge).toBeInTheDocument();
  });
});
