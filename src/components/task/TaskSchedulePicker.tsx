import { addDaysStr, todayStr } from "../../lib/recurrence";
import { formatDateLabel } from "../../lib/format";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = [0, 15, 30, 45];
type Period = "AM" | "PM";

function to12h(dueTime: string): { hour: number; minute: number; period: Period } {
  const [h, m] = dueTime.split(":").map(Number);
  const period: Period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return { hour, minute: m, period };
}

function to24h(hour: number, minute: number, period: Period): string {
  const h = period === "PM" ? (hour % 12) + 12 : hour % 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const selectClass = "border-line bg-paper rounded-md border py-1 pl-2 pr-1";

interface Schedule {
  scheduledDate: string;
  dueTime: string | null;
  estimatedMinutes: number | null;
}

export default function TaskSchedulePicker({
  scheduledDate,
  isRecurring,
  dueTime,
  estimatedMinutes,
  onChange,
}: {
  scheduledDate: string;
  isRecurring: boolean;
  dueTime: string | null;
  estimatedMinutes: number | null;
  onChange: (schedule: Schedule) => void;
}) {
  const parsed = dueTime ? to12h(dueTime) : null;
  const today = todayStr();

  function updateTime(hour: number, minute: number, period: Period) {
    onChange({ scheduledDate, dueTime: to24h(hour, minute, period), estimatedMinutes });
  }

  return (
    <div className="bg-paper-raised rounded-control shadow-card mt-2 flex flex-col gap-2 p-3">
      {!isRecurring && (
        <div className="text-ink-soft flex items-center gap-2 text-sm">
          <span>On</span>
          <button
            type="button"
            onClick={() => onChange({ scheduledDate: addDaysStr(scheduledDate, -1), dueTime, estimatedMinutes })}
            aria-label="Previous day"
            className="text-ink-faint hover:text-ink-soft px-1"
          >
            ‹
          </button>
          <span className="min-w-16 text-center">{formatDateLabel(scheduledDate, today)}</span>
          <button
            type="button"
            onClick={() => onChange({ scheduledDate: addDaysStr(scheduledDate, 1), dueTime, estimatedMinutes })}
            aria-label="Next day"
            className="text-ink-faint hover:text-ink-soft px-1"
          >
            ›
          </button>
          {scheduledDate !== today && (
            <button
              type="button"
              onClick={() => onChange({ scheduledDate: today, dueTime, estimatedMinutes })}
              className="text-accent text-xs underline"
            >
              Today
            </button>
          )}
        </div>
      )}

      <div className="text-ink-soft flex items-center gap-2 text-sm">
        <span>At</span>
        {parsed ? (
          <>
            <select
              value={parsed.hour}
              onChange={(e) => updateTime(Number(e.target.value), parsed.minute, parsed.period)}
              className={selectClass}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              value={parsed.minute}
              onChange={(e) => updateTime(parsed.hour, Number(e.target.value), parsed.period)}
              className={selectClass}
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
            <select
              value={parsed.period}
              onChange={(e) => updateTime(parsed.hour, parsed.minute, e.target.value as Period)}
              className={selectClass}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
            <button
              type="button"
              onClick={() => onChange({ scheduledDate, dueTime: null, estimatedMinutes })}
              aria-label="Remove time"
              className="text-ink-faint hover:text-ink-soft"
            >
              ×
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => updateTime(9, 0, "AM")}
            className="text-accent text-sm underline"
          >
            Set a time
          </button>
        )}
      </div>

      <label className="text-ink-soft flex items-center gap-2 text-sm">
        Takes about
        <input
          type="number"
          min={0}
          step={5}
          placeholder="—"
          value={estimatedMinutes ?? ""}
          onChange={(e) =>
            onChange({
              scheduledDate,
              dueTime,
              estimatedMinutes: e.target.value ? Number(e.target.value) : null,
            })
          }
          className="border-line bg-paper w-16 rounded-md border px-2 py-1 text-center"
        />
        min
        {estimatedMinutes !== null && (
          <button
            type="button"
            onClick={() => onChange({ scheduledDate, dueTime, estimatedMinutes: null })}
            aria-label="Remove time estimate"
            className="text-ink-faint hover:text-ink-soft"
          >
            ×
          </button>
        )}
      </label>
    </div>
  );
}
