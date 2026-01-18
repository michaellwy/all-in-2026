# All-In 2026 Predictions Tracker

An interactive editorial article that tracks predictions from the All-In Podcast hosts (Friedberg, Chamath, Sacks, and Jason) for 2026, with real-time data visualization showing how these predictions hold up against reality.

![All-In 2026](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## Overview

Each prediction is linked to trackable "proxies" - real data sources like stock prices, economic indicators, and prediction markets - allowing readers to see objective evidence of whether predictions are coming true.

**Live Demo:** https://allin2026.vercel.app/

## Features

- **36 Predictions** across 9 categories (Political Winner/Loser, Business Winner/Loser, Deals, Contrarian, Best/Worst Asset, Trend)
- **Real-time Data** from multiple sources:
  - Stock/ETF prices (Yahoo Finance)
  - Economic indicators (FRED - Federal Reserve)
  - Prediction market odds (Polymarket)
  - News headlines (Google News RSS)
  - IPO tracking (Stock Analysis)
- **Interactive Charts** with multiple timeframes and benchmark comparisons (SPY, QQQ)
- **Smooth Animations** with scroll-triggered reveals and spring physics
- **Responsive Design** optimized for mobile and desktop
- **Floating TOC** for easy navigation between categories

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| Animations | Framer Motion + Anime.js |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/michaellwy/all-in-2026.git
cd all-in-2026

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables (Optional)

Create a `.env.local` file for optional API keys:

```env
VITE_FRED_API_KEY=your_fred_api_key
```

Note: The app works without API keys using public endpoints and fallback data.

## Project Structure

```
src/
├── components/          # React components
│   ├── Article.tsx      # Main layout + hero section
│   ├── PredictionCard.tsx   # Expandable prediction cards
│   ├── ProxyChart.tsx   # Stock/ETF charts with benchmarks
│   ├── PolymarketChart.tsx  # Prediction market charts
│   ├── FredChart.tsx    # Economic data charts
│   ├── FloatingTOC.tsx  # Sticky navigation sidebar
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useStockData.ts  # Yahoo Finance fetching
│   ├── usePolymarketData.ts # Polymarket API
│   ├── useFredData.ts   # FRED economic data
│   └── ...
├── data/                # Static data
│   ├── predictions.ts   # All 36 predictions with proxies
│   ├── hosts.ts         # Host metadata (colors, avatars)
│   └── categories.ts    # Category definitions
├── types/               # TypeScript interfaces
└── lib/                 # Utility functions

api/                     # Vercel serverless functions
├── stock.ts             # Yahoo Finance proxy
├── fred.ts              # FRED data proxy
└── news.ts              # Google News RSS proxy
```

## Data Sources

| Source | Data Type | Update Frequency |
|--------|-----------|------------------|
| Yahoo Finance | Stock prices, ETFs | Real-time (1hr cache) |
| FRED | GDP, unemployment, housing | Daily/Weekly (24hr cache) |
| Polymarket | Prediction market odds | Real-time (5min cache) |
| Google News | Headlines | Real-time (5min cache) |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Deployment

The app is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

Serverless functions in `/api` handle CORS proxying for external APIs in production.

## Documentation

See [TECH_STACK_EXPLAINED.md](./TECH_STACK_EXPLAINED.md) for an in-depth explanation of the tech stack, data fetching architecture, and computer science concepts used in this project.

## License

MIT
