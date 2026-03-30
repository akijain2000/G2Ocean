import "@testing-library/jest-dom/jest-globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/layout/Sidebar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

describe("Sidebar", () => {
  it("renders G2 Ocean branding", () => {
    render(<Sidebar />);
    expect(screen.getByText("G2 Ocean")).toBeInTheDocument();
    expect(screen.getByText("Market Intelligence")).toBeInTheDocument();
  });

  it("renders all 5 navigation items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Market Overview")).toBeInTheDocument();
    expect(screen.getByText("Fleet Monitor")).toBeInTheDocument();
    expect(screen.getByText("Competitors")).toBeInTheDocument();
    expect(screen.getByText("Macro Trends")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });

  it("navigation links have correct hrefs", () => {
    render(<Sidebar />);
    expect(screen.getByText("Market Overview").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Fleet Monitor").closest("a")).toHaveAttribute("href", "/fleet");
    expect(screen.getByText("Competitors").closest("a")).toHaveAttribute("href", "/competitors");
    expect(screen.getByText("Macro Trends").closest("a")).toHaveAttribute("href", "/macro");
    expect(screen.getByText("Reports").closest("a")).toHaveAttribute("href", "/reports");
  });

  it("collapses when toggle button is clicked", () => {
    render(<Sidebar />);
    expect(screen.getByText("G2 Ocean")).toBeInTheDocument();

    const collapseBtn = screen.getByRole("button");
    fireEvent.click(collapseBtn);

    expect(screen.queryByText("G2 Ocean")).not.toBeInTheDocument();
    expect(screen.queryByText("Market Overview")).not.toBeInTheDocument();
  });

  it("expands back after collapsing", () => {
    render(<Sidebar />);
    const collapseBtn = screen.getByRole("button");

    fireEvent.click(collapseBtn);
    expect(screen.queryByText("G2 Ocean")).not.toBeInTheDocument();

    fireEvent.click(collapseBtn);
    expect(screen.getByText("G2 Ocean")).toBeInTheDocument();
    expect(screen.getByText("Market Overview")).toBeInTheDocument();
  });
});
