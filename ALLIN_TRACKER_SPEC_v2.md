# All-In 2026 Predictions Tracker

## Vision

An **interactive article** that walks readers through the All-In Podcast's 2026 predictions. Think Bloomberg or NYT interactive storytelling - clean editorial design, smooth scrolling through sections, with embedded interactive charts for predictions that have trackable proxies.

**No scorecards. No tallying. No gamification.** Just the predictions, their context, and the data to see how they're playing out.

---

## User Experience

### Reading Flow
- User scrolls through the article like reading a story
- Each **category** (Political Winner, Business Loser, etc.) is a section
- Within each section, **each host's prediction** is displayed
- **Hover** on a prediction → tooltip bubble shows the host's exact quote
- **Click** on predictions with proxies → expands to show interactive chart

### Chart Interaction
- Default view: **YTD** (Year to Date from Jan 1, 2026)
- Time frame toggles: **1M, 3M, 6M, YTD, 1Y, ALL**
- Hover on chart → shows exact value at that point
- Clean, minimal chart design (no clutter)
- Baseline marker showing Jan 2026 starting point

---

## Design Principles

1. **Editorial, not dashboard** - Reads like a well-designed article
2. **Progressive disclosure** - Details on demand (hover/click)
3. **Let the data speak** - No editorializing about who's "winning"
4. **Mobile-first** - Works beautifully on phones
5. **Fast** - Lazy load charts, cache API data

---

## Tech Stack

```
React + TypeScript + Vite
Tailwind CSS (typography plugin for article styling)
Recharts or Lightweight Charts (for financial charts)
React Query (data fetching + caching)
Framer Motion (smooth animations for tooltips/expansions)
```

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ALL-IN 2026 PREDICTIONS                                   │
│   How the bets are playing out                              │
│                                                             │
│   [Hero section with 4 host avatars]                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   § BIGGEST POLITICAL WINNER                                │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 🔵 FRIEDBERG                                        │   │
│   │ Democratic Socialists of America (DSA)       [📊]  │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 🟢 CHAMATH                                          │   │
│   │ Anyone fighting waste, fraud & abuse               │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 🟠 SACKS                                            │   │
│   │ The Trump Boom                              [📊]   │   │
│   │                                                     │   │
│   │ ┌─────────────────────────────────────────────┐    │   │
│   │ │  [Expanded Chart Area]                      │    │   │
│   │ │                                             │    │   │
│   │ │  CPI Inflation                              │    │   │
│   │ │  ════════════════════════════════          │    │   │
│   │ │  [1M] [3M] [6M] [YTD] [1Y] [ALL]           │    │   │
│   │ │                                             │    │   │
│   │ │  Baseline: 2.7% (Jan 2026)                 │    │   │
│   │ │  Current: 2.5%  ↓0.2%                      │    │   │
│   │ │                                             │    │   │
│   │ └─────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 🔴 JASON                                            │   │
│   │ The Mandami Moment / JD Vance               [📊]   │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   § BIGGEST POLITICAL LOSER                                 │
│   ...                                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. `<Article />` - Main container
```tsx
// Wrapper with max-width, typography styling
// Handles scroll-based section highlighting
```

### 2. `<CategorySection />` - One per category
```tsx
interface CategorySectionProps {
  title: string;           // "Biggest Political Winner"
  timestamp: string;       // "12:32"
  predictions: Prediction[];
}
```

### 3. `<PredictionCard />` - Individual prediction
```tsx
interface PredictionCardProps {
  host: Host;
  prediction: string;
  rationale: string;       // Shows on hover
  proxies: Proxy[];        // If any, shows chart icon
  isExpanded: boolean;
  onToggle: () => void;
}

// Behavior:
// - Hover anywhere → tooltip with rationale quote
// - Click (if has proxies) → expand to show chart
// - No proxies → just the card, no expand
```

### 4. `<ProxyChart />` - Interactive chart
```tsx
interface ProxyChartProps {
  proxy: Proxy;
  defaultTimeframe?: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL';
}

// Features:
// - Time frame selector buttons
// - Baseline reference line
// - Hover tooltip with value + date
// - Loading skeleton while fetching
// - Error state if API fails
```

### 5. `<QuoteTooltip />` - Hover tooltip
```tsx
interface QuoteTooltipProps {
  quote: string;
  hostColor: string;
}

// Shows the host's exact words in a styled bubble
// Appears on hover, disappears on mouse leave
// Positioned intelligently (above/below based on space)
```

