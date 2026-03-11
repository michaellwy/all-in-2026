// Vercel Serverless Function: proxies Polymarket CLOB price history
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { market, interval, fidelity } = req.query;

  if (!market || typeof market !== 'string') {
    return res.status(400).json({ error: 'market (conditionId) is required' });
  }

  try {
    const params = new URLSearchParams({ market });
    if (interval && typeof interval === 'string') params.set('interval', interval);
    if (fidelity && typeof fidelity === 'string') params.set('fidelity', fidelity);

    const url = `https://clob.polymarket.com/prices-history?${params}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'CLOB API error' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Polymarket history error:', error);
    return res.status(500).json({ error: 'Failed to fetch price history' });
  }
}
