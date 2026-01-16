import type { Proxy, Timeframe, ChartDataPoint } from '@/types';
import { useStockData } from './useStockData';
import { useFredData } from './useFredData';

interface UseChartDataResult {
  data: ChartDataPoint[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Note: Polymarket data is now handled by PolymarketChart component directly
// with its own timeframe state (1H, 6H, 1D, 1W, 1M, ALL)
export function useChartData(proxy: Proxy, timeframe: Timeframe): UseChartDataResult {
  // Stock/ETF data
  const stockQuery = useStockData(
    proxy.ticker || '',
    timeframe
  );

  // FRED data
  const fredQuery = useFredData(
    proxy.fredSeries || '',
    timeframe
  );

  // Return the appropriate query based on proxy type
  switch (proxy.type) {
    case 'stock':
    case 'etf':
      return {
        data: stockQuery.data,
        isLoading: stockQuery.isLoading,
        error: stockQuery.error,
      };
    case 'fred':
      return {
        data: fredQuery.data,
        isLoading: fredQuery.isLoading,
        error: fredQuery.error,
      };
    case 'polymarket':
      // Polymarket is handled separately by PolymarketChart
      return {
        data: undefined,
        isLoading: false,
        error: null,
      };
    default:
      return {
        data: undefined,
        isLoading: false,
        error: new Error('Unknown proxy type'),
      };
  }
}
