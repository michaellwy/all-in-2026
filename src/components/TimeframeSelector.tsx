import type { Timeframe, PolymarketTimeframe } from '@/types';

interface TimeframeSelectorProps {
  selected: Timeframe;
  onChange: (timeframe: Timeframe) => void;
  hostColor: string;
}

interface PolymarketTimeframeSelectorProps {
  selected: PolymarketTimeframe;
  onChange: (timeframe: PolymarketTimeframe) => void;
  hostColor: string;
}

const timeframes: Timeframe[] = ['1M', '3M', '6M', 'YTD', '1Y', 'ALL'];
const polymarketTimeframes: PolymarketTimeframe[] = ['1H', '6H', '1D', '1W', '1M', 'MAX'];

export function TimeframeSelector({
  selected,
  onChange,
  hostColor,
}: TimeframeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-[var(--color-bg)] rounded-full border-2 border-[var(--color-border)] w-fit">
      {timeframes.map((tf) => (
        <button
          key={tf}
          onClick={(e) => {
            e.stopPropagation();
            onChange(tf);
          }}
          className={`
            px-2.5 py-1 text-xs font-bold rounded-full transition-all
            ${
              selected === tf
                ? 'text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]'
            }
          `}
          style={{
            backgroundColor: selected === tf ? hostColor : undefined,
          }}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}

export function PolymarketTimeframeSelector({
  selected,
  onChange,
  hostColor,
}: PolymarketTimeframeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-[var(--color-bg)] rounded-full border-2 border-[var(--color-border)] w-fit">
      {polymarketTimeframes.map((tf) => (
        <button
          key={tf}
          onClick={(e) => {
            e.stopPropagation();
            onChange(tf);
          }}
          className={`
            px-2 py-1 text-xs font-bold rounded-full transition-all
            ${
              selected === tf
                ? 'text-white shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-alt)]'
            }
          `}
          style={{
            backgroundColor: selected === tf ? hostColor : undefined,
          }}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
