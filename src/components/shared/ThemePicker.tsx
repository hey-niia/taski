import { useState } from "react";
import { useThemeStore, THEMES, type ThemeName } from "../../app/themeStore";
import PaletteIcon from "./PaletteIcon";

const THEME_META: Record<ThemeName, { label: string; paper: string; accent: string }> = {
  paper: { label: "Paper", paper: "#faf6f0", accent: "#5f7a5f" },
  clay: { label: "Clay", paper: "#faf3ec", accent: "#b5714f" },
  sky: { label: "Sky", paper: "#f5f6f7", accent: "#5b7f9e" },
  dusk: { label: "Dusk", paper: "#201d1a", accent: "#86a687" },
};

export default function ThemePicker() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        aria-expanded={open}
        className="text-ink-soft hover:bg-paper-raised hover:text-ink flex h-8 w-8 items-center justify-center rounded-full"
      >
        <PaletteIcon />
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
          <div className="border-line bg-paper-raised rounded-control absolute top-10 right-0 z-20 flex gap-2 border p-2 shadow-lg">
            {THEMES.map((name) => {
              const meta = THEME_META[name];
              const active = theme === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setTheme(name);
                    setOpen(false);
                  }}
                  aria-pressed={active}
                  aria-label={meta.label}
                  title={meta.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                    active ? "border-accent" : "border-transparent"
                  }`}
                  style={{ background: meta.paper }}
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ background: meta.accent }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
