import type { Timeframe, PolymarketTimeframe } from '@/types';

export function getDateRange(timeframe: Timeframe): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (timeframe) {
    case '1M':
      start.setMonth(end.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(end.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(end.getMonth() - 6);
      break;
    case 'YTD':
      start.setMonth(0);
      start.setDate(1);
      break;
    case '1Y':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case 'ALL':
      start.setFullYear(2024);
      start.setMonth(0);
      start.setDate(1);
      break;
  }

  return { start, end };
}

export function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getYahooFinancePeriod(timeframe: Timeframe): string {
  switch (timeframe) {
    case '1M':
      return '1mo';
    case '3M':
      return '3mo';
    case '6M':
      return '6mo';
    case 'YTD':
      return 'ytd';
    case '1Y':
      return '1y';
    case 'ALL':
      return 'max'; // Full history since inception
  }
}

export function getPolymarketDateRange(timeframe: PolymarketTimeframe): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (timeframe) {
    case '1H':
      start.setHours(end.getHours() - 1);
      break;
    case '6H':
      start.setHours(end.getHours() - 6);
      break;
    case '1D':
      start.setDate(end.getDate() - 1);
      break;
    case '1W':
      start.setDate(end.getDate() - 7);
      break;
    case '1M':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'MAX':
      start.setFullYear(2024);
      start.setMonth(0);
      start.setDate(1);
      break;
  }

  return { start, end };
}

// Get the appropriate interval and fidelity for Polymarket CLOB API
export function getPolymarketApiParams(timeframe: PolymarketTimeframe): { interval: string; fidelity: number } {
  switch (timeframe) {
    case '1H':
      return { interval: '1d', fidelity: 1 }; // 1 min fidelity for hourly
    case '6H':
      return { interval: '1d', fidelity: 5 }; // 5 min fidelity for 6 hours
    case '1D':
      return { interval: '1d', fidelity: 15 }; // 15 min fidelity for daily
    case '1W':
      return { interval: '1w', fidelity: 60 }; // 1 hour fidelity for weekly
    case '1M':
      return { interval: '1m', fidelity: 360 }; // 6 hour fidelity for monthly
    case 'MAX':
      return { interval: 'max', fidelity: 1440 }; // Daily fidelity for max
  }
}