---

## Data Structure

```typescript
interface Host {
  id: 'friedberg' | 'chamath' | 'sacks' | 'jason';
  name: string;
  color: string;
}

interface Category {
  id: string;
  title: string;
  timestamp: string;
}

interface Prediction {
  id: string;
  host: Host['id'];
  category: Category['id'];
  prediction: string;      // Short title
  rationale: string;       // Full quote for tooltip
  proxies: Proxy[];        // Empty array if no trackable proxy
}

interface Proxy {
  id: string;
  name: string;            // "CPI Inflation", "Copper Miners ETF"
  type: 'stock' | 'etf' | 'polymarket' | 'fred';
  
  // For fetching data
  ticker?: string;         // "COPX", "AMZN"
  fredSeries?: string;     // "CPIAUCSL"
  polymarketSlug?: string; // "which-party-will-win-the-house-in-2026"
  
  // For display
  baseline: {
    value: number;
    date: string;
    label?: string;        // "Jan 2026"
  };
  
  // Interpretation
  description?: string;    // "Lower inflation = prediction playing out"
}
```

---

## Chart Specifications

### Time Frames
| Code | Label | Data Points |
|------|-------|-------------|
| 1M | 1 Month | Daily |
| 3M | 3 Months | Daily |
| 6M | 6 Months | Daily |
| YTD | Year to Date | Daily |
| 1Y | 1 Year | Daily |
| ALL | All Available | Weekly |

### Chart Style
- **Line chart** for most proxies
- **Area chart** (optional) for Polymarket odds
- **Colors**: Use host's color for the line
- **Baseline**: Dashed horizontal line at Jan 2026 value
- **Grid**: Minimal, light gray
- **Axis labels**: Clean, not crowded
- **Tooltip**: Shows date + value on hover

### Loading States
- Skeleton pulse animation while loading
- Show cached data immediately if available
- Background refresh for stale data

---

## API Integration

### Yahoo Finance (Stocks & ETFs)
```typescript
// Endpoint: Use yahoo-finance2 npm package or proxy API
// Returns: OHLC data for specified period

interface StockDataPoint {
  date: string;
  close: number;
}

async function getStockData(
  ticker: string, 
  period: '1mo' | '3mo' | '6mo' | 'ytd' | '1y' | 'max'
): Promise<StockDataPoint[]>
```

### FRED (Economic Data)
```typescript
// Endpoint: https://api.stlouisfed.org/fred/series/observations
// Requires: API key (free registration)

interface FredDataPoint {
  date: string;
  value: number;
}

async function getFredData(
  seriesId: string,
  startDate: string,
  endDate: string
): Promise<FredDataPoint[]>
```

### Polymarket
```typescript
// Endpoint: https://gamma-api.polymarket.com
// No auth required

interface PolymarketDataPoint {
  date: string;
  probability: number;  // 0-100
}

async function getPolymarketData(
  slug: string
): Promise<PolymarketDataPoint[]>
```

---

## Predictions Data

### Category 1: Biggest Political Winner (12:32)

**Friedberg** - Democratic Socialists of America (DSA)
```
Rationale: "Just like the MAGA movement took over the Republican party, 
I think the DSA is taking over the Democratic party. And I think that's 
the move we'll see solidified in 2026."

Proxy: Polymarket - "Which party will win the House in 2026?"
       Slug: which-party-will-win-the-house-in-2026
       Baseline: 79% Democrats (Jan 13, 2026)
```

**Chamath** - Anyone fighting waste, fraud & abuse
```
Rationale: "Whoever is going to fight waste, fraud, and abuse at the 
federal, state, and local level. It's an open lane. It's a political 
gambit that I think will work really well in '26."

Proxy: None (qualitative)
```

**Sacks** - The Trump Boom
```
Rationale: "The good economic news started breaking out before 2025 was 
even over. We have 2.7% inflation. Core CPI at 2.6. Both those are 40 
basis points below expectations. 4.3% GDP growth in Q3. Lowest trade 
deficit since 2009... S&P 500 keeps making record highs. People are 
paying less for gas. Mortgage costs have fallen by $3,000. Real wages 
are up over $1,000. And by June, I predict we will see more rate cuts, 
possibly 75 to 100 basis points."

Proxies: 
  - FRED: CPI (CPIAUCSL), Baseline: 2.7%
  - FRED: 30yr Mortgage (MORTGAGE30US), Baseline: 6.7%
  - FRED: Consumer Confidence (UMCSENT), Baseline: 74
```

