import type {
  CryptoAsset,
  OHLCData,
  MarketOverview,
  NewsArticle,
} from "@/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const BINANCE_BASE = "https://api.binance.com/api/v3";

// ── Crypto (CoinGecko) ──────────────────────────────────────────────

export async function fetchCryptoMarkets(
  page = 1,
  perPage = 50,
): Promise<CryptoAsset[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`,
    { next: { revalidate: 30 } },
  );
  if (!res.ok) throw new Error("Failed to fetch crypto markets");
  return res.json();
}

export async function fetchCryptoDetail(id: string) {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
    { next: { revalidate: 30 } },
  );
  if (!res.ok) throw new Error(`Failed to fetch crypto detail: ${id}`);
  return res.json();
}

export async function fetchCryptoChart(
  id: string,
  days: number | string = 7,
): Promise<OHLCData[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) throw new Error("Failed to fetch OHLC data");
  const data: number[][] = await res.json();
  return data.map(([time, open, high, low, close]) => ({
    time: Math.floor(time / 1000),
    open,
    high,
    low,
    close,
  }));
}

export async function fetchGlobalData(): Promise<MarketOverview> {
  const res = await fetch(`${COINGECKO_BASE}/global`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch global data");
  const json = await res.json();
  const d = json.data;
  return {
    totalMarketCap: d.total_market_cap.usd,
    totalVolume: d.total_volume.usd,
    btcDominance: d.market_cap_percentage.btc,
    marketCapChange24h: d.market_cap_change_percentage_24h_usd,
    activeCryptocurrencies: d.active_cryptocurrencies,
  };
}

export async function searchCrypto(
  query: string,
): Promise<{ id: string; name: string; symbol: string; thumb: string }[]> {
  const res = await fetch(`${COINGECKO_BASE}/search?query=${query}`);
  if (!res.ok) return [];
  const json = await res.json();
  return json.coins?.slice(0, 10) ?? [];
}

export async function fetchTrendingCrypto(): Promise<CryptoAsset[]> {
  const res = await fetch(`${COINGECKO_BASE}/search/trending`, {
    next: { revalidate: 120 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  const ids = json.coins
    ?.slice(0, 7)
    .map((c: { item: { id: string } }) => c.item.id)
    .join(",");
  if (!ids) return [];
  const mkts = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids}&sparkline=true&price_change_percentage=7d`,
  );
  if (!mkts.ok) return [];
  return mkts.json();
}

// ── Binance real-time ticker ────────────────────────────────────────

export async function fetchBinanceTickers(): Promise<
  {
    symbol: string;
    price: string;
    priceChangePercent: string;
    volume: string;
  }[]
> {
  const res = await fetch(`${BINANCE_BASE}/ticker/24hr`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data
    .filter(
      (t: { symbol: string }) =>
        t.symbol.endsWith("USDT") && !t.symbol.includes("DOWN"),
    )
    .slice(0, 100);
}

export async function fetchBinanceKlines(
  symbol: string,
  interval = "1h",
  limit = 200,
): Promise<OHLCData[]> {
  const res = await fetch(
    `${BINANCE_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  );
  if (!res.ok) return [];
  const data: number[][] = await res.json();
  return data.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: parseFloat(String(k[1])),
    high: parseFloat(String(k[2])),
    low: parseFloat(String(k[3])),
    close: parseFloat(String(k[4])),
    volume: parseFloat(String(k[5])),
  }));
}

// ── Stocks (Yahoo Finance via public query API) ─────────────────────

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance";

export async function fetchStockQuotes(symbols: string[]) {
  try {
    const res = await fetch(
      `${YF_BASE}/spark?symbols=${symbols.join(",")}&range=1d&interval=5m`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Popular stocks for the dashboard
export const POPULAR_STOCKS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
  "AMD",
  "JPM",
  "V",
  "DIS",
  "BA",
  "PYPL",
  "INTC",
  "CRM",
  "UBER",
  "SQ",
  "COIN",
  "PLTR",
];

// ── News (CryptoPanic free API + Google News RSS) ───────────────────

export async function fetchCryptoNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular",
      { next: { revalidate: 120 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.Data || []).slice(0, 30).map(
      (a: {
        title: string;
        body: string;
        url: string;
        source: string;
        published_on: number;
        imageurl: string;
      }) => ({
        title: a.title,
        description: a.body?.slice(0, 200),
        url: a.url,
        source: a.source,
        publishedAt: new Date(a.published_on * 1000).toISOString(),
        imageUrl: a.imageurl,
      }),
    );
  } catch {
    return [];
  }
}

// ── Forex (exchangerate.host free API) ──────────────────────────────

export async function fetchForexRates(): Promise<
  { pair: string; rate: number }[]
> {
  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,JPY,CHF,CAD,AUD,NZD,CNY",
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const rates = json.rates || {};
    return Object.entries(rates).map(([currency, rate]) => ({
      pair: `USD/${currency}`,
      rate: rate as number,
    }));
  } catch {
    return [];
  }
}

// ── Formatting helpers ──────────────────────────────────────────────

export function formatCurrency(
  value: number,
  compact = false,
  decimals?: number,
): string {
  if (compact) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  }
  const d = decimals ?? (value < 1 ? 6 : value < 100 ? 4 : 2);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
