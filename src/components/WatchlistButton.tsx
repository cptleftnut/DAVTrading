"use client";

import { Star } from "lucide-react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/storage";
import { useState, useEffect } from "react";

export default function WatchlistButton({
  id,
  symbol,
  name,
  type,
}: {
  id: string;
  symbol: string;
  name: string;
  type: "crypto" | "stock";
}) {
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    setWatched(isInWatchlist(id));
    const handler = () => setWatched(isInWatchlist(id));
    window.addEventListener("watchlist-updated", handler);
    return () => window.removeEventListener("watchlist-updated", handler);
  }, [id]);

  function toggle() {
    if (watched) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist({ id, symbol, name, type });
    }
    setWatched(!watched);
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        watched
          ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
          : "btn-secondary"
      }`}
    >
      <Star size={14} fill={watched ? "currentColor" : "none"} />
      {watched ? "Watching" : "Watch"}
    </button>
  );
}
