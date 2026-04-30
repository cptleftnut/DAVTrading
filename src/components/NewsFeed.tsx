"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Clock } from "lucide-react";
import { fetchCryptoNews } from "@/lib/api";
import type { NewsArticle } from "@/types";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000,
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsFeed({
  limit = 10,
  compact = false,
}: {
  limit?: number;
  compact?: boolean;
}) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoNews()
      .then((a) => setArticles(a.slice(0, limit)))
      .finally(() => setLoading(false));
    const interval = setInterval(() => {
      fetchCryptoNews().then((a) => setArticles(a.slice(0, limit)));
    }, 120000);
    return () => clearInterval(interval);
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: compact ? 5 : limit }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-800" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Unable to load news. Please try again later.
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg px-2 py-2 transition-colors hover:bg-gray-800"
          >
            <div className="text-sm font-medium text-white line-clamp-2">
              {article.title}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>{article.source}</span>
              <span>&middot;</span>
              <Clock size={10} />
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card group flex flex-col"
        >
          {article.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-lg">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-40 w-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-brand-400">
            {article.title}
          </h3>
          {article.description && (
            <p className="mt-1 text-xs text-gray-400 line-clamp-2">
              {article.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{article.source}</span>
              <span>&middot;</span>
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
            <ExternalLink
              size={12}
              className="text-gray-600 group-hover:text-brand-400"
            />
          </div>
        </a>
      ))}
    </div>
  );
}
