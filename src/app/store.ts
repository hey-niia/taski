import { create } from "zustand";

export type Screen = "loading" | "intro" | "how-it-works" | "main" | "calendar";

interface NavState {
  screen: Screen;
  returnTo: Screen;
  goTo: (screen: Screen) => void;
  openHowItWorks: () => void;
  closeHowItWorks: () => void;
}

export const useNavStore = create<NavState>((set, get) => ({
  screen: "loading",
  returnTo: "main",
  goTo: (screen) => set({ screen }),
  openHowItWorks: () => set({ returnTo: get().screen, screen: "how-it-works" }),
  closeHowItWorks: () => set({ screen: get().returnTo }),
}));
