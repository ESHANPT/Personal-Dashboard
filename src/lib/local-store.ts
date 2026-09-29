import { useEffect, useState } from "react";

/** Persist state in the browser. SSR-safe: starts from `initial`, then hydrates. */
export function useLocalStore<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt data */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function formatLongDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Monday-to-Sunday range containing `d`. */
export function weekRange(d: Date) {
  const day = (d.getDay() + 6) % 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - day);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (x: Date) =>
    x.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return { monday, sunday, label: `${fmt(monday)} – ${fmt(sunday)}` };
}
