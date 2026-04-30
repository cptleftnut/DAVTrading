"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  BarChart3,
  Activity,
  Bitcoin,
} from "lucide-react";
import { fetchGlobalData, formatCurrency, formatPercent, formatNumber } from "@/lib/api";
import type { MarketOverview } from "@/types";

export default function MarketOverviewCards() {
  const [data, setData] = useState<MarketOverview | null>(null);

  useEffect(() => {
    fetchGlobalData().then(setData).catch(console.error);
    const interval = setInterval(() => {
      fetchGlobalData().then(setData).catch(console.error);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-static animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-700 mb-2" />
            <div className="h-6 w-32 rounded bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Market Cap",
      value: formatCurrency(data.totalMarketCap, true),
      change: data.marketCapChange24h,
      icon: DollarSign,
    },
    {
      label: "24h Volume",
      value: formatCurrency(data.totalVolume, true),
      icon: BarChart3,
    },
    {
      label: "BTC Dominance",
      value: `${data.btcDominance.toFixed(1)}%`,
      icon: Bitcoin,
    },
    {
      label: "Active Cryptos",
      value: formatNumber(data.activeCryptocurrencies),
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card-static">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{card.label}</span>
            <card.icon size={16} className="text-gray-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">{card.value}</span>
            {card.change !== undefined && (
              <span
                className={`text-xs font-medium ${
                  card.change >= 0 ? "text-gain" : "text-loss"
                }`}
              >
                {formatPercent(card.change)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
