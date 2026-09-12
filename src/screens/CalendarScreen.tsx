import { useMemo, useState } from "react";
import AppMenu from "../components/shared/AppMenu";
import CalendarMonthView from "../components/calendar/CalendarMonthView";
import DayDetailPanel from "../components/calendar/DayDetailPanel";
import UpcomingList from "../components/calendar/UpcomingList";
import { useDataStore } from "../app/dataStore";
import { occurrencesBetween, todayStr } from "../lib/recurrence";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function CalendarScreen() {
  const [view, setView] = useState<"upcoming" | "month">("upcoming");
  const today = todayStr();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const tasks = useDataStore((s) => s.tasks);
  const completions = useDataStore((s) => s.completions);

  const markedDates = useMemo(() => {
    const start = `${year}-${pad(month + 1)}-01`;
    const end = `${year}-${pad(month + 1)}-${pad(new Date(year, month + 1, 0).getDate())}`;
    const marks = new Set<string>();
    for (const c of completions) {
      if (c.occurrenceDate >= start && c.occurrenceDate <= end) marks.add(c.occurrenceDate);
    }
    for (const t of tasks) {
      if (t.recurrence) {
        for (const d of occurrencesBetween(t.recurrence, start, end)) marks.add(d);
      } else if (t.scheduledDate >= start && t.scheduledDate <= end) {
        marks.add(t.scheduledDate);
      }
    }
    return marks;
  }, [tasks, completions, year, month]);

  function changeMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  }

  return (
    <div className="bg-paper min-h-screen">
      <AppMenu active="calendar" />

      <main className="mx-auto max-w-xl px-6 pb-16">
        <div className="rounded-card bg-paper-raised shadow-card p-5">
          <div className="border-line mb-4 flex items-center gap-6 border-b">
            {(["upcoming", "month"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`relative pb-3 text-sm transition-colors ${
                  view === v ? "text-ink font-medium" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {v === "upcoming" ? "Upcoming" : "Month"}
                {view === v && (
                  <span className="bg-accent absolute right-0 -bottom-px left-0 h-0.5 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {view === "upcoming" ? (
            <UpcomingList />
          ) : (
            <>
              <CalendarMonthView
                year={year}
                month={month}
                onPrevMonth={() => changeMonth(-1)}
                onNextMonth={() => changeMonth(1)}
                markedDates={markedDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <DayDetailPanel date={selectedDate} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
