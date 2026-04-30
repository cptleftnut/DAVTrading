import type { WatchlistItem, PortfolioHolding } from "@/types";

const WATCHLIST_KEY = "dav_watchlist";
const PORTFOLIO_KEY = "dav_portfolio";

// ── Watchlist ───────────────────────────────────────────────────────

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(item: Omit<WatchlistItem, "addedAt">): void {
  const list = getWatchlist();
  if (list.some((w) => w.id === item.id)) return;
  list.push({ ...item, addedAt: Date.now() });
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("watchlist-updated"));
}

export function removeFromWatchlist(id: string): void {
  const list = getWatchlist().filter((w) => w.id !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("watchlist-updated"));
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().some((w) => w.id === id);
}

// ── Portfolio ───────────────────────────────────────────────────────

export function getPortfolio(): PortfolioHolding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToPortfolio(
  item: Omit<PortfolioHolding, "addedAt">,
): void {
  const list = getPortfolio();
  const existing = list.find((h) => h.id === item.id);
  if (existing) {
    const totalQty = existing.quantity + item.quantity;
    existing.avgBuyPrice =
      (existing.avgBuyPrice * existing.quantity +
        item.avgBuyPrice * item.quantity) /
      totalQty;
    existing.quantity = totalQty;
  } else {
    list.push({ ...item, addedAt: Date.now() });
  }
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("portfolio-updated"));
}

export function removeFromPortfolio(id: string): void {
  const list = getPortfolio().filter((h) => h.id !== id);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("portfolio-updated"));
}

export function updateHolding(
  id: string,
  quantity: number,
  avgBuyPrice: number,
): void {
  const list = getPortfolio();
  const holding = list.find((h) => h.id === id);
  if (holding) {
    holding.quantity = quantity;
    holding.avgBuyPrice = avgBuyPrice;
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("portfolio-updated"));
  }
}
