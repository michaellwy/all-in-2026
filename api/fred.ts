// Vercel Serverless Function for FRED data proxy
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { series, transform } = req.query;

  if (!series || typeof series !== 'string') {
    return res.status(400).json({ error: 'Series ID is required' });
  }

  try {
    // FRED public CSV endpoint (no API key required)
    const transformParam = transform ? `&transformation=${transform}` : '';
    const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${series}${transformParam}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }

    const csvData = await response.text();

    // Set cache headers (FRED data updates less frequently)
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/csv');

    return res.status(200).send(csvData);
  } catch (error) {
    console.error('FRED error:', error);
    return res.status(500).json({
      error: 'Failed to fetch FRED data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
