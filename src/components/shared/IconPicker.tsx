import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import emojilib from "emojilib";

const ALL_EMOJIS = Object.entries(emojilib as Record<string, string[]>).map(([emoji, keywords]) => ({
  emoji,
  keywords,
}));

/**
 * Suggested on-device (Apple Intelligence) when a routine is created, but
 * always editable by hand — a searchable grid over the full emoji set,
 * like the macOS emoji finder or Slack's picker, rather than a curated
 * handful or a text field pretending to be a picker.
 */
export default function IconPicker({
  icon,
  onChange,
}: {
  icon: string | null;
  onChange: (icon: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_EMOJIS;
    return ALL_EMOJIS.filter((e) => e.keywords.some((k) => k.includes(q)));
  }, [query]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={icon ? "Change icon" : "Set an icon"}
        aria-expanded={open}
        className={`hover:bg-accent-soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base ${
          icon ? "" : "border-ink-faint text-ink-faint border border-dashed"
        }`}
      >
        {icon ?? "+"}
      </button>

      {open && (
        <>
          {/* Click-away layer */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="bg-paper-raised rounded-control shadow-card absolute top-9 left-0 z-20 w-72 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search emoji"
              className="border-line bg-paper text-ink mb-2 w-full rounded-full border px-3 py-1.5 text-sm outline-none"
            />
            <div className="grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto overflow-x-hidden">
              {results.map(({ emoji, keywords }) => (
                <button
                  key={emoji}
                  type="button"
                  title={keywords[0]?.replace(/_/g, " ")}
                  onClick={() => {
                    onChange(emoji);
                    setOpen(false);
                  }}
                  aria-label={keywords[0]?.replace(/_/g, " ") ?? emoji}
                  aria-pressed={icon === emoji}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors ${
                    icon === emoji ? "bg-accent-soft" : "hover:bg-paper"
                  }`}
                >
                  {emoji}
                </button>
              ))}
              {results.length === 0 && (
                <p className="text-ink-faint col-span-8 py-3 text-center text-xs">No emoji found</p>
              )}
            </div>
            {icon && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="text-ink-faint hover:text-ink-soft mt-1 w-full pt-1 text-left text-xs"
              >
                Remove icon
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