**Jason** - The Mandami Moment / JD Vance
```
Rationale: "Democrats believe the easiest way to win in 2026 is to go 
full socialist... He is the most popular politician clearly at Turning 
Point USA and he is the OG in the America first, America only moment."

Proxies:
  - Polymarket: JD Vance 2028 GOP Nominee (54%)
  - Polymarket: JD Vance 2028 President (29%)
```

---

### Category 2: Biggest Political Loser (17:47)

**Friedberg** - The Tech Industry
```
Rationale: "AI and tech wealth have become the lightning rod for populism 
on both sides of the aisle. The right is fracturing a bit where this 
alliance between tech and MAGA seems to be getting a really strong 
challenge from the more populist movement. The left is turning hard on 
tech because of tech's alignment with the right."

Proxy: ETF - XLK (Tech Sector), Baseline: ~$240
```

**Chamath** - The Monroe Doctrine
```
Rationale: "There is a clear Trump doctrine that trumped the Monroe 
doctrine. We view this as hemispheric dominance. We view it as proactive 
and in very specific cases interventionist. We intervene against drug 
cartels. We control immigration. We secure vital assets. We have more 
transactional relationships."

Proxy: None (geopolitical, qualitative)
```

**Sacks** - Democratic Centrists
```
Rationale: "Fewer than two dozen House races that are genuinely 
competitive going into 2026. That's because of gerrymandering. So if 
you're a Democrat incumbent who is in one of these districts, your only 
real threat to losing your office is from the left."

Proxy: None (electoral outcomes)
```

**Jason** - Democratic Centrists
```
Rationale: "Same as Sacks"

Proxy: None
```

---

### Category 3: Biggest Business Winner (32:16)

**Friedberg** - Huawei
```
Rationale: "Huawei's effort to partner with SMIC to go deeper in the 
chip stack and they're just firing on all cylinders. It's going to 
outperform expectations, at least the western expectations."

Proxy: None (private company)
```

**Friedberg** - Polymarket
```
Rationale: "Polymarket's evolved from being kind of this one-off quirky 
prediction market to actually really providing insights into current 
events and the news in a way that none of us anticipated. Prediction 
markets could become not just markets but also news."

Proxy: None (private company)
```

**Chamath** - Copper
```
Rationale: "We are still completely underestimating how short we are in 
terms of the global demand supply dynamics... By 2040 we will be short 
about 70% of the global supply. It manifests in everything from our data 
centers to our chips to our weapon systems."

Proxies:
  - ETF: COPX (Copper Miners), Baseline: ~$45
  - FRED: Copper Price (PCOPPUSDM), Baseline: ~$4.00/lb
```

**Sacks** - The IPO Market
```
Rationale: "I think 2026 is going to be a big year for IPOs. We could 
see trillions of dollars of new market cap created of public companies. 
Big reversal of the trend of companies staying private."

Proxy: ETF - IPO (Renaissance IPO ETF), Baseline: ~$55
```

**Jason** - Amazon
```
Rationale: "Amazon is going to have a massive year as they continue to 
replace humans with robots. I think they'll be the first corporate 
singularity which is to say the first company to have more robots 
driving their bottom line than humans."

Proxy: Stock - AMZN, Baseline: ~$220
```

---

### Category 4: Biggest Business Loser (40:51)

**Friedberg** - State Governments
```
Rationale: "State governments are going to have a real problem with 
finding financing because what's going on with the exposés that are 
underway on waste, fraud, and abuse... The other thing that's going to 
hit the fan this year is all of these unrealized pension liabilities."

Proxy: ETF - HYD (High Yield Muni), Baseline: ~$32
```

**Chamath** - Legacy SaaS / Software Industrial Complex
```
Rationale: "These are the companies that sell licensed SaaS to 
corporations of America. It's about a $3 to $4 trillion a year economy. 
Maintenance and migration represent 90% of all the dollars. AI agents 
will cause that to shrink and contract aggressively."

Proxies (basket vs QQQ benchmark):
  - Stock: SAP, Baseline: ~$250
  - Stock: ORCL, Baseline: ~$170
  - Stock: NOW, Baseline: ~$1100
  - Stock: WDAY, Baseline: ~$270
  - Stock: CRM, Baseline: ~$340
  - Benchmark: QQQ, Baseline: ~$525
```

