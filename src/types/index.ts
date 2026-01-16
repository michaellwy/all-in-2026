export type HostId = 'friedberg' | 'chamath' | 'sacks' | 'jason';

export type ProxyType = 'stock' | 'etf' | 'fred' | 'polymarket' | 'news';

export type Timeframe = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL';

export type PolymarketTimeframe = '1H' | '6H' | '1D' | '1W' | '1M' | 'MAX';

export interface Host {
  id: HostId;
  name: string;
  color: string;
}

export interface Category {
  id: string;
  title: string;
  timestamp: string;
}

export interface ProxyBaseline {
  value: number;
  date: string;
  label?: string;
}

export interface Proxy {
  id: string;
  name: string;
  type: ProxyType;
  ticker?: string;
  fredSeries?: string;
  fredTransform?: string;
  polymarketSlug?: string;
  polymarketTitle?: string;
  polymarketUrl?: string;
  newsQuery?: string;
  unit?: string;
  baseline: ProxyBaseline;
  description?: string;
}

export interface Prediction {
  id: string;
  hostId: HostId;
  categoryId: string;
  prediction: string;
  rationale: string;
  proxies: Proxy[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
