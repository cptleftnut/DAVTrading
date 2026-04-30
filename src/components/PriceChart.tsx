"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, type IChartApi } from "lightweight-charts";
import type { OHLCData } from "@/types";

interface PriceChartProps {
  data: OHLCData[];
  height?: number;
  showVolume?: boolean;
}

const TIME_RANGES = [
  { label: "1D", value: "1" },
  { label: "7D", value: "7" },
  { label: "1M", value: "30" },
  { label: "3M", value: "90" },
  { label: "1Y", value: "365" },
];

export default function PriceChart({
  data,
  height = 400,
  showVolume = true,
}: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
      },
      grid: {
        vertLines: { color: "#1f293722" },
        horzLines: { color: "#1f293722" },
      },
      width: containerRef.current.clientWidth,
      height,
      crosshair: {
        mode: 0,
        vertLine: { color: "#2aa4ff44", width: 1 },
        horzLine: { color: "#2aa4ff44", width: 1 },
      },
      timeScale: {
        borderColor: "#1f2937",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#1f2937",
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderDownColor: "#ef4444",
      borderUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      wickUpColor: "#22c55e",
    });

    const formatted = data.map((d) => ({
      time: d.time as number,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candleSeries.setData(formatted as any);

    if (showVolume && data.some((d) => d.volume)) {
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });
      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      volumeSeries.setData(
        data
          .filter((d) => d.volume !== undefined)
          .map((d) => ({
            time: d.time as number,
            value: d.volume!,
            color: d.close >= d.open ? "#22c55e33" : "#ef444433",
          })) as any,
      );
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, height, showVolume]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-500"
        style={{ height }}
      >
        Loading chart data...
      </div>
    );
  }

  return <div ref={containerRef} className="w-full" />;
}

export function ChartWithControls({
  fetchData,
  defaultRange = "7",
}: {
  fetchData: (days: string) => Promise<OHLCData[]>;
  defaultRange?: string;
}) {
  const [range, setRange] = useState(defaultRange);
  const [data, setData] = useState<OHLCData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchData(range).then((d) => {
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [range, fetchData]);

  return (
    <div>
      <div className="mb-3 flex gap-1">
        {TIME_RANGES.map((tr) => (
          <button
            key={tr.value}
            onClick={() => setRange(tr.value)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              range === tr.value
                ? "bg-brand-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {tr.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex h-[400px] items-center justify-center text-gray-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : (
        <PriceChart data={data} showVolume={true} />
      )}
    </div>
  );
}
