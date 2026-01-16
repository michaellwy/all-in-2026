import { useQuery } from '@tanstack/react-query';
import type { ChartDataPoint, Timeframe } from '@/types';
import { getYahooFinancePeriod, getDateRange } from '@/lib/timeframes';

export function useStockData(ticker: string, timeframe: Timeframe) {
  return useQuery<ChartDataPoint[]>({
    queryKey: ['stock', ticker, timeframe],
    queryFn: async () => {
      if (!ticker) {
        throw new Error('No ticker provided');
      }

      const period = getYahooFinancePeriod(timeframe);

      try {
        // Use corsproxy.io for development, serverless function for production
        // Use weekly interval for max (all time) to avoid too many data points
        const interval = period === 'max' || period === '1y' ? '1wk' : '1d';
        const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${period}&interval=${interval}`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(yahooUrl)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const data = await response.json();

        // Handle Yahoo Finance raw response format
        if (data.chart?.result?.[0]) {
          const result = data.chart.result[0];
          const timestamps = result.timestamp;
          const closes = result.indicators.quote[0].close;

          if (!timestamps || !closes) {
            throw new Error('Invalid data structure');
          }

          return timestamps
            .map((ts: number, i: number) => ({
              date: new Date(ts * 1000).toISOString(),
              value: closes[i],
            }))
            .filter((point: { value: number | null }) => point.value !== null);
        }

        // Handle pre-processed response format
        if (Array.isArray(data)) {
          return data;
        }

        throw new Error('Unexpected response format');
      } catch {
        // Fallback to mock data for development
        console.log(`Using mock data for ${ticker}`);
        return generateMockStockData(ticker, timeframe);
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    enabled: !!ticker,
  });
}

// Mock stock data for development
function generateMockStockData(ticker: string, timeframe: Timeframe): ChartDataPoint[] {
  const { start, end } = getDateRange(timeframe);
  const data: ChartDataPoint[] = [];
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const step = Math.max(1, Math.floor(days / 50));

  // Base prices for known tickers
  const basePrices: Record<string, number> = {
    AMZN: 220, SAP: 250, ORCL: 170, CRM: 340,
    MSFT: 420, TSLA: 410, HOOD: 40, NFLX: 870, COIN: 260,
    QQQ: 525, REMX: 38,
    'HG=F': 4.25, // Copper futures
    'BZ=F': 76, // Brent crude oil
    'DX-Y.NYB': 108, // US Dollar Index
    SPY: 590, // S&P 500 ETF benchmark
  };

  let value = basePrices[ticker] || 100;
  const volatility = value * 0.02; // 2% daily volatility

  for (let i = 0; i <= days; i += step) {
    const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    value = Math.max(value * 0.8, value + (Math.random() - 0.48) * volatility);
    data.push({
      date: date.toISOString(),
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
}