**Sacks** - California
```
Rationale: "California because of the wealth tax and also the onerous 
regulations driving business and capital out of the state. There's two 
major refineries closing by the spring. Higher gas prices will be the 
result."

Proxy: None (U-Haul Index is annual, no real-time data)
```

**Jason** - Young White-Collar Workers
```
Rationale: "It's getting really hard for them to get entry level jobs. 
Companies are having an easier job just automating with AI than training 
up Gen Z graduates."

Proxy: FRED - Youth Unemployment 20-24 (LNS14000036), Baseline: ~7.5%
```

---

### Category 5: Biggest Business Deal (49:34)

**Sacks** - Coding Assistants & Tool Use
```
Rationale: "There was a breakthrough in the last couple of months in 
terms of these coding assistants... This trend feels to me like chatbots 
did at the end of 2022 going into '23."

Proxy: Stock - MSFT (GitHub owner), Baseline: ~$420
```

**Friedberg** - Russia-Ukraine Settlement
```
Rationale: "Russia Ukraine I think it's going to settle out this year. 
There's a lot of motivating factors. Economic and other political 
factors."

Proxy: Polymarket - Ukraine ceasefire/peace deal odds
```

**Chamath** - IP License M&A Workarounds
```
Rationale: "M&A cannot happen. Traditional M&A is effectively dead. 
You'll do what Sundar did, what Satya did, what Jensen did. These huge 
licensing deals that basically replace M&A."

Proxy: None (deal tracking is qualitative)
```

**Jason** - $50B+ Big Tech Acquisition
```
Rationale: "We're going to see a 50 billion plus deal. One of the Mag 7 
—an Apple, a Meta, a Microsoft or an Amazon going out and trying to buy 
XAI, Mistral, Perplexity, Anthropic."

Proxy: None (binary event)
```

---

### Category 6: Most Contrarian Belief (56:15)

**Friedberg** - Increased Arab State Conflict
```
Rationale: "There is already this brewing conflict amongst the other 
Arab states. Between UAE, Saudi, Qatar... The contrarian point may in 
fact be that Iran has been a stabilizing force in that region."

Proxy: ETF - ITA (Defense), Baseline: ~$150
```

**Sacks** - AI Increases Knowledge Worker Demand
```
Rationale: "I would refer you to Jevons paradox for knowledge workers. 
As the cost of a resource goes down, the aggregate demand for it 
actually increases because you discover more and more use cases."

Proxy: FRED - Software Developer Jobs (JTS540099000000000JOL)
```

**Chamath** - SpaceX/Tesla Merger
```
Rationale: "I don't think SpaceX will IPO. I think that it will reverse 
merge into Tesla and I think Elon will use it as a moment to consolidate 
control."

Proxy: Stock - TSLA, Baseline: ~$410
```

**Chamath** - New Sovereign Crypto
```
Rationale: "Central banks will seek out a completely new cryptographic 
paradigm that they can control on their balance sheet that is fungible, 
tradable and completely secure and private."

Proxy: None (qualitative)
```

**Jason** - US-China Resolution
```
Rationale: "The standoff with China is going to be largely resolved. 
The issues around Taiwan are going to be resolved. We work out a working 
relationship where both China and America win."

Proxy: Polymarket - China/Taiwan invasion odds
```

---

### Category 7: Best Performing Asset (1:03:05)

**Friedberg** - Polymarket
```
Rationale: "On a tear. Network effects. Replacing media, replacing markets."

Proxy: None (private company)
```

**Chamath** - Critical Metals
```
Rationale: "I would pick a basket of critical metals."

Proxies:
  - ETF: REMX (Rare Earth), Baseline: ~$38
  - ETF: COPX (Copper Miners), Baseline: ~$45
```

**Chamath** - Gambling/Wagering
```
Rationale: "If we are in a rate cut environment and people have a little 
bit of cash laying around. Robinhood, Polymarket, PrizePicks."

Proxies:
  - Stock: DKNG (DraftKings), Baseline: ~$42
  - Stock: FLUT (Flutter), Baseline: ~$270
  - Stock: HOOD (Robinhood), Baseline: ~$40
```

**Sacks** - Tech Super Cycle
```
Rationale: "The expanding super cycle in tech. US productivity just 
surged 4.9%, the strongest reading in nearly 6 years."

Proxies:
  - ETF: QQQ (Nasdaq 100), Baseline: ~$525
  - ETF: XLK (Tech Sector), Baseline: ~$240
```

