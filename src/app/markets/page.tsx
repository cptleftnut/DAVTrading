"use client";

import { useEffect, useState } from "react";
import CryptoTable from "@/components/CryptoTable";
import { fetchCryptoMarkets } from "@/lib/api";
import type { CryptoAsset } from "@/types";

export default function MarketsPage() {
  const [assets, setAssets] = useState<CryptoAsset[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCryptoMarkets(page, 50)
      .then(setAssets)
      .catch(console.error)
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetchCryptoMarkets(page, 50).then(setAssets).catch(console.error);
    }, 30000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Live cryptocurrency prices by market cap
        </p>
      </div>

      <div className="card-static overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <CryptoTable assets={assets} />
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn-secondary disabled:opacity-30"
        >
          Previous
        </button>
        <span className="px-4 text-sm text-gray-400">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={assets.length < 50}
          className="btn-secondary disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
