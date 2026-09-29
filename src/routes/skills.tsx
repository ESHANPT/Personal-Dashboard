import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Empty, PageHeader } from "@/components/PageHeader";
import { uid, useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills Developing — Eshan's Dashboard" },
      {
        name: "description",
        content:
          "Python, cybersecurity, AI and Spanish: status and progress on every skill in progress.",
      },
      { property: "og:title", content: "Skills Developing — Eshan's Dashboard" },
      {
        property: "og:description",
        content: "Track status and progress for every skill I'm building.",
      },
    ],
  }),
  component: SkillsPage,
});

const statuses = ["Not started", "In progress", "On hold", "Completed"] as const;
type Status = (typeof statuses)[number];
type Skill = { id: string; name: string; status: Status; progress: number };

const starter: Skill[] = [
  { id: uid(), name: "Python", status: "In progress", progress: 45 },
  { id: uid(), name: "Cybersecurity", status: "In progress", progress: 25 },
  { id: uid(), name: "AI for Everyone", status: "Not started", progress: 0 },
  { id: uid(), name: "Spanish", status: "On hold", progress: 15 },
];

function SkillsPage() {
  const [skills, setSkills] = useLocalStore<Skill[]>("eshan.skills", starter);
  const [draft, setDraft] = useState("");

  const update = (id: string, patch: Partial<Skill>) =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌱"
        title="Skills Developing"
        subtitle="What I'm growing right now, and how far along each one is."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = draft.trim();
          if (!name) return;
          setSkills((prev) => [
            ...prev,
            { id: uid(), name, status: "Not started", progress: 0 },
          ]);
          setDraft("");
        }}
        className="card-leaf fade-up flex gap-2 p-4"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a skill…"
          className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="size-4" /> Add
        </button>
      </form>

      {skills.length === 0 ? (
        <Empty>Nothing here yet, add your first skill 🌱</Empty>
      ) : (
        <div className="space-y-4">
          {skills.map((s) => (
            <article key={s.id} className="card-leaf fade-up p-5">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={s.name}
                  onChange={(e) => update(s.id, { name: e.target.value })}
                  aria-label="Skill name"
                  className="min-w-0 flex-1 rounded-lg bg-transparent px-1 py-1 font-display text-lg font-semibold text-forest outline-none focus:bg-muted/60"
                />
                <select
                  value={s.status}
                  onChange={(e) =>
                    update(s.id, { status: e.target.value as Status })
                  }
                  aria-label="Status"
                  className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <button
                  aria-label={`Delete ${s.name}`}
                  onClick={() =>
                    setSkills((prev) => prev.filter((p) => p.id !== s.id))
                  }
                  className="rounded-md p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={s.progress}
                  onChange={(e) =>
                    update(s.id, { progress: Number(e.target.value) })
                  }
                  aria-label={`${s.name} progress`}
                  className="flex-1 accent-[var(--moss)]"
                />
                <span className="w-12 text-right text-sm text-muted-foreground">
                  {s.progress}%
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
