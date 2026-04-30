"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketOverviewCards from "@/components/MarketOverviewCards";
import TopMovers from "@/components/TopMovers";
import TrendingCoins from "@/components/TrendingCoins";
import NewsFeed from "@/components/NewsFeed";
import CryptoTable from "@/components/CryptoTable";
import { fetchCryptoMarkets } from "@/lib/api";
import type { CryptoAsset } from "@/types";

export default function Dashboard() {
  const [topCryptos, setTopCryptos] = useState<CryptoAsset[]>([]);

  useEffect(() => {
    fetchCryptoMarkets(1, 10).then(setTopCryptos).catch(console.error);
    const interval = setInterval(() => {
      fetchCryptoMarkets(1, 10).then(setTopCryptos).catch(console.error);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time market overview &middot; All data is live
        </p>
      </div>

      <MarketOverviewCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TopMovers />
        </div>
        <div>
          <TrendingCoins />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Top Cryptocurrencies
          </h2>
          <Link
            href="/markets"
            className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card-static overflow-hidden p-0">
          <CryptoTable assets={topCryptos} />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Latest News</h2>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm text-brand-400 hover:text-brand-300"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <NewsFeed limit={6} compact />
      </div>
    </div>
  );
}
