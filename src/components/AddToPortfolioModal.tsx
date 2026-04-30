"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { addToPortfolio } from "@/lib/storage";

export default function AddToPortfolioModal({
  id,
  symbol,
  name,
  type,
  currentPrice,
  onClose,
}: {
  id: string;
  symbol: string;
  name: string;
  type: "crypto" | "stock";
  currentPrice: number;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState(currentPrice.toString());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qty = parseFloat(quantity);
    const price = parseFloat(buyPrice);
    if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) return;

    addToPortfolio({ id, symbol, name, type, quantity: qty, avgBuyPrice: price });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Add {symbol.toUpperCase()} to Portfolio
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Quantity
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="input-field"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Buy Price (USD)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
          </div>

          {quantity && buyPrice && (
            <div className="rounded-lg bg-gray-800 px-3 py-2 text-sm">
              <span className="text-gray-400">Total cost: </span>
              <span className="font-medium text-white">
                ${(parseFloat(quantity) * parseFloat(buyPrice)).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-1">
              <Plus size={14} />
              Add Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
