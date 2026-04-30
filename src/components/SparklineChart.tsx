"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

export default function SparklineChart({
  data,
  positive,
  width = 120,
  height = 40,
}: {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const chart = createChart(ref.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "transparent",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: { mode: 0, vertLine: { visible: false }, horzLine: { visible: false } },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addAreaSeries({
      lineColor: positive ? "#22c55e" : "#ef4444",
      topColor: positive ? "#22c55e22" : "#ef444422",
      bottomColor: "transparent",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    const now = Math.floor(Date.now() / 1000);
    const interval = Math.floor((7 * 24 * 3600) / data.length);
    series.setData(
      data.map((value, i) => ({
        time: (now - (data.length - i) * interval) as any,
        value,
      })),
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [data, positive, width, height]);

  return <div ref={ref} />;
}
