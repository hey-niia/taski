import { RRule } from "rrule";
import type { RecurrenceRule, Task } from "./types";

/**
 * rrule.js works entirely in UTC internally — building/reading Date objects
 * any other way is the #1 source of off-by-one-day bugs near midnight/DST.
 * These two helpers are the ONLY place dates cross the rrule boundary.
 */
function parseUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatUTCDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const WEEKDAYS = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];

function toRRule(rule: RecurrenceRule): RRule {
  const dtstart = parseUTCDate(rule.dtstart);
  const until = rule.until ? parseUTCDate(rule.until) : undefined;

  if (rule.freq === "daily") {
    return new RRule({ freq: RRule.DAILY, interval: rule.interval, dtstart, until });
  }
  if (rule.freq === "weekly") {
    return new RRule({
      freq: RRule.WEEKLY,
      interval: rule.interval,
      byweekday: rule.byweekday.map((i) => WEEKDAYS[i]),
      dtstart,
      until,
    });
  }
  // custom
  return new RRule({
    freq: rule.unit === "days" ? RRule.DAILY : RRule.WEEKLY,
    interval: rule.interval,
    dtstart,
    until,
  });
}

export function occursOn(rule: RecurrenceRule, dateStr: string): boolean {
  const date = parseUTCDate(dateStr);
  const rr = toRRule(rule);
  const matches = rr.between(date, date, true);
  return matches.length > 0;
}

export function occurrencesBetween(
  rule: RecurrenceRule,
  startStr: string,
  endStr: string,
): string[] {
  const rr = toRRule(rule);
  const start = parseUTCDate(startStr);
  const end = parseUTCDate(endStr);
  return rr.between(start, end, true).map(formatUTCDate);
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDaysStr(dateStr: string, days: number): string {
  const date = parseUTCDate(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return formatUTCDate(date);
}

/**
 * Does this task belong on this date? Recurring tasks are driven by their
 * rule; one-off tasks by their single `scheduledDate` — the one place both
 * kinds of "when" are reconciled into a single check.
 */
export function taskOccursOn(task: Task, date: string): boolean {
  if (task.recurrence) return occursOn(task.recurrence, date);
  return task.scheduledDate === date;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function describeRecurrence(rule: RecurrenceRule): string {
  if (rule.freq === "daily") {
    return rule.interval === 1 ? "Every day" : `Every ${rule.interval} days`;
  }
  if (rule.freq === "weekly") {
    const days = rule.byweekday.map((i) => WEEKDAY_LABELS[i]).join(", ");
    const cadence = rule.interval === 1 ? "week" : `${rule.interval} weeks`;
    return days ? `Every ${cadence} on ${days}` : `Every ${cadence}`;
  }
  const unit = rule.interval === 1 ? rule.unit.slice(0, -1) : rule.unit;
  return `Every ${rule.interval} ${unit}`;
}
