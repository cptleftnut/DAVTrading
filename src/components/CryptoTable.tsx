"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/api";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";
import SparklineChart from "./SparklineChart";
import type { CryptoAsset } from "@/types";
import { useState } from "react";

export default function CryptoTable({ assets }: { assets: CryptoAsset[] }) {
  const [, setTick] = useState(0);

  function toggleWatchlist(asset: CryptoAsset) {
    if (isInWatchlist(asset.id)) {
      removeFromWatchlist(asset.id);
    } else {
      addToWatchlist({
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        type: "crypto",
      });
    }
    setTick((t) => t + 1);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
            <th className="px-3 py-3 w-8"></th>
            <th className="px-3 py-3 w-8">#</th>
            <th className="px-3 py-3">Name</th>
            <th className="px-3 py-3 text-right">Price</th>
            <th className="px-3 py-3 text-right">24h %</th>
            <th className="px-3 py-3 text-right hidden md:table-cell">7d %</th>
            <th className="px-3 py-3 text-right hidden lg:table-cell">
              Market Cap
            </th>
            <th className="px-3 py-3 text-right hidden lg:table-cell">
              Volume (24h)
            </th>
            <th className="px-3 py-3 hidden xl:table-cell">7d Chart</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const watched = isInWatchlist(asset.id);
            return (
              <tr
                key={asset.id}
                className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30"
              >
                <td className="px-3 py-3">
                  <button
                    onClick={() => toggleWatchlist(asset)}
                    className={`transition-colors ${
                      watched
                        ? "text-yellow-400"
                        : "text-gray-600 hover:text-yellow-400"
                    }`}
                  >
                    <Star size={14} fill={watched ? "currentColor" : "none"} />
                  </button>
                </td>
                <td className="px-3 py-3 text-gray-500">
                  {asset.market_cap_rank}
                </td>
                <td className="px-3 py-3">
                  <Link
                    href={`/markets/crypto/${asset.id}`}
                    className="flex items-center gap-2 hover:text-brand-400"
                  >
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="font-medium text-white">{asset.name}</span>
                    <span className="text-gray-500 uppercase text-xs">
                      {asset.symbol}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-right font-medium text-white">
                  {formatCurrency(asset.current_price)}
                </td>
                <td
                  className={`px-3 py-3 text-right font-medium ${
                    asset.price_change_percentage_24h >= 0
                      ? "text-gain"
                      : "text-loss"
                  }`}
                >
                  {formatPercent(asset.price_change_percentage_24h)}
                </td>
                <td
                  className={`px-3 py-3 text-right font-medium hidden md:table-cell ${
                    (asset.price_change_percentage_7d_in_currency ?? 0) >= 0
                      ? "text-gain"
                      : "text-loss"
                  }`}
                >
                  {asset.price_change_percentage_7d_in_currency
                    ? formatPercent(
                        asset.price_change_percentage_7d_in_currency,
                      )
                    : "-"}
                </td>
                <td className="px-3 py-3 text-right text-gray-300 hidden lg:table-cell">
                  {formatCurrency(asset.market_cap, true)}
                </td>
                <td className="px-3 py-3 text-right text-gray-300 hidden lg:table-cell">
                  {formatCurrency(asset.total_volume, true)}
                </td>
                <td className="px-3 py-3 hidden xl:table-cell">
                  {asset.sparkline_in_7d?.price && (
                    <SparklineChart
                      data={asset.sparkline_in_7d.price}
                      positive={
                        (asset.price_change_percentage_7d_in_currency ?? 0) >= 0
                      }
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
