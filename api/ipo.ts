// Vercel Serverless Function for IPO data proxy
// Fetches IPO data from stockanalysis.com (no CORS issues server-side)

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface IPOEntry {
  symbol: string;
  name: string;
  ipoDate: string;
  dealSize: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const url = 'https://stockanalysis.com/ipos/';

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch IPO page: ${response.status}`);
    }

    const html = await response.text();
    const ipos: IPOEntry[] = [];

    // Try to extract data from embedded JSON first
    const dataMatch = html.match(/"data":\s*(\[\{[^\]]+\}\])/);

    if (dataMatch) {
      try {
        const rawData = JSON.parse(dataMatch[1]);

        // Filter for 2026 IPOs
        const ipos2026 = rawData
          .filter((item: { d?: string }) => item.d && item.d.includes('2026'))
          .slice(0, 15);

        // Fetch deal size for each IPO
        const iposWithDealSize = await Promise.all(
          ipos2026.map(async (item: { s?: string; n?: string; d?: string }) => {
            const symbol = item.s || '';
            const dealSize = await fetchDealSize(symbol);
            return {
              symbol,
              name: item.n || '',
              ipoDate: item.d || '',
              dealSize,
            };
          })
        );

        if (iposWithDealSize.length > 0) {
          res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
          return res.status(200).json(iposWithDealSize);
        }
      } catch {
        console.log('Failed to parse embedded JSON, trying HTML table');
      }
    }

    // Fallback: parse HTML table
    const tableRows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);

    if (tableRows && tableRows.length > 1) {
      for (const row of tableRows.slice(1, 16)) {
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);

        if (cells && cells.length >= 3) {
          const getText = (cell: string) => cell.replace(/<[^>]+>/g, '').trim();
          const dateText = getText(cells[0]);

          if (dateText.includes('2026')) {
            const symbolMatch = cells[1].match(/>([A-Z]+)</);
            const symbol = symbolMatch ? symbolMatch[1] : getText(cells[1]);

            ipos.push({
              symbol,
              name: getText(cells[2]),
              ipoDate: dateText,
              dealSize: 'N/A',
            });
          }
        }
      }

      if (ipos.length > 0) {
        const iposWithDealSize = await Promise.all(
          ipos.map(async (ipo) => ({
            ...ipo,
            dealSize: await fetchDealSize(ipo.symbol),
          }))
        );

        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
        return res.status(200).json(iposWithDealSize);
      }
    }

    return res.status(200).json([]);
  } catch (error) {
    console.error('IPO fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch IPO data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function fetchDealSize(symbol: string): Promise<string> {
  try {
    const url = `https://stockanalysis.com/stocks/${symbol.toLowerCase()}/`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return 'N/A';
    }

    const html = await response.text();

    const dealSizePatterns = [
      /raising (?:about )?\$?([\d,.]+)\s*(?:million|M)/i,
      /deal size[:\s]+\$?([\d,.]+)\s*(?:million|M)/i,
      /\$?([\d,.]+)\s*(?:million|M)\s*(?:IPO|offering)/i,
      /IPO[^$]*\$?([\d,.]+)\s*(?:million|M)/i,
    ];

    for (const pattern of dealSizePatterns) {
      const match = html.match(pattern);
      if (match) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (value > 0) {
          if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}B`;
          }
          return `$${value.toFixed(0)}M`;
        }
      }
    }

    return 'N/A';
  } catch {
    return 'N/A';
  }
}
