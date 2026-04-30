"use client";

import { useEffect, useState, useRef } from "react";

export default function LivePrice({
  symbol,
  initialPrice,
  className = "",
}: {
  symbol: string;
  initialPrice: number;
  className?: string;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef(initialPrice);

  useEffect(() => {
    const binanceSymbol = symbol.toUpperCase().replace("-", "") + "USDT";
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${binanceSymbol.toLowerCase()}@trade`,
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newPrice = parseFloat(data.p);
        if (newPrice !== prevPrice.current) {
          setFlash(newPrice > prevPrice.current ? "up" : "down");
          prevPrice.current = newPrice;
          setPrice(newPrice);
          setTimeout(() => setFlash(null), 500);
        }
      };

      ws.onerror = () => {
        ws?.close();
      };
    } catch {
      // WebSocket not available, fall back to static price
    }

    return () => {
      ws?.close();
    };
  }, [symbol]);

  const formattedPrice =
    price < 1
      ? price.toFixed(6)
      : price < 100
        ? price.toFixed(4)
        : price.toFixed(2);

  return (
    <span
      className={`transition-colors duration-500 ${
        flash === "up"
          ? "text-gain"
          : flash === "down"
            ? "text-loss"
            : ""
      } ${className}`}
    >
      ${formattedPrice}
    </span>
  );
}
