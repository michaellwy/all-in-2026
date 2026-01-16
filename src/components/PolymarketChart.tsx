import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Proxy, PolymarketTimeframe } from '@/types';
import { usePolymarketData } from '@/hooks/usePolymarketData';
import { PolymarketTimeframeSelector } from './TimeframeSelector';
import { ChartSkeleton } from './ChartSkeleton';

interface PolymarketChartProps {
  proxy: Proxy;
  hostColor: string;
}

export function PolymarketChart({ proxy, hostColor }: PolymarketChartProps) {
  const [timeframe, setTimeframe] = useState<PolymarketTimeframe>('1M');
  const slug = proxy.polymarketSlug || '';
  const { data, isLoading, error } = usePolymarketData(slug, timeframe);

  const formatValue = (value: number) => {
    return `${value.toFixed(0)}%`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    // Different formatting based on timeframe
    if (timeframe === '1H' || timeframe === '6H') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    if (timeframe === '1D') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    if (timeframe === '1W') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    // For 1M and MAX, include year
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  const formatTooltipDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (timeframe === '1H' || timeframe === '6H' || timeframe === '1D') {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!slug) {
    return (
      <div className="h-48 bg-[var(--color-bg)] rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center">
        <p className="text-sm text-[var(--color-text-muted)] font-medium">
          No market data available
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-4">
          <PolymarketTimeframeSelector
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
      <div onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-4">
          <PolymarketTimeframeSelector
            selected={timeframe}
            onChange={setTimeframe}
            hostColor={hostColor}
          />
        </div>
        <div className="h-48 bg-[var(--color-bg)] rounded-lg border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center">
          <p className="text-sm text-[var(--color-text-muted)] font-medium">
            Unable to load market data
          </p>
        </div>
      </div>
    );
  }

  const currentValue = data[data.length - 1]?.value;

  // Calculate Y-axis domain with some padding
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = Math.max((maxValue - minValue) * 0.1, 5);
  const yMin = Math.max(0, Math.floor(minValue - padding));
  const yMax = Math.min(100, Math.ceil(maxValue + padding));

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-2xl text-[var(--color-text)]">
          {formatValue(currentValue)}
        </span>
        <PolymarketTimeframeSelector
          selected={timeframe}
          onChange={setTimeframe}
          hostColor={hostColor}
        />
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: '#8C8C8C', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              minTickGap={50}
            />
            <YAxis
              domain={[yMin, yMax]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#8C8C8C', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload;
                  return (
                    <div className="bg-[var(--color-text)] text-white text-xs rounded-lg px-3 py-2 shadow-lg border-2 border-[var(--color-text)]">
                      <div className="font-bold">{formatValue(point.value)}</div>
                      <div className="opacity-70 mt-0.5">
                        {formatTooltipDate(point.date)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={hostColor}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: hostColor,
                stroke: '#fff',
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Link to Polymarket */}
      {proxy.polymarketUrl && (
        <div className="mt-2 flex justify-end">
          <a
            href={proxy.polymarketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-accent)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View on Polymarket
          </a>
        </div>
      )}
    </div>
  );
}
