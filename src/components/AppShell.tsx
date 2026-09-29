import { Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", emoji: "🌿" },
  { to: "/skills", label: "Skills Developing", emoji: "🌱" },
  { to: "/sleep", label: "Sleep Tracker", emoji: "🌙" },
  { to: "/university", label: "University", emoji: "🎓" },
] as const;

const quickLinks = [
  { label: "Google", emoji: "🌐", url: "https://www.google.com" },
  { label: "YouTube", emoji: "📺", url: "https://www.youtube.com" },
  { label: "Gmail", emoji: "📧", url: "https://mail.google.com" },
  { label: "Claude AI", emoji: "🤖", url: "https://claude.ai" },
  { label: "Google Drive", emoji: "📁", url: "https://drive.google.com" },
  { label: "NotebookLM", emoji: "📒", url: "https://notebooklm.google.com" },
  { label: "Proton Drive", emoji: "🗂", url: "https://drive.proton.me" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
        🧭 Navigation
      </p>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === "/" }}
            activeProps={{
              className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <span aria-hidden>{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="my-4 border-t border-sidebar-border" />
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
        🔗 Quick Links
      </p>
      <div className="flex flex-col">
        {quickLinks.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noreferrer noopener"
            onClick={onNavigate}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <span aria-hidden>{l.emoji}</span>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-sidebar px-4 py-6 lg:flex">
        <div className="px-3 pb-6">
          <p className="font-display text-lg font-semibold text-sidebar-foreground">
            🌳 Eshan&apos;s Dashboard
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">
            Personal command center
          </p>
        </div>
        <SidebarContent />
        <p className="mt-auto px-3 pt-6 text-xs text-sidebar-foreground/50">
          Saved in this browser
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-sidebar px-4 py-3 lg:hidden">
          <span className="font-display font-semibold text-sidebar-foreground">
            🌳 Eshan&apos;s Dashboard
          </span>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open ? (
          <div className="sticky top-[52px] z-10 max-h-[calc(100vh-52px)] overflow-y-auto bg-sidebar px-4 pb-4 lg:hidden">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
