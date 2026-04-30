export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  ath_change_percentage: number;
}

export interface StockQuote {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  addedAt: number;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  quantity: number;
  avgBuyPrice: number;
  addedAt: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface MarketOverview {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  marketCapChange24h: number;
  activeCryptocurrencies: number;
}

export interface ForexRate {
  pair: string;
  rate: number;
  change: number;
}
