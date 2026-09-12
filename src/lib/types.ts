export type RecurrenceRule =
  | { freq: "daily"; interval: number; dtstart: string; until?: string }
  | {
      freq: "weekly";
      interval: number;
      byweekday: number[]; // 0=Mon..6=Sun
      dtstart: string;
      until?: string;
    }
  | {
      freq: "custom";
      unit: "days" | "weeks";
      interval: number;
      dtstart: string;
      until?: string;
    };

export interface Routine {
  id: string;
  name: string;
  /** Emoji shown next to the name — suggested on-device, editable. */
  icon: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  routineId: string | null;
  sortOrder: number;
  isRecurring: boolean;
  recurrence: RecurrenceRule | null;
  /**
   * "YYYY-MM-DD" — which day this task belongs to on the Calendar. Always
   * set (defaults to the day it was created); meaningless/ignored for
   * recurring tasks, whose calendar placement comes from `recurrence`.
   */
  scheduledDate: string;
  /** "HH:MM", 24h, optional — when the task should happen. */
  dueTime: string | null;
  /** Rough estimate of how long it takes, optional. */
  estimatedMinutes: number | null;
  archived: boolean;
  createdAt: string;
}

export interface Completion {
  id: string;
  taskId: string;
  occurrenceDate: string; // YYYY-MM-DD
  completedAt: string;
}

/** Sentinel routineId used in the UI for tasks not in any routine. Never stored. */
export const UNGROUPED = "__ungrouped__";
