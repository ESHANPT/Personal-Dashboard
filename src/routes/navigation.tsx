import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/navigation")({
  head: () => ({
    meta: [
      { title: "Navigation — Eshan's Dashboard" },
      {
        name: "description",
        content:
          "Jump to skills, sleep tracking, university deadlines and everyday quick links.",
      },
      { property: "og:title", content: "Navigation — Eshan's Dashboard" },
      {
        property: "og:description",
        content: "Every corner of the dashboard, one tap away.",
      },
    ],
  }),
  component: NavigationPage,
});

const cards = [
  {
    to: "/skills",
    emoji: "🌱",
    title: "Skills Developing",
    desc: "Track what I'm learning and how far I've got.",
  },
  {
    to: "/sleep",
    emoji: "🌙",
    title: "Sleep Tracker",
    desc: "Log bedtime, wake time and weekly averages.",
  },
  {
    to: "/university",
    emoji: "🎓",
    title: "University",
    desc: "Semester 1 modules, assignments and deadlines.",
  },
  {
    to: "/",
    emoji: "🌿",
    title: "Dashboard",
    desc: "Back to today's tasks and reminders.",
  },
] as const;

const quickLinks = [
  { label: "Google", url: "https://www.google.com" },
  { label: "YouTube", url: "https://www.youtube.com" },
  { label: "Gmail", url: "https://mail.google.com" },
  { label: "Claude AI", url: "https://claude.ai" },
  { label: "Google Drive", url: "https://drive.google.com" },
  { label: "NotebookLM", url: "https://notebooklm.google.com" },
];

function NavigationPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        emoji="🧭"
        title="Navigation"
        subtitle="Pick a space to work in."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="card-leaf fade-up group p-6 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-3xl" aria-hidden>
              {c.emoji}
            </span>
            <h2 className="mt-3 text-xl font-semibold text-forest">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>

      <section className="card-leaf fade-up p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-forest">🔗 Quick Links</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent"
            >
              {l.label}
              <ExternalLink className="size-3.5" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