---

### Category 8: Worst Performing Asset (1:08:02)

**Sacks** - California Luxury Real Estate
```
Rationale: "California luxury real estate because of the overhang of 
the wealth tax. The 5% mansion tax has just killed LA real estate."

Proxy: None (no real-time public data)
```

**Chamath** - Hydrocarbons / Oil
```
Rationale: "The trend in oil is inexorable and it's down. Electrification 
and energy storage are just unstoppable. More likely to see $45 than 
$65 per barrel."

Proxies:
  - ETF: USO (US Oil Fund), Baseline: ~$75
  - ETF: XLE (Energy Sector), Baseline: ~$90
```

**Jason** - US Dollar
```
Rationale: "Our debt continues to grow unabated. We're going to add 
two trillion in debt this year."

Proxy: ETF - UUP (Dollar Index), Baseline: ~$29
```

**Friedberg** - Netflix (conditional)
```
Rationale: "Netflix if they don't close the Warner Brother deal. They 
only pay creators cost plus 10% now. Creators would prefer not to work 
with Netflix anymore."

Proxy: Stock - NFLX, Baseline: ~$870
       (Note: Conditional on no Warner Brothers deal)
```

---

### Category 9: Most Anticipated Trend (1:15:17)

**Friedberg** - Democratic Revolution in Iran
```
Rationale: "Iran becoming an independent democratic state. There's an 
uprising in the streets. Demographics are destiny. There's a lot of 
young people in Iran and they do not want to live under the current rule."

Proxies:
  - Polymarket: Khamenei out by March 31 (44%)
  - Polymarket: Iran regime fall by Jan 31 (16%)
```

**Sacks** - Decentralized DOGE / Auditing Government
```
Rationale: "Auditing government spending at all levels. Decentralized 
Doge. Let a thousand Nick Shirleys bloom. All government spending needs 
to be opened up and audited by the public."

Proxy: None (qualitative)
```

**Chamath** - Unilateralism / Economic Resilience
```
Rationale: "The expansion of this Trump doctrine. If you are an economic 
actor, you must understand the movements on the chessboard in 2026. The 
best framework is this idea of unilateralism, economic resilience."

Proxy: None (qualitative)
```

**Jason** - Mega IPO(s)
```
Rationale: "Two of SpaceX, Anduril, Stripe, Anthropic, OpenAI will file. 
The public wants these shares."

Proxies:
  - Polymarket: SpaceX IPO 2026
  - Polymarket: Stripe IPO 2026
```

---

### Category 10: Most Anticipated Media (1:21:18)

**Friedberg** - Citizen Journalism / Exposés
```
Rationale: "The big trend in media is going to be the citizen journalism 
doing exposés. The work of journalism has been decentralized."

Proxy: None
```

**Chamath** - Citizen Journalism
```
Rationale: "Same thing as Friedberg. I'll just double down."

Proxy: None
```

**Sacks** - The Odyssey (Christopher Nolan)
```
Rationale: "The new Christopher Nolan movie is coming out. Looks interesting."

Proxy: None
```

**Jason** - The Odyssey + Dune 3 + Avengers Doomsday
```
Rationale: "Christopher Nolan. Timothy Chalamet and Dune part 3. Avengers 
Doomsday with RDJ as Dr. Doom setting up Secret Wars."

Proxy: None
```

---

## File Structure

```
src/
├── components/
│   ├── Article.tsx           # Main wrapper with typography styles
│   ├── CategorySection.tsx   # Section header + predictions
│   ├── PredictionCard.tsx    # Individual prediction with hover/click
│   ├── QuoteTooltip.tsx      # Hover tooltip for rationale
│   ├── ProxyChart.tsx        # Interactive chart component
│   ├── TimeframeSelector.tsx # 1M/3M/6M/YTD/1Y/ALL buttons
│   └── ChartSkeleton.tsx     # Loading state
│
├── hooks/
│   ├── useStockData.ts       # Yahoo Finance fetching
│   ├── useFredData.ts        # FRED API fetching
│   ├── usePolymarketData.ts  # Polymarket API fetching
│   └── useChartData.ts       # Unified hook for any proxy type
│
├── data/
│   ├── predictions.ts        # All prediction data
│   ├── hosts.ts              # Host info + colors
│   └── categories.ts         # Category definitions
│
├── lib/
│   ├── api.ts                # API client setup
│   └── formatters.ts         # Number/date formatting
│
├── styles/
│   └── article.css           # Typography and article styling
│
├── App.tsx
└── main.tsx
```

