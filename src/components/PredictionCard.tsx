import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prediction, Proxy } from '@/types';
import { hosts, hostAvatars } from '@/data/hosts';
import { ProxyChart } from './ProxyChart';
import { PolymarketChart } from './PolymarketChart';
import { FredChart } from './FredChart';
import { NewsHeadlines } from './NewsHeadlines';
import { ChartSkeleton } from './ChartSkeleton';
import { IPOList } from './IPOList';

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const host = hosts[prediction.hostId];
  const hasProxies = prediction.proxies.length > 0;
  const hasTrackableProxies = prediction.proxies.some(
    (p) => p.type === 'stock' || p.type === 'etf' || p.type === 'polymarket' || p.type === 'news' || p.type === 'fred'
  );

  // Special case for IPO Market prediction
  const isIPOMarketPrediction = prediction.id === 'sacks-business-winner';
  const hasCustomDisplay = isIPOMarketPrediction;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="card overflow-hidden">
      {/* Main clickable area */}
      <div
        className="p-3 sm:p-4 cursor-pointer"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="flex items-start gap-3">
          {/* Host avatar */}
          <div
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 bg-white overflow-hidden"
            style={{ borderColor: host.color }}
          >
            <img
              src={hostAvatars[prediction.hostId]}
              alt={host.name}
              className="w-full h-full object-cover scale-150"
              style={{ objectPosition: 'center 25%' }}
            />
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            {/* Host name + Prediction on same line */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-block text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: host.color, color: 'white' }}
              >
                {host.name}
              </span>
              <h3 className="text-base sm:text-lg font-bold leading-snug text-[var(--color-text)]">
                {prediction.prediction}
              </h3>
            </div>

            {/* Expand hint */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--color-text-muted)]">
                {isExpanded ? 'Tap to close' : 'Tap for details'}
              </span>
              {(hasProxies || hasCustomDisplay) && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${host.color}20`,
                    color: host.color,
                  }}
                >
                  {isIPOMarketPrediction
                    ? 'IPO List'
                    : getProxyLabel(prediction.proxies)}
                </span>
              )}
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[var(--color-text-muted)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-2 border-t-2 border-dashed border-[var(--color-border)]">
              {/* Rationale quote */}
              <div
                className="p-4 rounded-xl mb-5"
                style={{ backgroundColor: `${host.color}10` }}
              >
                <p className="text-[var(--color-text-secondary)] italic leading-relaxed">
                  "{prediction.rationale}"
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 bg-white overflow-hidden"
                    style={{ borderColor: host.color }}
                  >
                    <img
                      src={hostAvatars[prediction.hostId]}
                      alt={host.name}
                      className="w-full h-full object-cover scale-150"
                      style={{ objectPosition: 'center 25%' }}
                    />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: host.color }}>
                    — {host.name}
                  </span>
                </div>
              </div>

              {/* Custom IPO List for IPO Market prediction */}
              {isIPOMarketPrediction && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wide text-[var(--color-text-muted)]">
                    2026 IPO Activity
                  </h4>
                  <div className="chart-box p-4">
                    <IPOList hostColor={host.color} />
                  </div>
                </div>
              )}

              {/* Charts section */}
              {hasProxies && !isIPOMarketPrediction && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-wide text-[var(--color-text-muted)]">
                    Tracking Data
                  </h4>

                  <div className="grid gap-4">
                    {prediction.proxies.map((proxy) => (
                      <div
                        key={proxy.id}
                        className="chart-box p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            {proxy.type === 'fred' && proxy.fredSeries ? (
                              <a
                                href={`https://fred.stlouisfed.org/series/${proxy.fredSeries}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[var(--color-text)] hover:text-[var(--color-accent)] hover:underline"
                              >
                                {proxy.name} ↗
                              </a>
                            ) : proxy.type === 'polymarket' && proxy.polymarketUrl ? (
                              <a
                                href={proxy.polymarketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[var(--color-text)] hover:text-[var(--color-accent)] hover:underline"
                              >
                                {proxy.polymarketTitle || proxy.name} ↗
                              </a>
                            ) : (
                              <h5 className="font-bold text-[var(--color-text)]">
                                {proxy.name}
                              </h5>
                            )}
                            {proxy.description && (
                              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {proxy.description}
                              </p>
                            )}
                          </div>
                          <ProxyTypeBadge type={proxy.type} />
                        </div>

                        {proxy.type === 'fred' && proxy.fredSeries ? (
                          <FredChart proxy={proxy} hostColor={host.color} />
                        ) : proxy.type === 'polymarket' ? (
                          <PolymarketChart proxy={proxy} hostColor={host.color} />
                        ) : proxy.type === 'news' && proxy.newsQuery ? (
                          <NewsHeadlines
                            query={proxy.newsQuery}
                            hostColor={host.color}
                          />
                        ) : hasTrackableProxies ? (
                          <ProxyChart proxy={proxy} hostColor={host.color} />
                        ) : (
                          <ChartSkeleton />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getProxyLabel(proxies: Proxy[]): string {
  const chartCount = proxies.filter((p) => p.type !== 'news').length;
  const newsCount = proxies.filter((p) => p.type === 'news').length;

  const parts: string[] = [];
  if (chartCount > 0) {
    parts.push(`${chartCount} chart${chartCount !== 1 ? 's' : ''}`);
  }
  if (newsCount > 0) {
    parts.push('News');
  }
  return parts.join(' + ') || '';
}

function ProxyTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    stock: { label: 'Stock', bg: '#3B82F620', text: '#3B82F6' },
    etf: { label: 'ETF', bg: '#8B5CF620', text: '#8B5CF6' },
    fred: { label: 'Economic', bg: '#10B98120', text: '#10B981' },
    polymarket: { label: 'Polymarket', bg: '#F59E0B20', text: '#F59E0B' },
    news: { label: 'News', bg: '#EC489920', text: '#EC4899' },
  };

  const { label, bg, text } = config[type] || {
    label: type,
    bg: '#6B728020',
    text: '#6B7280',
  };

  return (
    <span
      className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}
