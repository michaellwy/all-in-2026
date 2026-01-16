import { useQuery } from '@tanstack/react-query';
import type { ChartDataPoint, Timeframe } from '@/types';
import { getDateRange, formatDateForApi } from '@/lib/timeframes';

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

export function useFredData(seriesId: string, timeframe: Timeframe) {
  return useQuery<ChartDataPoint[]>({
    queryKey: ['fred', seriesId, timeframe],
    queryFn: async () => {
      const apiKey = import.meta.env.VITE_FRED_API_KEY;

      if (!apiKey) {
        throw new Error('FRED API key not configured');
      }

      const { start, end } = getDateRange(timeframe);

      const params = new URLSearchParams({
        series_id: seriesId,
        api_key: apiKey,
        file_type: 'json',
        observation_start: formatDateForApi(start),
        observation_end: formatDateForApi(end),
      });

      const response = await fetch(`${FRED_BASE}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch FRED data');
      }

      const data = await response.json();

      return data.observations
        .filter((obs: { value: string }) => obs.value !== '.')
        .map((obs: { date: string; value: string }) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }));
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (FRED data updates less frequently)
    retry: 1,
    enabled: !!import.meta.env.VITE_FRED_API_KEY,
  });
}
