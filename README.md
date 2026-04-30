# DAVTrading

Professional real-time trading dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Live Dashboard** — Market overview with total market cap, volume, BTC dominance, top gainers/losers, and trending coins
- **Markets** — Browse 250+ cryptocurrencies with live prices, 24h/7d changes, market cap, volume, and sparkline charts
- **Asset Details** — Deep-dive pages with interactive candlestick charts (1D/7D/1M/3M/1Y), market stats, descriptions, and external links
- **Real-Time Prices** — WebSocket connection to Binance for sub-second price updates with flash animations
- **Watchlist** — Star any asset to track it; persisted in localStorage
- **Portfolio** — Add holdings with quantity and buy price; real-time P&L tracking with allocation visualization
- **News** — Live financial news feed from CryptoCompare, updated every 2 minutes
- **Search** — Instant search across all cryptocurrencies via CoinGecko
- **Responsive** — Works on mobile, tablet, and desktop

## Data Sources (all free, no API keys required)

| Source | Data |
|--------|------|
| [CoinGecko](https://www.coingecko.com/) | Crypto prices, market data, OHLC charts, search, trending, global stats |
| [Binance](https://www.binance.com/) | Real-time WebSocket price streams, kline/candlestick data |
| [CryptoCompare](https://www.cryptocompare.com/) | Financial news feed |

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: [Lightweight Charts](https://github.com/nickvdyck/lightweight-charts) (TradingView)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: SWR + native fetch with auto-refresh

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar + header
│   ├── page.tsx            # Dashboard
│   ├── markets/
│   │   ├── page.tsx        # Markets list
│   │   └── [type]/[id]/
│   │       └── page.tsx    # Asset detail
│   ├── watchlist/page.tsx  # Watchlist
│   ├── portfolio/page.tsx  # Portfolio tracker
│   └── news/page.tsx       # News feed
├── components/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── PriceChart.tsx      # Candlestick chart
│   ├── SparklineChart.tsx  # Mini sparkline
│   ├── CryptoTable.tsx
│   ├── MarketOverviewCards.tsx
│   ├── TopMovers.tsx
│   ├── TrendingCoins.tsx
│   ├── NewsFeed.tsx
│   ├── LivePrice.tsx       # WebSocket live price
│   ├── WatchlistButton.tsx
│   └── AddToPortfolioModal.tsx
├── lib/
│   ├── api.ts              # All API functions
│   └── storage.ts          # localStorage helpers
├── hooks/
│   └── useLocalStorage.ts
└── types/
    └── index.ts
```
