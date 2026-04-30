"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import { ChartWithControls } from "@/components/PriceChart";
import WatchlistButton from "@/components/WatchlistButton";
import AddToPortfolioModal from "@/components/AddToPortfolioModal";
import LivePrice from "@/components/LivePrice";
import {
  fetchCryptoDetail,
  fetchCryptoChart,
  formatCurrency,
  formatPercent,
  formatNumber,
} from "@/lib/api";
import type { OHLCData } from "@/types";

interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    market_cap_rank: number;
    ath: { usd: number };
    ath_change_percentage: { usd: number };
    atl: { usd: number };
    atl_change_percentage: { usd: number };
  };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    subreddit_url: string;
  };
  market_cap_rank: number;
}

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const type = params.type as string;
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);

  useEffect(() => {
    if (type === "crypto") {
      fetchCryptoDetail(id)
        .then(setCoin)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, type]);

  const fetchChart = useCallback(
    async (days: string): Promise<OHLCData[]> => {
      return fetchCryptoChart(id, days);
    },
    [id],
  );

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-gray-400">Asset not found</p>
        <Link href="/markets" className="mt-4 text-brand-400 hover:underline">
          Back to Markets
        </Link>
      </div>
    );
  }

  const md = coin.market_data;
  const priceUp = md.price_change_percentage_24h >= 0;

  const stats = [
    { label: "Market Cap", value: formatCurrency(md.market_cap.usd, true) },
    { label: "24h Volume", value: formatCurrency(md.total_volume.usd, true) },
    { label: "24h High", value: formatCurrency(md.high_24h.usd) },
    { label: "24h Low", value: formatCurrency(md.low_24h.usd) },
    {
      label: "Circulating Supply",
      value: `${formatNumber(md.circulating_supply, true)} ${coin.symbol.toUpperCase()}`,
    },
    {
      label: "Total Supply",
      value: md.total_supply
        ? `${formatNumber(md.total_supply, true)} ${coin.symbol.toUpperCase()}`
        : "Unlimited",
    },
    {
      label: "Max Supply",
      value: md.max_supply
        ? `${formatNumber(md.max_supply, true)} ${coin.symbol.toUpperCase()}`
        : "N/A",
    },
    { label: "All-Time High", value: formatCurrency(md.ath.usd) },
    {
      label: "ATH Change",
      value: formatPercent(md.ath_change_percentage.usd),
    },
    { label: "All-Time Low", value: formatCurrency(md.atl.usd) },
  ];

  const priceChanges = [
    { period: "24h", value: md.price_change_percentage_24h },
    { period: "7d", value: md.price_change_percentage_7d },
    { period: "30d", value: md.price_change_percentage_30d },
    { period: "1y", value: md.price_change_percentage_1y },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/markets"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft size={14} />
        Back to Markets
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img
            src={coin.image.large}
            alt={coin.name}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400 uppercase">
                {coin.symbol}
              </span>
              <span className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                Rank #{md.market_cap_rank}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <LivePrice
                symbol={coin.symbol}
                initialPrice={md.current_price.usd}
                className="text-2xl font-bold"
              />
              <span
                className={`flex items-center gap-1 text-sm font-medium ${priceUp ? "text-gain" : "text-loss"}`}
              >
                {priceUp ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {formatPercent(md.price_change_percentage_24h)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <WatchlistButton
            id={coin.id}
            symbol={coin.symbol}
            name={coin.name}
            type="crypto"
          />
          <button
            onClick={() => setShowPortfolioModal(true)}
            className="btn-primary flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add to Portfolio
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="card-static">
        <ChartWithControls fetchData={fetchChart} defaultRange="7" />
      </div>

      {/* Price Changes */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {priceChanges.map(({ period, value }) => (
          <div key={period} className="card-static text-center">
            <div className="text-xs text-gray-500">{period}</div>
            <div
              className={`mt-1 text-lg font-bold ${value >= 0 ? "text-gain" : "text-loss"}`}
            >
              {formatPercent(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="card-static">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Market Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2"
            >
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-sm font-medium text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {coin.description.en && (
        <div className="card-static">
          <h2 className="mb-3 text-lg font-semibold text-white">
            About {coin.name}
          </h2>
          <div
            className="prose prose-sm prose-invert max-w-none text-gray-400"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split(". ").slice(0, 5).join(". ") + ".",
            }}
          />
        </div>
      )}

      {/* Links */}
      <div className="card-static">
        <h2 className="mb-3 text-lg font-semibold text-white">Links</h2>
        <div className="flex flex-wrap gap-2">
          {coin.links.homepage
            .filter((l) => l)
            .map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-1.5"
              >
                <Globe size={12} />
                Website
                <ExternalLink size={10} />
              </a>
            ))}
          {coin.links.blockchain_site
            .filter((l) => l)
            .slice(0, 3)
            .map((link) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-1.5 text-xs"
              >
                Explorer
                <ExternalLink size={10} />
              </a>
            ))}
          {coin.links.subreddit_url && (
            <a
              href={coin.links.subreddit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5"
            >
              Reddit
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>

      {showPortfolioModal && (
        <AddToPortfolioModal
          id={coin.id}
          symbol={coin.symbol}
          name={coin.name}
          type="crypto"
          currentPrice={md.current_price.usd}
          onClose={() => setShowPortfolioModal(false)}
        />
      )}
    </div>
  );
}
