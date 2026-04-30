"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { searchCrypto } from "@/lib/api";
import Link from "next/link";

export default function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; name: string; symbol: string; thumb: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await searchCrypto(query);
      setResults(res);
      setShowResults(true);
      setLoading(false);
    }, 300);
  }, [query]);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-gray-800 bg-surface-950/80 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="lg:hidden w-8" />
      <div ref={ref} className="relative flex-1 max-w-xl">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="input-field pl-9 pr-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X size={14} />
          </button>
        )}

        {showResults && (
          <div className="absolute top-full mt-1 w-full rounded-lg border border-gray-700 bg-gray-900 shadow-2xl">
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No results found
              </div>
            ) : (
              results.map((coin) => (
                <Link
                  key={coin.id}
                  href={`/markets/crypto/${coin.id}`}
                  onClick={() => {
                    setShowResults(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-800"
                >
                  <img
                    src={coin.thumb}
                    alt={coin.name}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="font-medium text-white">{coin.name}</span>
                  <span className="text-gray-500 uppercase">
                    {coin.symbol}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      <div className="hidden items-center gap-3 text-xs text-gray-500 sm:flex">
        <span>Real-time data</span>
        <span className="h-1.5 w-1.5 rounded-full bg-gain animate-pulse" />
      </div>
    </header>
  );
}
