export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, "0")}${period}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m}m`;
}

/** "Today" / "Tomorrow" / "Yesterday" / "Sep 15" relative to `today`. */
export function formatDateLabel(dateStr: string, today: string): string {
  if (dateStr === today) return "Today";
  const [ty, tm, td] = today.split("-").map(Number);
  const [y, m, d] = dateStr.split("-").map(Number);
  const diffDays = Math.round(
    (Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86_400_000,
  );
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
