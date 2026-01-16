// Vercel Serverless Function for Google News RSS proxy
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Google News error: ${response.status}`);
    }

    const xmlData = await response.text();

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Content-Type', 'application/xml');

    return res.status(200).send(xmlData);
  } catch (error) {
    console.error('News error:', error);
    return res.status(500).json({
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
