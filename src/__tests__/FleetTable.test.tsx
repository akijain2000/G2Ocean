import "@testing-library/jest-dom/jest-globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { FleetTable } from "@/components/fleet/FleetTable";
import type { VesselData } from "@/lib/types";

const mockVessels: VesselData[] = [
  {
    imo: "9483920",
    name: "Star Carrier",
    segment: "open-hatch",
    dwt: 48200,
    built: 2012,
    flag: "NOR",
    owner: "Gearbulk",
    operator: "G2 Ocean",
    status: "Laden",
    lat: 35.4,
    lon: -5.6,
    speed: 12.5,
    heading: 245,
    destination: "Santos",
    eta: "2026-04-15",
  },
  {
    imo: "9534567",
    name: "Star Grip",
    segment: "multipurpose",
    dwt: 28700,
    built: 2014,
    flag: "NIS",
    owner: "Grieg Star",
    operator: "G2 Ocean",
    status: "Port",
    lat: 29.7,
    lon: -95.3,
    speed: 0,
    heading: 0,
    destination: "Houston",
    eta: null,
  },
  {
    imo: "9567890",
    name: "Canopus Arrow",
    segment: "semi-open",
    dwt: 38500,
    built: 2018,
    flag: "SGP",
    owner: "Grieg Star",
    operator: "G2 Ocean",
    status: "Ballast",
    lat: 51.9,
    lon: 4.5,
    speed: 14.2,
    heading: 310,
    destination: "Houston",
    eta: "2026-04-22",
  },
];

describe("FleetTable", () => {
  it("renders vessel count", () => {
    render(<FleetTable vessels={mockVessels} />);
    expect(screen.getByText("Fleet Overview (3 vessels)")).toBeInTheDocument();
  });

  it("renders all vessel names", () => {
    render(<FleetTable vessels={mockVessels} />);
    expect(screen.getByText("Star Carrier")).toBeInTheDocument();
    expect(screen.getByText("Star Grip")).toBeInTheDocument();
    expect(screen.getByText("Canopus Arrow")).toBeInTheDocument();
  });

  it("shows IMO numbers", () => {
    render(<FleetTable vessels={mockVessels} />);
    expect(screen.getByText("IMO: 9483920")).toBeInTheDocument();
    expect(screen.getByText("IMO: 9534567")).toBeInTheDocument();
  });

  it("shows segment labels", () => {
    render(<FleetTable vessels={mockVessels} />);
    expect(screen.getByText("Open Hatch")).toBeInTheDocument();
    expect(screen.getByText("Multipurpose")).toBeInTheDocument();
    expect(screen.getByText("Semi-Open")).toBeInTheDocument();
  });

  it("shows vessel status badges", () => {
    render(<FleetTable vessels={mockVessels} />);
    expect(screen.getByText("Laden")).toBeInTheDocument();
    expect(screen.getByText("Port")).toBeInTheDocument();
    expect(screen.getByText("Ballast")).toBeInTheDocument();
  });

  it("shows destination", () => {
    render(<FleetTable vessels={mockVessels} />);
    expect(screen.getByText("Santos")).toBeInTheDocument();
    expect(screen.getAllByText("Houston")).toHaveLength(2);
  });

  it("filters vessels via search", () => {
    render(<FleetTable vessels={mockVessels} />);
    const input = screen.getByPlaceholderText("Search vessels...");

    fireEvent.change(input, { target: { value: "Star" } });
    expect(screen.getByText("Fleet Overview (2 vessels)")).toBeInTheDocument();
    expect(screen.getByText("Star Carrier")).toBeInTheDocument();
    expect(screen.getByText("Star Grip")).toBeInTheDocument();
    expect(screen.queryByText("Canopus Arrow")).not.toBeInTheDocument();
  });

  it("search by IMO", () => {
    render(<FleetTable vessels={mockVessels} />);
    const input = screen.getByPlaceholderText("Search vessels...");

    fireEvent.change(input, { target: { value: "9567890" } });
    expect(screen.getByText("Fleet Overview (1 vessels)")).toBeInTheDocument();
    expect(screen.getByText("Canopus Arrow")).toBeInTheDocument();
  });

  it("search by destination", () => {
    render(<FleetTable vessels={mockVessels} />);
    const input = screen.getByPlaceholderText("Search vessels...");

    fireEvent.change(input, { target: { value: "Santos" } });
    expect(screen.getByText("Star Carrier")).toBeInTheDocument();
    expect(screen.queryByText("Star Grip")).not.toBeInTheDocument();
  });

  it("shows dash for null ETA", () => {
    render(<FleetTable vessels={mockVessels} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("toggles sort direction on column click", () => {
    render(<FleetTable vessels={mockVessels} />);
    const dwtSortButton = screen.getByRole("button", { name: /DWT/i });

    fireEvent.click(dwtSortButton);
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Star Grip");

    fireEvent.click(dwtSortButton);
    const rowsDesc = screen.getAllByRole("row");
    expect(rowsDesc[1]).toHaveTextContent("Star Carrier");
  });
});
