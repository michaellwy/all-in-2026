// Vercel Serverless Function: proxies Polymarket Gamma API (market lookup)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'slug is required' });
  }

  try {
    const url = `https://gamma-api.polymarket.com/markets?slug=${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Gamma API error' });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Polymarket market error:', error);
    return res.status(500).json({ error: 'Failed to fetch market data' });
  }
}
