import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api/stock': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (pathStr) => {
          const url = new URL(pathStr, 'http://localhost');
          const ticker = url.searchParams.get('ticker');
          const period = url.searchParams.get('period') || 'ytd';
          const interval = period === '2y' ? '1wk' : '1d';
          return `/v8/finance/chart/${ticker}?range=${period}&interval=${interval}`;
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
          });
        },
      },
      '/api/polymarket/gamma': {
        target: 'https://gamma-api.polymarket.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/polymarket\/gamma/, ''),
      },
      '/api/polymarket/clob': {
        target: 'https://clob.polymarket.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/polymarket\/clob/, ''),
      },
      '/api/news': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const query = url.searchParams.get('q') || '';
          return `/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
        },
      },
      '/api/fred': {
        target: 'https://fred.stlouisfed.org',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const series = url.searchParams.get('series') || '';
          const transform = url.searchParams.get('transform') || '';
          const transformParam = transform ? `&transformation=${transform}` : '';
          return `/graph/fredgraph.csv?id=${series}${transformParam}`;
        },
      },
    },
  },
})
