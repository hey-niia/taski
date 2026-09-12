import { useNavStore } from "../../app/store";
import ThemePicker from "./ThemePicker";

export default function AppMenu({ active }: { active: "main" | "calendar" }) {
  const goTo = useNavStore((s) => s.goTo);
  const openHowItWorks = useNavStore((s) => s.openHowItWorks);

  return (
    <div className="flex items-center justify-between px-8 pt-8 pb-4">
      <span className="font-serif text-xl tracking-tight">Taski</span>

      <div className="flex items-center gap-1">
        <div className="bg-paper-raised border-line flex rounded-full border p-1">
          <button
            type="button"
            onClick={() => goTo("main")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === "main" ? "bg-accent text-accent-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => goTo("calendar")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === "calendar" ? "bg-accent text-accent-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            Calendar
          </button>
        </div>

        <span className="ml-2">
          <ThemePicker />
        </span>

        <button
          type="button"
          onClick={openHowItWorks}
          aria-label="How Taski works"
          className="text-ink-soft hover:bg-paper-raised hover:text-ink flex h-8 w-8 items-center justify-center rounded-full"
        >
          ?
        </button>
      </div>
    </div>
  );
}
