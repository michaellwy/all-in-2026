// Vercel Serverless Function for IPO data proxy
// Uses NASDAQ's public IPO calendar API, which returns every priced US IPO
// (NYSE, NASDAQ, etc.) for a given month with deal size baked in. We fetch
// every month of 2026 YTD in parallel and aggregate.

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface IPOEntry {
  symbol: string;
  name: string;
  ipoDate: string;
  dealSize: string;
}

interface NasdaqPricedRow {
  proposedTickerSymbol?: string;
  companyName?: string;
  pricedDate?: string;
  dollarValueOfSharesOffered?: string;
}

function formatDealSize(raw: string | undefined): string {
  if (!raw) return 'N/A';
  // "$150,000,000" -> 150000000
  const value = parseFloat(raw.replace(/[$,]/g, ''));
  if (!isFinite(value) || value <= 0) return 'N/A';
  const millions = value / 1_000_000;
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  if (millions >= 10) return `$${millions.toFixed(0)}M`;
  return `$${millions.toFixed(1)}M`;
}

function formatIpoDate(raw: string | undefined): string {
  // NASDAQ returns M/D/YYYY. Convert to "Mon D, YYYY" to match prior shape.
  if (!raw) return '';
  const [m, d, y] = raw.split('/').map((n) => parseInt(n, 10));
  if (!m || !d || !y) return raw;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

async function fetchMonth(yyyyMm: string): Promise<NasdaqPricedRow[]> {
  const url = `https://api.nasdaq.com/api/ipo/calendar?date=${yyyyMm}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      Accept: 'application/json',
    },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: { priced?: { rows?: NasdaqPricedRow[] | null } };
  };
  return json.data?.priced?.rows ?? [];
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const now = new Date();
    const currentMonth = now.getUTCFullYear() === 2026 ? now.getUTCMonth() + 1 : 12;
    const months: string[] = [];
    for (let m = 1; m <= currentMonth; m++) {
      months.push(`2026-${String(m).padStart(2, '0')}`);
    }

    const monthResults = await Promise.all(months.map(fetchMonth));
    const allRows = monthResults.flat();

    const ipos: IPOEntry[] = allRows
      .filter((r) => r.proposedTickerSymbol && r.pricedDate?.endsWith('/2026'))
      .map((r) => ({
        symbol: (r.proposedTickerSymbol || '').trim(),
        name: (r.companyName || '').trim(),
        ipoDate: formatIpoDate(r.pricedDate),
        dealSize: formatDealSize(r.dollarValueOfSharesOffered),
      }))
      // Newest first
      .sort((a, b) => +new Date(b.ipoDate) - +new Date(a.ipoDate));

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    return res.status(200).json(ipos);
  } catch (error) {
    console.error('IPO fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch IPO data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
