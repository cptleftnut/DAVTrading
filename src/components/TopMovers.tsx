"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchCryptoMarkets, formatCurrency, formatPercent } from "@/lib/api";
import type { CryptoAsset } from "@/types";

export default function TopMovers() {
  const [gainers, setGainers] = useState<CryptoAsset[]>([]);
  const [losers, setLosers] = useState<CryptoAsset[]>([]);

  useEffect(() => {
    fetchCryptoMarkets(1, 100).then((assets) => {
      const sorted = [...assets].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
      );
      setGainers(sorted.slice(0, 5));
      setLosers(sorted.slice(-5).reverse());
    });
    const interval = setInterval(() => {
      fetchCryptoMarkets(1, 100).then((assets) => {
        const sorted = [...assets].sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        );
        setGainers(sorted.slice(0, 5));
        setLosers(sorted.slice(-5).reverse());
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="card-static">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gain">
          <ArrowUpRight size={16} />
          Top Gainers (24h)
        </h3>
        <div className="space-y-2">
          {gainers.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-gray-800" />
              ))
            : gainers.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/markets/crypto/${asset.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {asset.symbol.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {formatCurrency(asset.current_price)}
                    </div>
                    <div className="text-xs text-gain">
                      {formatPercent(asset.price_change_percentage_24h)}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      <div className="card-static">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-loss">
          <ArrowDownRight size={16} />
          Top Losers (24h)
        </h3>
        <div className="space-y-2">
          {losers.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-gray-800" />
              ))
            : losers.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/markets/crypto/${asset.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-white">
                      {asset.symbol.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {formatCurrency(asset.current_price)}
                    </div>
                    <div className="text-xs text-loss">
                      {formatPercent(asset.price_change_percentage_24h)}
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
