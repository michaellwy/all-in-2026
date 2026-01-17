import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Proxy, Timeframe } from '@/types';
import { useChartData } from '@/hooks/useChartData';
import { useStockData } from '@/hooks/useStockData';
import { TimeframeSelector } from './TimeframeSelector';
import { ChartSkeleton } from './ChartSkeleton';

// Tickers that shouldn't show benchmark comparisons (commodities, currencies, etc.)
const EXCLUDE_BENCHMARK_TICKERS = [
  'HG=F', // Copper futures
  'BZ=F', // Brent crude oil futures
  'CL=F', // WTI crude oil futures
  'DX-Y.NYB', // US Dollar Index
  'GLD',  // Gold ETF
  'SLV',  // Silver ETF
];

// Check if a ticker should show benchmarks
function shouldShowBenchmarks(ticker: string): boolean {
  if (EXCLUDE_BENCHMARK_TICKERS.includes(ticker)) return false;
  // Exclude futures contracts (contain =F)
  if (ticker.includes('=F')) return false;
  return true;
}

interface ProxyChartProps {
  proxy: Proxy;
  hostColor: string;
}

// Get display label for timeframe
function getTimeframeLabel(timeframe: Timeframe): string {
  switch (timeframe) {
    case '1M':
      return 'past month';
    case '3M':
      return 'past 3 months';
    case '6M':
      return 'past 6 months';
    case 'YTD':
      return 'year to date';
    case '1Y':
      return 'past year';
    case 'ALL':
      return 'all time';
  }
}

