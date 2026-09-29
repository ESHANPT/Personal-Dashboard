import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Empty, PageHeader } from "@/components/PageHeader";
import { uid, useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/university")({
  head: () => ({
    meta: [
      { title: "University — Eshan's Dashboard" },
      {
        name: "description",
        content:
          "Semester 1 BSc Computer Science modules with assignments, due dates and days remaining.",
      },
      { property: "og:title", content: "University — Eshan's Dashboard" },
      {
        property: "og:description",
        content: "Semester 1 modules and every upcoming deadline.",
      },
    ],
  }),
  component: UniversityPage,
});

const modules = [
  "Programming",
  "Mathematics for Computing",
  "Algorithms and Data Types",
  "Computer Architecture",
  "Information Systems and Databases",
  "Data Communications",
];

type Assignment = {
  id: string;
  module: string;
  title: string;
  due: string;
  done: boolean;
};

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const starter: Assignment[] = [
  { id: uid(), module: "Programming", title: "Coursework 1: Python basics", due: inDays(5), done: false },
  { id: uid(), module: "Mathematics for Computing", title: "Problem set 2", due: inDays(9), done: false },
  { id: uid(), module: "Algorithms and Data Types", title: "Lab report", due: inDays(14), done: false },
];

function daysLeft(due: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

function dueLabel(n: number) {
  if (n < 0) return `${Math.abs(n)} days overdue`;
  if (n === 0) return "Due today";
  if (n === 1) return "1 day left";
  return `${n} days left`;
}

function UniversityPage() {
  const [items, setItems] = useLocalStore<Assignment[]>("eshan.university", starter);
  const [open, setOpen] = useState<string | null>(modules[0]);
  const [draft, setDraft] = useState({ title: "", due: inDays(7) });

  const upcoming = items
    .filter((i) => !i.done)
    .sort((a, b) => a.due.localeCompare(b.due));

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
    );
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🎓"
        title="University"
        subtitle="BSc Computer Science, Year 1 · Semester 1"
      />

      <section className="card-leaf fade-up p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-forest">Upcoming deadlines</h2>
        {upcoming.length === 0 ? (
          <div className="mt-4">
            <Empty>Nothing due, enjoy the clear sky 🌱</Empty>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {upcoming.map((i) => {
              const n = daysLeft(i.due);
              return (
                <li
                  key={i.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg bg-muted/60 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={() => toggle(i.id)}
                    aria-label={`Mark ${i.title} complete`}
                    className="size-4 accent-[var(--moss)]"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium text-forest">{i.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {i.module} ·{" "}
                      {new Date(i.due).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </span>
                  <span
                    className={
                      n < 2
                        ? "rounded-full bg-destructive px-2.5 py-1 text-xs text-destructive-foreground"
                        : "rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                    }
                  >
                    {dueLabel(n)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="space-y-3">
        {modules.map((m) => {
          const mine = items
            .filter((i) => i.module === m)
            .sort((a, b) => a.due.localeCompare(b.due));
          const isOpen = open === m;
          return (
            <section key={m} className="card-leaf fade-up p-5">
              <button
                onClick={() => setOpen(isOpen ? null : m)}
                className="flex w-full items-center justify-between gap-3 text-left"
              >
                <span className="font-display text-lg font-semibold text-forest">
                  🌲 {m}
                </span>
                <span className="text-xs text-muted-foreground">
                  {mine.filter((i) => !i.done).length} open ·{" "}
                  {isOpen ? "hide" : "show"}
                </span>
              </button>

              {isOpen ? (
                <div className="mt-4 space-y-3">
                  {mine.length === 0 ? (
                    <Empty>Nothing here yet, add your first assignment 🌱</Empty>
                  ) : (
                    <ul className="space-y-2">
                      {mine.map((i) => (
                        <li
                          key={i.id}
                          className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={i.done}
                            onChange={() => toggle(i.id)}
                            aria-label={`Mark ${i.title} complete`}
                            className="size-4 accent-[var(--moss)]"
                          />
                          <span
                            className={
                              i.done ? "flex-1 line-through opacity-60" : "flex-1"
                            }
                          >
                            {i.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(i.due).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <button
                            aria-label={`Delete ${i.title}`}
                            onClick={() => remove(i.id)}
                            className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const title = draft.title.trim();
                      if (!title) return;
                      setItems((prev) => [
                        ...prev,
                        { id: uid(), module: m, title, due: draft.due, done: false },
                      ]);
                      setDraft({ title: "", due: inDays(7) });
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    <input
                      value={draft.title}
                      onChange={(e) =>
                        setDraft({ ...draft, title: e.target.value })
                      }
                      placeholder="Assignment or deadline…"
                      className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="date"
                      value={draft.due}
                      onChange={(e) => setDraft({ ...draft, due: e.target.value })}
                      className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    />
                    <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                      <Plus className="size-4" /> Add
                    </button>
                  </form>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
