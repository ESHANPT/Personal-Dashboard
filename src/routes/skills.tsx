import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus, Search } from "lucide-react";
import { Empty, PageHeader } from "@/components/PageHeader";
import { uid, useLocalStore } from "@/lib/local-store";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills Developing — Eshan's Dashboard" },
      {
        name: "description",
        content:
          "A Notion-style table of skills in progress: Python, cybersecurity, AI and Spanish with status, dates, links and notes.",
      },
      { property: "og:title", content: "Skills Developing — Eshan's Dashboard" },
      {
        property: "og:description",
        content: "Track status, dates, links and notes for every skill I'm building.",
      },
    ],
  }),
  component: SkillsPage,
});

const statuses = ["Not started", "In progress", "On Hold", "Done"] as const;
type Status = (typeof statuses)[number];
type Skill = {
  id: string;
  name: string;
  status: Status;
  date: string;
  link: string;
  notes: string;
};

const pill: Record<Status, string> = {
  "Not started": "bg-pill-grey text-pill-grey-fg",
  "In progress": "bg-pill-blue text-pill-blue-fg",
  "On Hold": "bg-pill-yellow text-pill-yellow-fg",
  Done: "bg-pill-green text-pill-green-fg",
};

const blank = (name = ""): Skill => ({
  id: uid(),
  name,
  status: "Not started",
  date: "",
  link: "",
  notes: "",
});

const starter: Skill[] = [
  { ...blank("Python"), status: "In progress" },
  { ...blank("Cybersecurity"), status: "Not started" },
  { ...blank("AI for Everyone"), status: "On Hold" },
  { ...blank("Spanish"), status: "In progress" },
];

const cell =
  "w-full rounded-md bg-transparent px-2 py-1.5 text-sm outline-none hover:bg-muted/60 focus:bg-muted/60 focus:ring-1 focus:ring-ring";

function LinkCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  if (editing || !value) {
    return (
      <input
        autoFocus={editing}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        placeholder="Add link"
        aria-label="Link"
        className={cell}
      />
    );
  }
  const href = /^https?:\/\//.test(value) ? value : `https://${value}`;
  return (
    <div className="flex items-center gap-1 px-2 py-1.5">
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="truncate text-sm text-moss underline underline-offset-2"
      >
        {value}
      </a>
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-muted-foreground hover:text-forest"
      >
        edit
      </button>
    </div>
  );
}

function SkillsPage() {
  const [skills, setSkills] = useLocalStore<Skill[]>("eshan.skills.v2", starter);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | Status>("All");

  const update = (id: string, patch: Partial<Skill>) =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const add = () => setSkills((prev) => [...prev, blank("")]);

  const shown = skills.filter(
    (s) =>
      (filter === "All" || s.status === filter) &&
      (s.name + " " + s.notes).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🌱"
        title="Skills Developing"
        subtitle="What I'm growing right now, and where each one stands."
      />

      <div className="fade-up flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search skills…"
            className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "All" | Status)}
          aria-label="Filter by status"
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="All">All statuses</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button
          onClick={add}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" /> New skill
        </button>
      </div>

      <div className="card-leaf fade-up overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="w-[22%] px-3 py-3 font-medium">Name</th>
              <th className="w-[16%] px-3 py-3 font-medium">Status</th>
              <th className="w-[15%] px-3 py-3 font-medium">Date</th>
              <th className="w-[20%] px-3 py-3 font-medium">Link</th>
              <th className="px-3 py-3 font-medium">Notes</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id} className="group border-b border-border/70 hover:bg-muted/30">
                <td className="px-1 py-1">
                  <input
                    value={s.name}
                    onChange={(e) => update(s.id, { name: e.target.value })}
                    placeholder="Untitled"
                    aria-label="Skill name"
                    className={`${cell} font-medium text-forest`}
                  />
                </td>
                <td className="px-2 py-1">
                  <select
                    value={s.status}
                    onChange={(e) => update(s.id, { status: e.target.value as Status })}
                    aria-label="Status"
                    className={`cursor-pointer appearance-none rounded-full px-3 py-1 text-xs font-medium outline-none ${pill[s.status]}`}
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-1 py-1">
                  <input
                    type="date"
                    value={s.date}
                    onChange={(e) => update(s.id, { date: e.target.value })}
                    aria-label="Date"
                    className={cell}
                  />
                </td>
                <td className="px-1 py-1">
                  <LinkCell value={s.link} onChange={(v) => update(s.id, { link: v })} />
                </td>
                <td className="px-1 py-1">
                  <input
                    value={s.notes}
                    onChange={(e) => update(s.id, { notes: e.target.value })}
                    placeholder="Add notes"
                    aria-label="Notes"
                    className={cell}
                  />
                </td>
                <td className="px-1 py-1 text-center">
                  <button
                    aria-label={`Delete ${s.name || "skill"}`}
                    onClick={() => setSkills((prev) => prev.filter((p) => p.id !== s.id))}
                    className="rounded-md p-1 text-muted-foreground opacity-60 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 ? (
          <div className="p-4">
            <Empty>
              {skills.length === 0
                ? "Nothing here yet, add your first skill 🌱"
                : "No skills match your search 🍃"}
            </Empty>
          </div>
        ) : null}
        <button
          onClick={add}
          className="flex w-full items-center gap-1 px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/40 hover:text-forest"
        >
          <Plus className="size-4" /> New
        </button>
      </div>
    </div>
  );
}
