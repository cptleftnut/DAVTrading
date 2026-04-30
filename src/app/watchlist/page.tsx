"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Trash2, ArrowRight } from "lucide-react";
import { getWatchlist, removeFromWatchlist } from "@/lib/storage";
import { fetchCryptoMarkets, formatCurrency, formatPercent } from "@/lib/api";
import SparklineChart from "@/components/SparklineChart";
import type { WatchlistItem, CryptoAsset } from "@/types";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [prices, setPrices] = useState<Record<string, CryptoAsset>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getWatchlist();
    setWatchlist(list);

    if (list.length > 0) {
      const cryptoIds = list
        .filter((w) => w.type === "crypto")
        .map((w) => w.id);
      if (cryptoIds.length > 0) {
        fetchCryptoMarkets(1, 250)
          .then((all) => {
            const map: Record<string, CryptoAsset> = {};
            all.forEach((a) => {
              if (cryptoIds.includes(a.id)) map[a.id] = a;
            });
            setPrices(map);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    const handler = () => setWatchlist(getWatchlist());
    window.addEventListener("watchlist-updated", handler);
    return () => window.removeEventListener("watchlist-updated", handler);
  }, []);

  function handleRemove(id: string) {
    removeFromWatchlist(id);
    setWatchlist(getWatchlist());
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="mt-1 text-sm text-gray-500">Loading...</p>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Watchlist</h1>
        <p className="mt-1 text-sm text-gray-500">
          {watchlist.length} asset{watchlist.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="card-static py-16 text-center">
          <Star size={48} className="mx-auto text-gray-700" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            Your watchlist is empty
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Star assets from the Markets page to track them here
          </p>
          <Link href="/markets" className="btn-primary mt-4 inline-flex items-center gap-1">
            Browse Markets <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="card-static overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">24h %</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">
                  Market Cap
                </th>
                <th className="px-4 py-3 hidden lg:table-cell">7d</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => {
                const data = prices[item.id];
                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/markets/${item.type}/${item.id}`}
                        className="flex items-center gap-2 hover:text-brand-400"
                      >
                        {data?.image && (
                          <img
                            src={data.image}
                            alt={item.name}
                            className="h-6 w-6 rounded-full"
                          />
                        )}
                        <span className="font-medium text-white">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">
                          {item.symbol}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {data ? formatCurrency(data.current_price) : "-"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        data && data.price_change_percentage_24h >= 0
                          ? "text-gain"
                          : "text-loss"
                      }`}
                    >
                      {data
                        ? formatPercent(data.price_change_percentage_24h)
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300 hidden md:table-cell">
                      {data ? formatCurrency(data.market_cap, true) : "-"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {data?.sparkline_in_7d?.price && (
                        <SparklineChart
                          data={data.sparkline_in_7d.price}
                          positive={data.price_change_percentage_24h >= 0}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-600 hover:text-loss transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
