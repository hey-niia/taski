import { addDaysStr, taskOccursOn, todayStr } from "../../lib/recurrence";
import { useDataStore } from "../../app/dataStore";
import EmptyState from "../shared/EmptyState";
import OccurrenceRow from "./OccurrenceRow";

const WEEKDAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function labelFor(date: string, today: string): string {
  if (date === today) return "Today";
  if (date === addDaysStr(today, 1)) return "Tomorrow";
  const [y, m, d] = date.split("-").map(Number);
  return `${WEEKDAY_FULL[new Date(y, m - 1, d).getDay()]}, ${m}/${d}`;
}

export default function UpcomingList() {
  const tasks = useDataStore((s) => s.tasks);
  const today = todayStr();
  const days = Array.from({ length: 7 }, (_, i) => addDaysStr(today, i));

  const hasAny = days.some((date) => tasks.some((t) => taskOccursOn(t, date)));

  if (!hasAny) {
    return (
      <EmptyState>
        Nothing scheduled yet. Add a time or "Repeat" to a task on the Today screen and it'll
        show up here.
      </EmptyState>
    );
  }

  return (
    <div className="divide-line divide-y">
      {days.map((date) => {
        const dueTasks = tasks.filter((t) => taskOccursOn(t, date));
        if (dueTasks.length === 0) return null;
        return (
          <div key={date} className="py-3">
            <p className="text-ink-soft mb-1 text-xs font-medium tracking-wide uppercase">
              {labelFor(date, today)}
            </p>
            {dueTasks.map((t) => (
              <OccurrenceRow key={t.id} task={t} date={date} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
