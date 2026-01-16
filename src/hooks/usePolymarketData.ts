import { useQuery } from '@tanstack/react-query';
import type { ChartDataPoint, PolymarketTimeframe } from '@/types';
import { getPolymarketDateRange, getPolymarketApiParams } from '@/lib/timeframes';

export function usePolymarketData(slug: string, timeframe: PolymarketTimeframe) {
  return useQuery<ChartDataPoint[]>({
    queryKey: ['polymarket', slug, timeframe],
    queryFn: async () => {
      if (!slug) {
        throw new Error('No slug provided');
      }

      const { start, end } = getPolymarketDateRange(timeframe);
      const { interval, fidelity } = getPolymarketApiParams(timeframe);

      try {
        // Use local proxy in dev, external CORS proxy in production
        const isDev = import.meta.env.DEV;
        const gammaBase = isDev ? '/api/polymarket/gamma' : 'https://gamma-api.polymarket.com';
        const clobBase = isDev ? '/api/polymarket/clob' : 'https://clob.polymarket.com';
        const corsProxy = (url: string) => isDev ? url : `https://corsproxy.io/?${encodeURIComponent(url)}`;

        // Try exact slug match first
        const searchUrl = `${gammaBase}/markets?slug=${slug}`;

        let market = null;
        let searchResponse = await fetch(isDev ? searchUrl : corsProxy(searchUrl));

        if (searchResponse.ok) {
          const markets = await searchResponse.json();
          if (markets && markets.length > 0) {
            market = markets[0];
          }
        }

        // If no exact match, try text search
        if (!market) {
          const textSearchUrl = `${gammaBase}/markets?_limit=5&closed=false&textSearch=${encodeURIComponent(slug.replace(/-/g, ' '))}`;
          searchResponse = await fetch(isDev ? textSearchUrl : corsProxy(textSearchUrl));

          if (searchResponse.ok) {
            const markets = await searchResponse.json();
            if (markets && markets.length > 0) {
              market = markets[0];
            }
          }
        }

        if (market) {
          // Try to get price history with appropriate interval
          const historyUrl = `${clobBase}/prices-history?market=${market.conditionId}&interval=${interval}&fidelity=${fidelity}`;
          const historyResponse = await fetch(isDev ? historyUrl : corsProxy(historyUrl));

          if (historyResponse.ok) {
            const data = await historyResponse.json();
            if (data.history && data.history.length > 0) {
              const filtered = data.history
                .filter((point: { t: number }) => {
                  const pointDate = new Date(point.t * 1000);
                  return pointDate >= start && pointDate <= end;
                })
                .map((point: { t: number; p: number }) => ({
                  date: new Date(point.t * 1000).toISOString(),
                  value: point.p * 100,
                }));

              if (filtered.length > 0) {
                return filtered;
              }
            }
          }

          // Use current price if no history
          const currentPrice = market.outcomePrices
            ? JSON.parse(market.outcomePrices)[0] * 100
            : 50;

          return generateTrendData(timeframe, currentPrice);
        }

        throw new Error('Could not fetch Polymarket data');
      } catch (error) {
        console.log(`Using mock data for Polymarket: ${slug}`, error);
        return generateMockPolymarketData(timeframe, slug);
      }
    },
    staleTime: timeframe === '1H' ? 1000 * 60 : 1000 * 60 * 5, // 1 min for 1H, 5 min for others
    retry: 1,
    enabled: !!slug,
  });
}

// Generate trend data leading to current price
function generateTrendData(timeframe: PolymarketTimeframe, currentPrice: number): ChartDataPoint[] {
  const { start, end } = getPolymarketDateRange(timeframe);
  const data: ChartDataPoint[] = [];
  const totalMs = end.getTime() - start.getTime();
  const points = 30;
  const stepMs = totalMs / points;

  // Start from a different value and trend toward current
  let value = currentPrice + (Math.random() - 0.5) * 20;

  for (let i = 0; i <= points; i++) {
    const date = new Date(start.getTime() + i * stepMs);
    // Gradually move toward current price
    value = value + (currentPrice - value) * 0.1 + (Math.random() - 0.5) * 3;
    value = Math.max(5, Math.min(95, value));

    data.push({
      date: date.toISOString(),
      value: Math.round(value),
    });
  }

  // Ensure last point is close to current price
  if (data.length > 0) {
    data[data.length - 1].value = Math.round(currentPrice);
  }

  return data;
}

// Generate mock data based on prediction type
function generateMockPolymarketData(timeframe: PolymarketTimeframe, slug: string): ChartDataPoint[] {
  const { start, end } = getPolymarketDateRange(timeframe);
  const data: ChartDataPoint[] = [];
  const totalMs = end.getTime() - start.getTime();

  // Adjust points based on timeframe
  let points = 30;
  if (timeframe === '1H') points = 60;
  else if (timeframe === '6H') points = 72;
  else if (timeframe === '1D') points = 96;
  else if (timeframe === '1W') points = 168;
  else if (timeframe === '1M') points = 120;
  else if (timeframe === 'MAX') points = 200;

  const stepMs = totalMs / points;

  // Set starting values based on prediction type (using actual Polymarket slugs)
  const baseValues: Record<string, number> = {
    'will-the-democratic-party-control-the-house-after-the-2026-midterm-elections': 79,
    'will-jd-vance-win-the-2028-republican-presidential-nomination': 54,
    'will-jd-vance-win-the-2028-us-presidential-election': 29,
    'russia-x-ukraine-ceasefire-before-2027': 50,
    'will-china-invade-taiwan-before-2027': 5,
    'khamenei-out-as-supreme-leader-of-iran-by-march-31': 44,
    'will-the-iranian-regime-fall-by-january-31': 16,
    'spacex-space-exploration-technologies-corp-ipo-before-2027': 15,
    'stripe-ipo-before-2027': 25,
  };

  let value = baseValues[slug] || 50;

  for (let i = 0; i <= points; i++) {
    const date = new Date(start.getTime() + i * stepMs);
    value = Math.max(5, Math.min(95, value + (Math.random() - 0.5) * 4));
    data.push({
      date: date.toISOString(),
      value: Math.round(value),
    });
  }

  return data;
}
