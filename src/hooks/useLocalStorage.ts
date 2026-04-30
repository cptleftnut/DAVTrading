"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorageEvent<T>(
  key: string,
  eventName: string,
  getter: () => T,
): [T, () => void] {
  const [data, setData] = useState<T>(getter);

  const refresh = useCallback(() => {
    setData(getter());
  }, [getter]);

  useEffect(() => {
    refresh();
    window.addEventListener(eventName, refresh);
    return () => window.removeEventListener(eventName, refresh);
  }, [eventName, refresh]);

  return [data, refresh];
}
