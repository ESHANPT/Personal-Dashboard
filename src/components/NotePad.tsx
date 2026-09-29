import { useEffect, useState } from "react";
import { useLocalStore } from "@/lib/local-store";

export function NotePad({
  storageKey,
  title,
  placeholder,
}: {
  storageKey: string;
  title: string;
  placeholder: string;
}) {
  const [text, setText, loaded] = useLocalStore<string>(storageKey, "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    setSaving(true);
    const t = setTimeout(() => setSaving(false), 400);
    return () => clearTimeout(t);
  }, [text, loaded]);

  return (
    <section className="card-leaf fade-up flex flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-forest">{title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {saving ? "Saving…" : "Saved ✓"}
          </span>
          <button
            onClick={() => {
              if (text && window.confirm(`Clear everything in ${title}?`)) setText("");
            }}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            Clear
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="mt-4 min-h-64 w-full flex-1 resize-y rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
      />
    </section>
  );
}
