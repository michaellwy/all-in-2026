// Vercel Serverless Function for FRED data proxy
// Uses the official FRED JSON API (https://api.stlouisfed.org). Requires
// FRED_API_KEY set in Vercel env vars. Get a free key at:
// https://fred.stlouisfed.org/docs/api/api_key.html
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { series, transform } = req.query;

  if (!series || typeof series !== 'string') {
    return res.status(400).json({ error: 'Series ID is required' });
  }

  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'FRED_API_KEY not configured' });
  }

  try {
    const params = new URLSearchParams({
      series_id: series,
      api_key: apiKey,
      file_type: 'json',
    });
    if (transform && typeof transform === 'string') {
      // FRED official API uses `units` (e.g. pc1 = year-over-year % change)
      params.set('units', transform);
    }

    const url = `https://api.stlouisfed.org/fred/series/observations?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`FRED API ${response.status}: ${body.slice(0, 200)}`);
    }

    const json = (await response.json()) as {
      observations: Array<{ date: string; value: string }>;
    };

    // Emit CSV so the existing client parser keeps working:
    // header row + `date,value` lines, skipping missing values ('.').
    const lines = ['observation_date,value'];
    for (const obs of json.observations) {
      if (obs.value !== '.') lines.push(`${obs.date},${obs.value}`);
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/csv');
    return res.status(200).send(lines.join('\n'));
  } catch (error) {
    console.error('FRED error:', error);
    return res.status(500).json({
      error: 'Failed to fetch FRED data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
