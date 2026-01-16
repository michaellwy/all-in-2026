import { useIPOData } from '@/hooks/useIPOData';

interface IPOListProps {
  hostColor: string;
}

// Parse deal size string like "$318M" or "$1.2B" to number in millions
function parseDealSize(dealSize: string): number {
  if (dealSize === 'N/A') return 0;
  const match = dealSize.match(/\$?([\d.]+)([MB])/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return unit === 'B' ? value * 1000 : value;
}

// Format total in millions/billions
function formatTotalDealSize(totalMillions: number): string {
  if (totalMillions >= 1000) {
    return `$${(totalMillions / 1000).toFixed(1)}B`;
  }
  return `$${totalMillions.toFixed(0)}M`;
}

export function IPOList({ hostColor }: IPOListProps) {
  const { data: ipos, isLoading, error } = useIPOData();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !ipos || ipos.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-[var(--color-text-muted)]">
          Unable to load IPO data
        </p>
        <a
          href="https://stockanalysis.com/ipos/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--color-accent)] hover:underline mt-2 inline-block"
        >
          View on Stock Analysis →
        </a>
      </div>
    );
  }

  // Calculate total deal size
  const totalDealSize = ipos.reduce((sum, ipo) => sum + parseDealSize(ipo.dealSize), 0);
  const hasMoreThanSix = ipos.length > 6;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl text-[var(--color-text)]">
            {ipos.length}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            IPOs in 2026
          </span>
          {totalDealSize > 0 && (
            <>
              <span className="text-[var(--color-text-muted)]">·</span>
              <span className="text-sm font-semibold" style={{ color: hostColor }}>
                {formatTotalDealSize(totalDealSize)}
              </span>
              <span className="text-sm text-[var(--color-text-muted)]">
                raised
              </span>
            </>
          )}
        </div>
        <a
          href="https://stockanalysis.com/ipos/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--color-accent)] hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-bg-alt)] border-b-2 border-[var(--color-border)]">
              <th className="text-left py-2 px-3 font-bold text-[var(--color-text)]">
                Symbol
              </th>
              <th className="text-left py-2 px-3 font-bold text-[var(--color-text)] hidden sm:table-cell">
                Date
              </th>
              <th className="text-right py-2 px-3 font-bold text-[var(--color-text)]">
                Deal Size
              </th>
            </tr>
          </thead>
        </table>
        <div className={hasMoreThanSix ? 'max-h-[264px] overflow-y-auto' : ''}>
          <table className="w-full text-sm">
            <tbody>
              {ipos.map((ipo, index) => (
                <tr
                  key={ipo.symbol}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-[var(--color-bg)]'
                  } hover:bg-[var(--color-bg-alt)] transition-colors`}
                >
                  <td className="py-2 px-3">
                    <div>
                      <a
                        href={`https://stockanalysis.com/stocks/${ipo.symbol.toLowerCase()}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold hover:underline"
                        style={{ color: hostColor }}
                      >
                        {ipo.symbol}
                      </a>
                      <div className="text-xs text-[var(--color-text-muted)] truncate max-w-[150px] sm:max-w-[200px]">
                        {ipo.name}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[var(--color-text-muted)] hidden sm:table-cell">
                    {ipo.ipoDate}
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-[var(--color-text)]">
                    {ipo.dealSize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mt-3 text-center">
        Data from{' '}
        <a
          href="https://stockanalysis.com/ipos/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent)] hover:underline"
        >
          stockanalysis.com
        </a>
      </p>
    </div>
  );
}
