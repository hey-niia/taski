import { WEEKDAY_LABELS, todayStr } from "../../lib/recurrence";
import type { RecurrenceRule } from "../../lib/types";

function mondayIndexOfToday(): number {
  const jsDay = new Date().getDay(); // 0=Sun..6=Sat
  return (jsDay + 6) % 7; // 0=Mon..6=Sun
}

const OPTIONS = [
  { key: "none", label: "Does not repeat" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "custom", label: "Custom" },
] as const;

function kindOf(rule: RecurrenceRule | null): (typeof OPTIONS)[number]["key"] {
  if (!rule) return "none";
  if (rule.freq === "daily" && rule.interval === 1) return "daily";
  if (rule.freq === "weekly" && rule.interval === 1) return "weekly";
  return "custom";
}

export default function RecurrencePicker({
  value,
  onChange,
}: {
  value: RecurrenceRule | null;
  onChange: (rule: RecurrenceRule | null) => void;
}) {
  const kind = kindOf(value);

  function pick(key: (typeof OPTIONS)[number]["key"]) {
    const dtstart = todayStr();
    if (key === "none") return onChange(null);
    if (key === "daily") return onChange({ freq: "daily", interval: 1, dtstart });
    if (key === "weekly")
      return onChange({
        freq: "weekly",
        interval: 1,
        byweekday: [mondayIndexOfToday()],
        dtstart,
      });
    return onChange({ freq: "custom", unit: "days", interval: 2, dtstart });
  }

  return (
    <div className="bg-paper-raised rounded-control shadow-card mt-2 p-3">
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => pick(o.key)}
            className={`rounded-chip px-3 py-1.5 text-sm transition-colors ${
              kind === o.key
                ? "bg-accent text-accent-ink"
                : "bg-paper text-ink-soft hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {kind === "weekly" && value?.freq === "weekly" && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {WEEKDAY_LABELS.map((label, i) => {
            const selected = value.byweekday.includes(i);
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const byweekday = selected
                    ? value.byweekday.filter((d) => d !== i)
                    : [...value.byweekday, i].sort();
                  if (byweekday.length === 0) return; // never allow zero days selected
                  onChange({ ...value, byweekday });
                }}
                className={`h-9 w-9 rounded-full text-xs font-medium transition-colors ${
                  selected
                    ? "bg-accent text-accent-ink"
                    : "bg-paper text-ink-soft hover:text-ink"
                }`}
              >
                {label[0]}
              </button>
            );
          })}
        </div>
      )}

      {kind === "custom" && value?.freq === "custom" && (
        <div className="text-ink-soft mt-3 flex items-center gap-2 text-sm">
          <span>Every</span>
          <input
            type="number"
            min={2}
            value={value.interval}
            onChange={(e) =>
              onChange({ ...value, interval: Math.max(1, Number(e.target.value)) })
            }
            className="border-line bg-paper w-14 rounded-md border px-2 py-1 text-center"
          />
          <select
            value={value.unit}
            onChange={(e) => onChange({ ...value, unit: e.target.value as "days" | "weeks" })}
            className="border-line bg-paper rounded-md border px-2 py-1"
          >
            <option value="days">days</option>
            <option value="weeks">weeks</option>
          </select>
        </div>
      )}
    </div>
  );
}
