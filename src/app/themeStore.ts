import { create } from "zustand";
import { getSetting, setSetting } from "../lib/db";

export const THEMES = ["paper", "clay", "sky", "dusk"] as const;
export type ThemeName = (typeof THEMES)[number];

function isThemeName(value: string | null): value is ThemeName {
  return THEMES.includes(value as ThemeName);
}

function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute("data-theme", theme);
}

interface ThemeState {
  theme: ThemeName;
  init: () => Promise<void>;
  setTheme: (theme: ThemeName) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "paper",

  init: async () => {
    const stored = await getSetting("theme");
    const theme = isThemeName(stored)
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dusk"
        : "paper";
    applyTheme(theme);
    set({ theme });
  },

  setTheme: async (theme) => {
    applyTheme(theme);
    set({ theme });
    await setSetting("theme", theme);
  },
}));
