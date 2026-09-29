import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TodoList } from "@/components/TodoList";
import { NotePad } from "@/components/NotePad";
import { PageHeader } from "@/components/PageHeader";
import { formatLongDate, useLocalStore, weekRange } from "@/lib/local-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Eshan's Dashboard" },
      {
        name: "description",
        content:
          "Daily and weekly to-dos, reminders and reflections in one calm forest-green command center.",
      },
      { property: "og:title", content: "Dashboard — Eshan's Dashboard" },
      {
        property: "og:description",
        content: "Your personal command center, everything in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const reminders = ["Daily checklist", "Daily reflection"];

function Dashboard() {
  const [now, setNow] = useState<Date | null>(null);
  const [checks, setChecks] = useLocalStore<Record<string, boolean>>(
    "eshan.reminders",
    {},
  );

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const week = now ? weekRange(now) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌿"
        title="Hey Eshan!"
        subtitle="Your personal command center, everything in one place."
      />

      <div className="card-leaf fade-up p-5">
        <p className="font-display text-xl text-forest sm:text-2xl">
          {now ? formatLongDate(now) : "\u00A0"}
        </p>
      </div>

      <TodoList
        storageKey="eshan.todo.daily"
        title="Daily To-Do List"
        helper="Update every morning. Clear every night!"
        starter={["Review lecture notes", "30 min Python practice", "Stretch + water"]}
      />

      <TodoList
        storageKey="eshan.todo.weekly"
        title={`Weekly To-Do List${week ? ` · ${week.label}` : ""}`}
        subtitle="Monday to Sunday"
        starter={["Finish Algorithms worksheet", "Plan next week's study blocks"]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <NotePad
          storageKey="eshan.braindump"
          title="🧠 Brain Dump"
          placeholder="Dump random thoughts here..."
        />
        <NotePad
          storageKey="eshan.ideas"
          title="💡 Ideas"
          placeholder="Ideas or things you want to explore..."
        />
      </div>

      <section className="card-leaf fade-up p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-forest">🍃 Reminders</h2>
        <ul className="mt-4 space-y-2">
          {reminders.map((r) => (
            <li
              key={r}
              className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={Boolean(checks[r])}
                onChange={() =>
                  setChecks((prev) => ({ ...prev, [r]: !prev[r] }))
                }
                className="size-4 accent-[var(--moss)]"
                aria-label={r}
              />
              <span className={checks[r] ? "text-sm line-through opacity-60" : "text-sm"}>
                {r}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