export function ProxyChart({ proxy, hostColor }: ProxyChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('YTD');
  const { data, isLoading, error } = useChartData(proxy, timeframe);

  // Determine if we should show benchmarks for this proxy
  // Don't show benchmarks for ALL timeframe (too much historical data to compare)
  const ticker = proxy.ticker || '';
  const showBenchmarks = shouldShowBenchmarks(ticker) && (proxy.type === 'stock' || proxy.type === 'etf') && timeframe !== 'ALL';

  // Fetch benchmark data
  const { data: spyData } = useStockData(showBenchmarks ? 'SPY' : '', timeframe);
  const { data: qqqData } = useStockData(showBenchmarks ? 'QQQ' : '', timeframe);

  // Normalize data to percentage returns and merge with benchmarks
  const normalizedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const baseValue = data[0].value;

    // Create a map of dates to data points
    const dateMap = new Map<string, {
      date: string;
      value: number;
      pctReturn: number;
      spy?: number;
      qqq?: number;
    }>();

    // Add main data
    data.forEach((point) => {
      const dateKey = point.date.split('T')[0];
      dateMap.set(dateKey, {
        date: point.date,
        value: point.value,
        pctReturn: ((point.value - baseValue) / baseValue) * 100,
      });
    });

    // Add SPY data if available
    if (showBenchmarks && spyData && spyData.length > 0) {
      const spyBase = spyData[0].value;
      spyData.forEach((point) => {
        const dateKey = point.date.split('T')[0];
        const existing = dateMap.get(dateKey);
        if (existing) {
          existing.spy = ((point.value - spyBase) / spyBase) * 100;
        }
      });
    }

    // Add QQQ data if available
    if (showBenchmarks && qqqData && qqqData.length > 0) {
      const qqqBase = qqqData[0].value;
      qqqData.forEach((point) => {
        const dateKey = point.date.split('T')[0];
        const existing = dateMap.get(dateKey);
        if (existing) {
          existing.qqq = ((point.value - qqqBase) / qqqBase) * 100;
        }
      });
    }

    return Array.from(dateMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data, spyData, qqqData, showBenchmarks]);

  // Tickers that are indices (no dollar sign)
  const isIndex = ticker === 'DX-Y.NYB';

  const formatValue = (value: number) => {
    if (proxy.type === 'polymarket') {
      return `${value.toFixed(0)}%`;
    }
    if (isIndex) {
      return value.toFixed(2);
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    if (value >= 100) {
      return `$${value.toFixed(0)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPctReturn = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    // For shorter timeframes (1M, 3M), show month and day only
    if (timeframe === '1M' || timeframe === '3M') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    // For longer timeframes (6M, YTD, 1Y, ALL), include year
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <TimeframeSelector
            selected={timeframe}
            onChange={setTimeframe}
            hostColor={hostColor}
          />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <TimeframeSelector
            selected={timeframe}
            onChange={setTimeframe}
            hostColor={hostColor}
          />
        </div>
        <div className="h-48 bg-[var(--color-bg)] rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center">
          <p className="text-sm text-[var(--color-text-muted)] font-medium">
            Unable to load data
          </p>
        </div>
      </div>
    );
  }

  const currentValue = data[data.length - 1]?.value;
  const startValue = data[0]?.value;

  // Calculate period return (based on selected timeframe)
  const periodChange = currentValue - startValue;
  const periodChangePercent = startValue > 0 ? ((periodChange / startValue) * 100).toFixed(1) : '0';
  const isPeriodPositive = periodChange >= 0;

  // Get benchmark returns for display
  const lastNormalizedPoint = normalizedData[normalizedData.length - 1];
  const hasBenchmarkData = showBenchmarks && lastNormalizedPoint?.spy !== undefined;

  // Use normalized data for chart when showing benchmarks, otherwise use raw data
  const chartData = showBenchmarks && normalizedData.length > 0 ? normalizedData : data;
  const usePercentageYAxis = showBenchmarks && hasBenchmarkData;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-2xl text-[var(--color-text)]">
            {formatValue(currentValue)}
          </span>
          <span
            className={`text-sm font-bold px-2 py-0.5 rounded-full ${
              isPeriodPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isPeriodPositive ? '+' : ''}
            {periodChangePercent}%
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            {getTimeframeLabel(timeframe)}
          </span>
        </div>
        <TimeframeSelector
          selected={timeframe}
          onChange={setTimeframe}
          hostColor={hostColor}
        />
      </div>

      <div className="h-48 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: '#8C8C8C', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v) => usePercentageYAxis ? formatPctReturn(v) : formatValue(v)}
              tick={{ fontSize: 10, fill: '#8C8C8C', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload;
                  return (
                    <div className="bg-[var(--color-text)] text-white text-xs rounded-lg px-3 py-2 shadow-lg border-2 border-[var(--color-text)]">
                      <div className="font-bold">{formatValue(point.value)}</div>
                      {usePercentageYAxis && (
                        <div className="mt-1 space-y-0.5">
                          <div style={{ color: hostColor }}>{ticker}: {formatPctReturn(point.pctReturn)}</div>
                          {point.spy !== undefined && (
                            <div className="opacity-60">SPY: {formatPctReturn(point.spy)}</div>
                          )}
                          {point.qqq !== undefined && (
                            <div className="opacity-60">QQQ: {formatPctReturn(point.qqq)}</div>
                          )}
                        </div>
                      )}
                      <div className="opacity-70 mt-1">
                        {formatTooltipDate(point.date)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Benchmark lines - rendered first so they appear behind */}
            {hasBenchmarkData && (
              <>
                <Line
                  type="monotone"
                  dataKey="spy"
                  stroke="#9CA3AF"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={false}
                  name="SPY"
                />
                <Line
                  type="monotone"
                  dataKey="qqq"
                  stroke="#D1D5DB"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={false}
                  name="QQQ"
                />
              </>
            )}
            {/* Main data line */}
            <Line
              type="monotone"
              dataKey={usePercentageYAxis ? 'pctReturn' : 'value'}
              stroke={hostColor}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: hostColor,
                stroke: '#fff',
                strokeWidth: 3,
              }}
              name={ticker}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Benchmark legend */}
      {hasBenchmarkData && (
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: hostColor }} />
            <span>{ticker}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded bg-gray-400" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9CA3AF, #9CA3AF 4px, transparent 4px, transparent 8px)' }} />
            <span>SPY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #D1D5DB, #D1D5DB 4px, transparent 4px, transparent 8px)' }} />
            <span>QQQ</span>
          </div>
        </div>
      )}
    </div>
  );
}
