import { taskOccursOn, todayStr } from "../../lib/recurrence";
import { useDataStore } from "../../app/dataStore";
import EmptyState from "../shared/EmptyState";
import OccurrenceRow from "./OccurrenceRow";

function formatLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DayDetailPanel({ date }: { date: string }) {
  const tasks = useDataStore((s) => s.tasks);
  const completions = useDataStore((s) => s.completions);

  const due = tasks.filter((t) => taskOccursOn(t, date));

  // A task completed on this exact date but scheduled/recurring elsewhere
  // (e.g. checked off a day late) still belongs in this day's history.
  const dueIds = new Set(due.map((t) => t.id));
  const completedElsewhere = completions
    .filter((c) => c.occurrenceDate === date && !dueIds.has(c.taskId))
    .map((c) => tasks.find((t) => t.id === c.taskId))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const isPast = date < todayStr();
  const rows = [...due, ...completedElsewhere];

  return (
    <div className="mt-5">
      <p className="text-ink-soft mb-2 text-xs font-medium tracking-wide uppercase">
        {formatLong(date)}
      </p>
      {rows.length === 0 ? (
        <EmptyState>
          {isPast ? "Nothing logged for this day." : "Nothing scheduled for this day yet."}
        </EmptyState>
      ) : (
        <div>
          {rows.map((t) => (
            <OccurrenceRow key={t.id} task={t} date={date} />
          ))}
        </div>
      )}
    </div>
  );
}
