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
          "Log bedtime and wake time, see a 7-day chart of hours slept, weekly average and best and worst nights against an 8-hour goal.",
      },
      { property: "og:title", content: "Sleep Tracker — Eshan's Dashboard" },
      { property: "og:description", content: "Seven days of sleep, at a glance." },
    ],
  }),
  component: SleepPage,
});

type Entry = { id: string; date: string; bed: string; wake: string };

const iso = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const starter: Entry[] = [
  { id: uid(), date: iso(5), bed: "23:00", wake: "07:00" },
  { id: uid(), date: iso(4), bed: "00:30", wake: "07:00" },
  { id: uid(), date: iso(3), bed: "23:15", wake: "07:30" },
  { id: uid(), date: iso(2), bed: "23:30", wake: "07:15" },
  { id: uid(), date: iso(1), bed: "01:00", wake: "07:00" },
];

function hours(bed: string, wake: string) {
  const [bh = NaN, bm = NaN] = bed.split(":").map(Number);
  const [wh = NaN, wm = NaN] = wake.split(":").map(Number);
  if ([bh, bm, wh, wm].some((n) => Number.isNaN(n))) return 0;
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

const dayLabel = (date: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", opts);

const GOAL = 8;

function Stat({ label, value, hint }: { label: string; value: string; hint?: string | undefined }) {
  return (
    <div className="card-leaf p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-forest">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SleepPage() {
  const [entries, setEntries] = useLocalStore<Entry[]>("eshan.sleep", starter);
  const [form, setForm] = useState({ date: iso(0), bed: "23:00", wake: "07:00" });

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7).map((e) => ({ ...e, h: hours(e.bed, e.wake) }));
  const avg = last7.length
    ? Math.round((last7.reduce((s, e) => s + e.h, 0) / last7.length) * 10) / 10
    : 0;
  const best = last7.length ? last7.reduce((a, b) => (b.h > a.h ? b : a)) : null;
  const worst = last7.length ? last7.reduce((a, b) => (b.h < a.h ? b : a)) : null;
  const max = Math.max(10, ...last7.map((e) => e.h));

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌙"
        title="Sleep Tracker"
        subtitle="Rest is part of the study plan. Goal: 8 hours a night."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
        <section className="card-leaf fade-up p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-forest">Last 7 nights</h2>
          {last7.length === 0 ? (
            <div className="mt-4">
              <Empty>Nothing here yet, log your first night 🌱</Empty>
            </div>
          ) : (
            <div className="relative mt-8 h-56">
              <div className="absolute inset-x-0 bottom-6 top-5">
                <div
                  className="absolute inset-x-0 z-10 border-t-2 border-dashed border-bark/50"
                  style={{ bottom: `${(GOAL / max) * 100}%` }}
                >
                  <span className="absolute -top-5 right-0 text-xs text-muted-foreground">
                    goal {GOAL}h
                  </span>
                </div>
              </div>
              <div className="flex h-full items-end gap-2 sm:gap-3">
                {last7.map((e) => (
                  <div key={e.id} className="flex h-full flex-1 flex-col items-center">
                    <div className="flex w-full flex-1 flex-col items-center justify-end">
                      <span className="mb-1 text-xs font-medium text-forest">{e.h}h</span>
                      <div
                        className={`w-full max-w-14 rounded-t-md transition-all duration-500 ${e.h >= GOAL ? "bg-primary" : "bg-sage"}`}
                        style={{ height: `${Math.max((e.h / max) * 100, 2)}%` }}
                      />
                    </div>
                    <span className="mt-1 h-5 text-xs text-muted-foreground">
                      {dayLabel(e.date, { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="fade-up grid grid-cols-3 gap-4 lg:grid-cols-1">
          <Stat label="Weekly avg" value={`${avg}h`} hint={`${last7.length} nights`} />
          <Stat
            label="Best night"
            value={best ? `${best.h}h` : "—"}
            hint={best ? dayLabel(best.date, { weekday: "short", day: "numeric", month: "short" }) : undefined}
          />
          <Stat
            label="Worst night"
            value={worst ? `${worst.h}h` : "—"}
            hint={worst ? dayLabel(worst.date, { weekday: "short", day: "numeric", month: "short" }) : undefined}
          />
        </div>
      </div>

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
        {(
          [
            ["date", "Date", "date"],
            ["bed", "Bedtime", "time"],
            ["wake", "Wake time", "time"],
          ] as const
        ).map(([k, label, type]) => (
          <label key={k} className="text-sm">
            <span className="text-muted-foreground">{label}</span>
            <input
              type={type}
              required
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
            />
          </label>
        ))}
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Log {hours(form.bed, form.wake)}h
        </button>
      </form>

      {sorted.length > 0 ? (
        <section className="card-leaf fade-up p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-forest">Past entries</h2>
          <ul className="mt-4 space-y-2">
            {[...sorted].reverse().map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2 text-sm"
              >
                <span className="w-32">
                  {dayLabel(e.date, { weekday: "short", day: "numeric", month: "short" })}
                </span>
                <span className="flex-1 text-muted-foreground">
                  {e.bed} → {e.wake}
                </span>
                <span className="font-medium text-forest">{hours(e.bed, e.wake)}h</span>
                <button
                  aria-label="Delete entry"
                  onClick={() => setEntries((prev) => prev.filter((p) => p.id !== e.id))}
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
