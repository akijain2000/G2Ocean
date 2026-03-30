# G2 Ocean - Market Intelligence Dashboard

> **[Live Demo](https://akijain2000.github.io/G2Ocean/)**

A web-based shipping market intelligence dashboard for G2 Ocean that provides real-time data analysis across open hatch, semi-open, multipurpose, and dry bulk segments.

## Features

### Market Overview
- Key market indices (BDI, Capesize, Panamax, Supramax, Handysize)
- 90-day freight rate trend charts with segment filtering
- Average rate comparison across all four vessel segments

### Fleet Monitor
- Interactive vessel map with live AIS positions (Leaflet)
- Searchable and sortable fleet table
- Newbuilding order tracking with delivery timelines
- Segment-based filtering (open hatch, semi-open, multipurpose, dry bulk)

### Competitor Analysis
- Market share visualization by fleet count and DWT capacity
- Stacked bar chart showing fleet composition by segment
- Side-by-side competitor comparison table

### Macroeconomic Trends
- World trade volume index
- Commodity prices (iron ore, coal, wheat, global commodity index)
- GDP indicators for key trading regions (World, China, EU)

### Report Generator
- Configurable report templates (weekly, monthly, quarterly, custom)
- Module selection for targeted reports
- PDF and Excel export with formatted data tables
- Live report preview before generation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **Maps**: Leaflet + react-leaflet
- **Database**: SQLite via Prisma ORM
- **Export**: jsPDF (PDF) + xlsx (Excel)
- **Theme**: Dark/light mode via next-themes

## API Integrations

| Provider | Data | Status |
|----------|------|--------|
| SeaRates | Freight rates, vessel tracking | Ready (falls back to mock data) |
| MarineTraffic | AIS positions, fleet database | Ready (falls back to mock data) |
| FRED (Federal Reserve) | Macro indicators, GDP, commodity prices | Ready (falls back to mock data) |

The dashboard works out of the box with realistic mock data. When API keys are configured, it seamlessly switches to live data.

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Configure API Keys (Optional)

Copy the environment template and add your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual API keys:
- `SEARATES_API_KEY` - Get from [SeaRates](https://www.searates.com/)
- `MARINETRAFFIC_API_KEY` - Get from [MarineTraffic](https://www.marinetraffic.com/)
- `FRED_API_KEY` - Get from [FRED](https://fred.stlouisfed.org/docs/api/api_key.html)

### Initialize Database

```bash
DATABASE_URL="file:./dev.db" npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Testing

```bash
npm test              # run all 78 unit tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

## Deployment

The dashboard is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions. The workflow builds a static export and publishes to the `github-pages` environment.

## Project Structure

```
src/
  app/                          # Next.js App Router pages
    page.tsx                    # Market Overview (home)
    fleet/page.tsx              # Fleet Monitor
    competitors/page.tsx        # Competitor Analysis
    macro/page.tsx              # Macroeconomic Trends
    reports/page.tsx            # Report Generator
    api/                        # API route handlers
  components/
    layout/                     # Sidebar, Header
    dashboard/                  # Market overview components
    fleet/                      # Fleet monitoring components
    competitors/                # Competitor analysis components
    macro/                      # Macro trend components
    reports/                    # Report generation components
    ui/                         # Reusable UI primitives
  lib/
    api/                        # External API clients
    db/                         # Database client
    utils/                      # Formatting and export utilities
    types.ts                    # Shared TypeScript types
```
