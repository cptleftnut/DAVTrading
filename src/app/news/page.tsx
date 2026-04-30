"use client";

import NewsFeed from "@/components/NewsFeed";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">News</h1>
        <p className="mt-1 text-sm text-gray-500">
          Latest financial and crypto news &middot; Updated every 2 minutes
        </p>
      </div>

      <NewsFeed limit={30} />
    </div>
  );
}
