import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { uid, useLocalStore } from "@/lib/local-store";
import { Empty } from "./PageHeader";
import { Button } from "./ui/button";

export type Task = { id: string; text: string; done: boolean };

export function TodoList({
  storageKey,
  title,
  subtitle,
  helper,
  starter,
  inputPlaceholder = "Add a task…",
  emptyMessage = "Nothing here yet, add your first task 🌱",
}: {
  storageKey: string;
  title: string;
  subtitle?: string;
  helper?: string;
  starter: string[];
  inputPlaceholder?: string;
  emptyMessage?: string;
}) {
  const [tasks, setTasks] = useLocalStore<Task[]>(
    storageKey,
    starter.map((text) => ({ id: uid(), text, done: false })),
  );
  const [draft, setDraft] = useState("");

  const normalize = (value: Task[] | Record<string, boolean>): Task[] =>
    Array.isArray(value)
      ? value
      : starter.map((text) => ({ id: uid(), text, done: Boolean(value[text]) }));

  const safeTasks = normalize(tasks as Task[] | Record<string, boolean>);

  useEffect(() => {
    if (!Array.isArray(tasks)) setTasks(normalize(tasks as unknown as Record<string, boolean>));
  }, [tasks, setTasks]);

  const done = safeTasks.filter((t) => t.done).length;

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks((prev) => [...normalize(prev), { id: uid(), text, done: false }]);
    setDraft("");
  };

  return (
    <section className="card-leaf fade-up p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold text-forest">{title}</h2>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {done}/{safeTasks.length} done
        </span>
      </div>
      {subtitle ? (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      ) : null}

      <form onSubmit={add} className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={inputPlaceholder}
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="submit"
          className="h-auto rounded-lg px-3 py-2"
        >
          <Plus className="size-4" /> Add
        </Button>
      </form>

      <ul className="mt-4 space-y-2">
        {safeTasks.length === 0 ? (
          <li>
            <Empty>{emptyMessage}</Empty>
          </li>
        ) : (
          safeTasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  setTasks((prev) =>
                    normalize(prev).map((p) =>
                      p.id === t.id ? { ...p, done: !p.done } : p,
                    ),
                  )
                }
                className="size-4 accent-[var(--moss)]"
                aria-label={`Mark ${t.text} complete`}
              />
              <span
                className={
                  t.done ? "flex-1 text-sm line-through opacity-60" : "flex-1 text-sm"
                }
              >
                {t.text}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Delete ${t.text}`}
                onClick={() =>
                  setTasks((prev) => normalize(prev).filter((p) => p.id !== t.id))
                }
                className="size-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))
        )}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {helper ? (
          <p className="text-xs text-muted-foreground">{helper}</p>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setTasks((prev) => normalize(prev).filter((p) => !p.done))}
          className="text-forest"
        >
          Clear completed
        </Button>
      </div>
    </section>
  );
}
