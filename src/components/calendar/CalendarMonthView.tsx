import { todayStr } from "../../lib/recurrence";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarMonthView({
  year,
  month, // 0-11
  onPrevMonth,
  onNextMonth,
  markedDates,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  markedDates: Set<string>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = todayStr();

  const cells: (string | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${year}-${pad(month + 1)}-${pad(i + 1)}`),
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="text-ink-soft hover:text-ink px-2 py-1"
        >
          ‹
        </button>
        <span className="text-sm font-medium">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="text-ink-soft hover:text-ink px-2 py-1"
        >
          ›
        </button>
      </div>

      <div className="text-ink-faint mb-1 grid grid-cols-7 text-center text-xs">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
        {cells.map((date, i) => {
          if (!date) return <span key={i} />;
          const isToday = date === today;
          const isSelected = date === selectedDate;
          const hasMark = markedDates.has(date);
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full ${
                isSelected
                  ? "bg-accent text-accent-ink"
                  : isToday
                    ? "text-accent font-semibold"
                    : "text-ink hover:bg-accent-soft"
              }`}
            >
              {Number(date.slice(-2))}
              {hasMark && !isSelected && (
                <span className="bg-accent absolute bottom-0.5 h-1 w-1 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
