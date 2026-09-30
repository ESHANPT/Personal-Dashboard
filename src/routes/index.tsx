import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TodoList } from "@/components/TodoList";
import { NotePad } from "@/components/NotePad";
import { PageHeader } from "@/components/PageHeader";
import { formatLongDate, weekRange } from "@/lib/local-store";

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

function Dashboard() {
  const [now, setNow] = useState<Date | null>(null);

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

      <TodoList
        storageKey="eshan.reminders"
        title="🍃 Reminders"
        starter={["Daily checklist", "Daily reflection"]}
        inputPlaceholder="Add a reminder..."
        emptyMessage="No reminders, you're all clear 🌱"
      />
    </div>
  );
}
