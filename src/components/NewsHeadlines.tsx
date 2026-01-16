import { useQuery } from '@tanstack/react-query';

interface NewsHeadlinesProps {
  query: string;
  hostColor: string;
  maxItems?: number;
}

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

async function fetchNews(query: string): Promise<NewsItem[]> {
  const response = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to fetch news');

  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');

  const items = xml.querySelectorAll('item');
  const news: NewsItem[] = [];

  items.forEach((item) => {
    const titleEl = item.querySelector('title');
    const linkEl = item.querySelector('link');
    const pubDateEl = item.querySelector('pubDate');

    if (titleEl && linkEl) {
      const fullTitle = titleEl.textContent || '';
      // Google News format: "Title - Source"
      const lastDash = fullTitle.lastIndexOf(' - ');
      const title = lastDash > 0 ? fullTitle.slice(0, lastDash) : fullTitle;
      const source = lastDash > 0 ? fullTitle.slice(lastDash + 3) : '';

      news.push({
        title,
        link: linkEl.textContent || '',
        pubDate: pubDateEl?.textContent || '',
        source,
      });
    }
  });

  return news;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NewsHeadlines({ query, hostColor, maxItems = 5 }: NewsHeadlinesProps) {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', query],
    queryFn: () => fetchNews(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-[var(--color-border)] rounded w-full mb-1" />
            <div className="h-3 bg-[var(--color-border)] rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !news?.length) {
    return (
      <div className="py-4 text-center text-sm text-[var(--color-text-muted)]">
        No recent news found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {news.slice(0, maxItems).map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="flex gap-2">
            <span
              className="flex-shrink-0 w-1 rounded-full"
              style={{ backgroundColor: hostColor }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] line-clamp-2 leading-snug">
                {item.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-muted)]">
                <span>{item.source}</span>
                <span>·</span>
                <span>{formatDate(item.pubDate)}</span>
              </div>
            </div>
          </div>
        </a>
      ))}
      <p className="text-[10px] text-[var(--color-text-muted)] text-right pt-1">
        via Google News
      </p>
    </div>
  );
}
