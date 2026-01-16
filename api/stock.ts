// Vercel Serverless Function for Yahoo Finance proxy
// Deploy to Vercel and this will be available at /api/stock

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface YahooFinanceQuote {
  date: number;
  close: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { ticker, period = 'ytd' } = req.query;

  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  try {
    // Yahoo Finance API v8 endpoint
    const range = period as string;
    const interval = getInterval(range);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=${interval}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.chart?.result?.[0]) {
      throw new Error('No data returned from Yahoo Finance');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    if (!timestamps || !closes) {
      throw new Error('Invalid data structure from Yahoo Finance');
    }

    const chartData = timestamps
      .map((ts: number, i: number) => ({
        date: new Date(ts * 1000).toISOString(),
        value: closes[i],
      }))
      .filter((point: { value: number | null }) => point.value !== null);

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json(chartData);
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    return res.status(500).json({
      error: 'Failed to fetch stock data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function getInterval(range: string): string {
  switch (range) {
    case '1mo':
      return '1d';
    case '3mo':
      return '1d';
    case '6mo':
      return '1d';
    case 'ytd':
      return '1d';
    case '1y':
      return '1d';
    case '2y':
      return '1wk';
    case '5y':
      return '1wk';
    case 'max':
      return '1mo';
    default:
      return '1d';
  }
}
