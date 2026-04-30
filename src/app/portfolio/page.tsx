"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase,
  Trash2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
} from "lucide-react";
import {
  getPortfolio,
  removeFromPortfolio,
} from "@/lib/storage";
import {
  fetchCryptoMarkets,
  formatCurrency,
  formatPercent,
} from "@/lib/api";
import type { PortfolioHolding, CryptoAsset } from "@/types";

interface EnrichedHolding extends PortfolioHolding {
  currentPrice: number;
  priceChange24h: number;
  image: string;
  totalValue: number;
  totalCost: number;
  pnl: number;
  pnlPercent: number;
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const portfolio = getPortfolio();
    if (portfolio.length === 0) {
      setHoldings([]);
      setLoading(false);
      return;
    }

    try {
      const allMarkets = await fetchCryptoMarkets(1, 250);
      const priceMap: Record<string, CryptoAsset> = {};
      allMarkets.forEach((a) => {
        priceMap[a.id] = a;
      });

      const enriched: EnrichedHolding[] = portfolio.map((h) => {
        const market = priceMap[h.id];
        const currentPrice = market?.current_price ?? h.avgBuyPrice;
        const totalValue = h.quantity * currentPrice;
        const totalCost = h.quantity * h.avgBuyPrice;
        const pnl = totalValue - totalCost;
        const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

        return {
          ...h,
          currentPrice,
          priceChange24h: market?.price_change_percentage_24h ?? 0,
          image: market?.image ?? "",
          totalValue,
          totalCost,
          pnl,
          pnlPercent,
        };
      });

      setHoldings(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    const handler = () => loadData();
    window.addEventListener("portfolio-updated", handler);
    return () => {
      clearInterval(interval);
      window.removeEventListener("portfolio-updated", handler);
    };
  }, [loadData]);

  const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  function handleRemove(id: string) {
    removeFromPortfolio(id);
    loadData();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="mt-1 text-sm text-gray-500">Loading...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-static animate-pulse">
              <div className="h-4 w-20 rounded bg-gray-700 mb-2" />
              <div className="h-6 w-28 rounded bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your holdings with real-time P&L
        </p>
      </div>

      {holdings.length === 0 ? (
        <div className="card-static py-16 text-center">
          <Briefcase size={48} className="mx-auto text-gray-700" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            No holdings yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Add positions from any asset detail page
          </p>
          <Link
            href="/markets"
            className="btn-primary mt-4 inline-flex items-center gap-1"
          >
            Browse Markets <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card-static">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <DollarSign size={14} />
                Total Value
              </div>
              <div className="mt-2 text-xl font-bold text-white">
                {formatCurrency(totalValue)}
              </div>
            </div>
            <div className="card-static">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {totalPnl >= 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                Total P&L
              </div>
              <div
                className={`mt-2 text-xl font-bold ${totalPnl >= 0 ? "text-gain" : "text-loss"}`}
              >
                {formatCurrency(totalPnl)} ({formatPercent(totalPnlPercent)})
              </div>
            </div>
            <div className="card-static">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <PieChart size={14} />
                Holdings
              </div>
              <div className="mt-2 text-xl font-bold text-white">
                {holdings.length}
              </div>
            </div>
          </div>

          {/* Allocation */}
          {totalValue > 0 && (
            <div className="card-static">
              <h3 className="mb-3 text-sm font-semibold text-white">
                Allocation
              </h3>
              <div className="flex h-3 overflow-hidden rounded-full bg-gray-800">
                {holdings
                  .sort((a, b) => b.totalValue - a.totalValue)
                  .map((h, i) => {
                    const pct = (h.totalValue / totalValue) * 100;
                    const colors = [
                      "bg-brand-500",
                      "bg-purple-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-rose-500",
                      "bg-cyan-500",
                      "bg-indigo-500",
                      "bg-teal-500",
                    ];
                    return (
                      <div
                        key={h.id}
                        className={`${colors[i % colors.length]} transition-all`}
                        style={{ width: `${pct}%` }}
                        title={`${h.symbol.toUpperCase()} - ${pct.toFixed(1)}%`}
                      />
                    );
                  })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {holdings
                  .sort((a, b) => b.totalValue - a.totalValue)
                  .map((h, i) => {
                    const pct = (h.totalValue / totalValue) * 100;
                    const colors = [
                      "bg-brand-500",
                      "bg-purple-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-rose-500",
                      "bg-cyan-500",
                      "bg-indigo-500",
                      "bg-teal-500",
                    ];
                    return (
                      <div key={h.id} className="flex items-center gap-1.5 text-xs text-gray-400">
                        <div className={`h-2 w-2 rounded-full ${colors[i % colors.length]}`} />
                        {h.symbol.toUpperCase()} {pct.toFixed(1)}%
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Holdings Table */}
          <div className="card-static overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs text-gray-500">
                  <th className="px-4 py-3">Asset</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-right">P&L</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b border-gray-800/50 transition-colors hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/markets/${h.type}/${h.id}`}
                        className="flex items-center gap-2 hover:text-brand-400"
                      >
                        {h.image && (
                          <img
                            src={h.image}
                            alt={h.name}
                            className="h-6 w-6 rounded-full"
                          />
                        )}
                        <span className="font-medium text-white">
                          {h.name}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">
                          {h.symbol}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium text-white">
                        {formatCurrency(h.currentPrice)}
                      </div>
                      <div
                        className={`text-xs ${h.priceChange24h >= 0 ? "text-gain" : "text-loss"}`}
                      >
                        {formatPercent(h.priceChange24h)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300 hidden sm:table-cell">
                      {h.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {formatCurrency(h.totalValue)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${h.pnl >= 0 ? "text-gain" : "text-loss"}`}
                    >
                      <div>{formatCurrency(h.pnl)}</div>
                      <div className="text-xs">
                        {formatPercent(h.pnlPercent)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemove(h.id)}
                        className="text-gray-600 hover:text-loss transition-colors"
                        title="Remove holding"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
