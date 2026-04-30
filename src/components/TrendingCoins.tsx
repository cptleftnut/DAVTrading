"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { fetchTrendingCrypto, formatCurrency, formatPercent } from "@/lib/api";
import type { CryptoAsset } from "@/types";
import SparklineChart from "./SparklineChart";

export default function TrendingCoins() {
  const [coins, setCoins] = useState<CryptoAsset[]>([]);

  useEffect(() => {
    fetchTrendingCrypto().then(setCoins).catch(console.error);
    const interval = setInterval(() => {
      fetchTrendingCrypto().then(setCoins).catch(console.error);
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) {
    return (
      <div className="card-static">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
          <Flame size={16} />
          Trending
        </h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-static">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-400">
        <Flame size={16} />
        Trending
      </h3>
      <div className="space-y-1">
        {coins.map((coin) => (
          <Link
            key={coin.id}
            href={`/markets/crypto/${coin.id}`}
            className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <img
                src={coin.image}
                alt={coin.name}
                className="h-6 w-6 rounded-full"
              />
              <div>
                <span className="text-sm font-medium text-white">
                  {coin.name}
                </span>
                <span className="ml-2 text-xs text-gray-500 uppercase">
                  {coin.symbol}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {coin.sparkline_in_7d?.price && (
                <SparklineChart
                  data={coin.sparkline_in_7d.price}
                  positive={coin.price_change_percentage_24h >= 0}
                  width={60}
                  height={24}
                />
              )}
              <div className="text-right">
                <div className="text-sm text-white">
                  {formatCurrency(coin.current_price)}
                </div>
                <div
                  className={`text-xs ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-gain"
                      : "text-loss"
                  }`}
                >
                  {formatPercent(coin.price_change_percentage_24h)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