---

## Styling Notes

### Typography
- Use `@tailwindcss/typography` plugin for article prose
- Large, readable headings for categories
- Comfortable line height for readability

### Colors
```typescript
const hostColors = {
  friedberg: '#3B82F6',  // Blue
  chamath: '#10B981',    // Emerald
  sacks: '#F59E0B',      // Amber
  jason: '#EF4444',      // Red
};
```

### Card States
- **Default**: Clean card with host color accent
- **Hover**: Slight lift, shows tooltip with quote
- **Expanded**: Smoothly reveals chart below
- **Loading**: Skeleton pulse in chart area

### Chart Colors
- Use host's color for the main line
- Gray dashed line for baseline
- Light grid, minimal axis clutter

---

## Animation

Use Framer Motion for:
- Tooltip fade in/out on hover
- Card expansion/collapse (height animation)
- Chart line drawing animation on load
- Smooth scroll-to-section

---

## Responsive Design

### Desktop (>1024px)
- Max-width article container (~720px)
- Charts expand inline below cards
- Side-by-side comparison possible

### Tablet (768-1024px)
- Full-width cards
- Charts stack below

### Mobile (<768px)
- Single column
- Tap to expand (no hover tooltips)
- Full-width charts
- Larger touch targets for timeframe buttons

---

## Performance

1. **Lazy load charts** - Only fetch data when card is expanded
2. **Cache API responses** - Use React Query with stale-while-revalidate
3. **Skeleton loading** - Show placeholder immediately
4. **Debounce timeframe changes** - Don't spam API on rapid clicking
5. **Memoize chart rendering** - Prevent unnecessary re-renders

---

## Environment Variables

```env
VITE_FRED_API_KEY=your_fred_api_key
```

Yahoo Finance and Polymarket don't require API keys.

---

## Summary of Proxies by Type

### Stocks (Yahoo Finance)
| Ticker | Prediction | Host |
|--------|------------|------|
| AMZN | Amazon wins | Jason |
| SAP | Legacy SaaS loses | Chamath |
| ORCL | Legacy SaaS loses | Chamath |
| NOW | Legacy SaaS loses | Chamath |
| WDAY | Legacy SaaS loses | Chamath |
| CRM | Legacy SaaS loses | Chamath |
| MSFT | Coding assistants | Sacks |
| TSLA | SpaceX merger | Chamath |
| DKNG | Gambling wins | Chamath |
| FLUT | Gambling wins | Chamath |
| HOOD | Gambling wins | Chamath |
| NFLX | Netflix loses | Friedberg |

### ETFs (Yahoo Finance)
| Ticker | Prediction | Host |
|--------|------------|------|
| XLK | Tech loses politically | Friedberg |
| COPX | Copper wins | Chamath |
| IPO | IPO market wins | Sacks |
| HYD | State govts lose | Friedberg |
| QQQ | Tech super cycle | Sacks |
| ITA | Arab conflict | Friedberg |
| REMX | Critical metals | Chamath |
| USO | Oil loses | Chamath |
| XLE | Oil loses | Chamath |
| UUP | Dollar loses | Jason |

### FRED Series
| Series | Prediction | Host |
|--------|------------|------|
| CPIAUCSL | Trump boom (CPI) | Sacks |
| MORTGAGE30US | Trump boom (mortgage) | Sacks |
| UMCSENT | Trump boom (confidence) | Sacks |
| PCOPPUSDM | Copper price | Chamath |
| LNS14000036 | Youth unemployment | Jason |
| JTS540099000000000JOL | Software jobs (Jevons) | Sacks |

### Polymarket
| Event | Prediction | Host |
|-------|------------|------|
| House 2026 | DSA takeover | Friedberg |
| Vance 2028 GOP | JD Vance rises | Jason |
| Vance 2028 President | JD Vance rises | Jason |
| Ukraine ceasefire | Settlement | Friedberg |
| Taiwan invasion | US-China resolution | Jason |
| Khamenei out | Iran revolution | Friedberg |
| Iran regime fall | Iran revolution | Friedberg |
| SpaceX IPO | Mega IPO | Jason |
| Stripe IPO | Mega IPO | Jason |
