import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { Proxy } from '@/types';

interface FredChartProps {
  proxy: Proxy;
  hostColor: string;
}

type Timeframe = '1Y' | '5Y' | '10Y' | 'ALL';

const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: '1Y', label: '1Y' },
  { key: '5Y', label: '5Y' },
  { key: '10Y', label: '10Y' },
  { key: 'ALL', label: 'ALL' },
];

interface DataPoint {
  date: string;
  value: number;
  displayDate: string;
}

async function fetchFredData(series: string, transform?: string): Promise<DataPoint[]> {
  const transformParam = transform ? `&transform=${transform}` : '';
  const response = await fetch(`/api/fred?series=${series}${transformParam}`);
  if (!response.ok) throw new Error('Failed to fetch FRED data');

  const text = await response.text();
  const lines = text.trim().split('\n');

  // Skip header row
  const data: DataPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [date, valueStr] = lines[i].split(',');
    const value = parseFloat(valueStr);
    if (!isNaN(value) && date) {
      data.push({
        date,
        value,
        displayDate: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      });
    }
  }

  return data;
}

function filterByTimeframe(data: DataPoint[], timeframe: Timeframe): DataPoint[] {
  if (timeframe === 'ALL') return data;

  const now = new Date();
  const years = timeframe === '1Y' ? 1 : timeframe === '5Y' ? 5 : 10;
  const cutoff = new Date(now.getFullYear() - years, now.getMonth(), 1);

  return data.filter((d) => new Date(d.date) >= cutoff);
}

export function FredChart({ proxy, hostColor }: FredChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('5Y');

  const { data: allData, isLoading, error } = useQuery({
    queryKey: ['fred', proxy.fredSeries, proxy.fredTransform],
    queryFn: () => fetchFredData(proxy.fredSeries!, proxy.fredTransform),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!proxy.fredSeries,
  });

  if (isLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${hostColor} transparent ${hostColor} ${hostColor}` }}
        />
      </div>
    );
  }

  if (error || !allData?.length) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-[var(--color-text-muted)]">
        Failed to load FRED data
      </div>
    );
  }

  const chartData = filterByTimeframe(allData, timeframe);
  const latestPoint = chartData[chartData.length - 1];
  const latestValue = latestPoint?.value;
  const latestDate = latestPoint?.displayDate;

  // Calculate min/max for Y axis with padding
  const values = chartData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.1;

  return (
    <div>
      {/* Timeframe toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex gap-1 flex-wrap">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              className="px-2 py-0.5 text-[11px] sm:text-xs font-bold rounded-full transition-all"
              style={{
                backgroundColor: timeframe === tf.key ? hostColor : 'transparent',
                color: timeframe === tf.key ? 'white' : hostColor,
                border: `2px solid ${hostColor}`,
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: hostColor }}>
            {latestValue?.toFixed(1)}{proxy.unit || ''}
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            {latestDate}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[180px] overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -5 }}>
            <defs>
              <linearGradient id={`gradient-${proxy.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hostColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={hostColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              tickFormatter={(val) => {
                // Show year for longer timeframes
                if (timeframe === 'ALL' || timeframe === '10Y') {
                  const year = val.split(' ')[1];
                  return year;
                }
                return val;
              }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={[minVal - padding, maxVal + padding]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              tickFormatter={(val) => val.toFixed(0)}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: `2px solid ${hostColor}`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [value.toFixed(2), 'Value']}
              labelFormatter={(label) => label}
            />
            {proxy.baseline.value > 0 && (
              <ReferenceLine
                y={proxy.baseline.value}
                stroke={hostColor}
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              stroke={hostColor}
              strokeWidth={2}
              fill={`url(#gradient-${proxy.id})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-2 text-[10px] text-[var(--color-text-muted)]">
        <span>
          {chartData[0]?.displayDate} - {chartData[chartData.length - 1]?.displayDate}
        </span>
        <span>Data from FRED</span>
      </div>
    </div>
  );
}
