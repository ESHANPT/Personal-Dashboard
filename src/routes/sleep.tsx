import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Empty, PageHeader } from "@/components/PageHeader";
import { uid, useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/sleep")({
  head: () => ({
    meta: [
      { title: "Sleep Tracker — Eshan's Dashboard" },
      {
        name: "description",
        content:
          "Log bedtime and wake time, see a 7-day chart of hours slept and your weekly average against an 8-hour goal.",
      },
      { property: "og:title", content: "Sleep Tracker — Eshan's Dashboard" },
      {
        property: "og:description",
        content: "Seven days of sleep, at a glance.",
      },
    ],
  }),
  component: SleepPage,
});

type Entry = { id: string; date: string; bed: string; wake: string };

const iso = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

const starter: Entry[] = [
  { id: uid(), date: iso(2), bed: "23:30", wake: "07:15" },
  { id: uid(), date: iso(1), bed: "00:15", wake: "07:00" },
];

function hours(bed: string, wake: string) {
  const [bh = NaN, bm = NaN] = bed.split(":").map(Number);
  const [wh = NaN, wm = NaN] = wake.split(":").map(Number);
  if ([bh, bm, wh, wm].some((n) => Number.isNaN(n))) return 0;
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

const GOAL = 8;

function SleepPage() {
  const [entries, setEntries] = useLocalStore<Entry[]>("eshan.sleep", starter);
  const [form, setForm] = useState({
    date: iso(0),
    bed: "23:00",
    wake: "07:00",
  });

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const avg = last7.length
    ? Math.round(
        (last7.reduce((s, e) => s + hours(e.bed, e.wake), 0) / last7.length) * 10,
      ) / 10
    : 0;
  const max = Math.max(10, ...last7.map((e) => hours(e.bed, e.wake)));

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌙"
        title="Sleep Tracker"
        subtitle="Rest is part of the study plan. Goal: 8 hours a night."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setEntries((prev) => [
            ...prev.filter((p) => p.date !== form.date),
            { id: uid(), ...form },
          ]);
        }}
        className="card-leaf fade-up grid gap-3 p-5 sm:grid-cols-4 sm:items-end"
      >
        <label className="text-sm">
          <span className="text-muted-foreground">Date</span>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Bedtime</span>
          <input
            type="time"
            required
            value={form.bed}
            onChange={(e) => setForm({ ...form, bed: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
          />
        </label>
        <label className="text-sm">
          <span className="text-muted-foreground">Wake time</span>
          <input
            type="time"
            required
            value={form.wake}
            onChange={(e) => setForm({ ...form, wake: e.target.value })}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
          />
        </label>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Log {hours(form.bed, form.wake)}h
        </button>
      </form>

      <section className="card-leaf fade-up p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold text-forest">Last 7 nights</h2>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Weekly average: {avg}h
          </span>
        </div>

        {last7.length === 0 ? (
          <div className="mt-4">
            <Empty>Nothing here yet, log your first night 🌱</Empty>
          </div>
        ) : (
          <div className="relative mt-6 h-48">
            <div
              className="absolute inset-x-0 border-t-2 border-dashed border-accent"
              style={{ bottom: `${(GOAL / max) * 100}%` }}
            >
              <span className="absolute -top-5 right-0 text-xs text-muted-foreground">
                goal {GOAL}h
              </span>
            </div>
            <div className="flex h-full items-end gap-2">
              {last7.map((e) => {
                const h = hours(e.bed, e.wake);
                return (
                  <div key={e.id} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{h}</span>
                    <div
                      className="w-full rounded-t-md bg-primary transition-all"
                      style={{ height: `${Math.max((h / max) * 100, 2)}%` }}
                    />
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(e.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {sorted.length > 0 ? (
        <section className="card-leaf fade-up p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-forest">All entries</h2>
          <ul className="mt-4 space-y-2">
            {[...sorted].reverse().map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2 text-sm"
              >
                <span className="w-28">
                  {new Date(e.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="flex-1 text-muted-foreground">
                  {e.bed} → {e.wake}
                </span>
                <span className="font-medium text-forest">
                  {hours(e.bed, e.wake)}h
                </span>
                <button
                  aria-label="Delete entry"
                  onClick={() =>
                    setEntries((prev) => prev.filter((p) => p.id !== e.id))
                  }
                  className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
