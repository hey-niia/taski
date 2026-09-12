import { create } from "zustand";
import * as db from "../lib/db";
import { todayStr } from "../lib/recurrence";
import { suggestRoutineIcon } from "../lib/iconSuggester";
import type { Completion, RecurrenceRule, Routine, Task } from "../lib/types";

interface DataState {
  loaded: boolean;
  routines: Routine[];
  tasks: Task[];
  completions: Completion[];

  init: () => Promise<void>;

  addRoutine: (name: string) => Promise<void>;
  renameRoutine: (id: string, name: string) => Promise<void>;
  setRoutineIcon: (id: string, icon: string | null) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;

  addTask: (input: {
    title: string;
    routineId: string | null;
    recurrence: RecurrenceRule | null;
  }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  renameTask: (id: string, title: string) => Promise<void>;
  setTaskRecurrence: (id: string, recurrence: RecurrenceRule | null) => Promise<void>;
  setTaskSchedule: (
    id: string,
    schedule: { scheduledDate: string; dueTime: string | null; estimatedMinutes: number | null },
  ) => Promise<void>;

  /** Optimistic local reorder + persist — used by drag-and-drop drop handlers. */
  reorderTasks: (updates: { id: string; routineId: string | null; sortOrder: number }[]) => void;

  isCompletedOn: (taskId: string, date: string) => boolean;
  toggleCompletion: (taskId: string, date?: string) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  loaded: false,
  routines: [],
  tasks: [],
  completions: [],

  init: async () => {
    const [routines, tasks, completions] = await Promise.all([
      db.listRoutines(),
      db.listTasks(),
      db.listCompletionsBetween("0000-01-01", "9999-12-31"),
    ]);
    set({ routines, tasks, completions, loaded: true });
  },

  addRoutine: async (name) => {
    const routine = await db.createRoutine(name);
    set((s) => ({ routines: [...s.routines, routine] }));
    // Fire-and-forget: the routine appears instantly with no icon, and
    // quietly picks one up a moment later once the on-device model responds.
    // Never awaited/blocking — a slow or unavailable model should never hold
    // up adding a routine.
    void suggestRoutineIcon(name).then((icon) => {
      if (icon) get().setRoutineIcon(routine.id, icon);
    });
  },

  renameRoutine: async (id, name) => {
    await db.renameRoutine(id, name);
    set((s) => ({
      routines: s.routines.map((r) => (r.id === id ? { ...r, name } : r)),
    }));
  },

  setRoutineIcon: async (id, icon) => {
    await db.updateRoutineIcon(id, icon);
    set((s) => ({
      routines: s.routines.map((r) => (r.id === id ? { ...r, icon } : r)),
    }));
  },

  deleteRoutine: async (id) => {
    await db.deleteRoutine(id);
    set((s) => ({
      routines: s.routines.filter((r) => r.id !== id),
      tasks: s.tasks.map((t) => (t.routineId === id ? { ...t, routineId: null } : t)),
    }));
  },

  addTask: async ({ title, routineId, recurrence }) => {
    const task = await db.createTask({ title, routineId, recurrence });
    set((s) => ({ tasks: [...s.tasks, task] }));
  },

  deleteTask: async (id) => {
    await db.deleteTask(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  renameTask: async (id, title) => {
    await db.renameTask(id, title);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, title } : t)),
    }));
  },

  setTaskRecurrence: async (id, recurrence) => {
    await db.updateTaskRecurrence(id, recurrence);
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, recurrence, isRecurring: recurrence !== null } : t,
      ),
    }));
  },

  setTaskSchedule: async (id, schedule) => {
    await db.updateTaskSchedule(id, schedule);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...schedule } : t)),
    }));
  },

  reorderTasks: (updates) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        const u = updates.find((x) => x.id === t.id);
        return u ? { ...t, routineId: u.routineId, sortOrder: u.sortOrder } : t;
      }),
    }));
    void db.reorderTasks(updates);
  },

  isCompletedOn: (taskId, date) => {
    return get().completions.some((c) => c.taskId === taskId && c.occurrenceDate === date);
  },

  toggleCompletion: async (taskId, date) => {
    const occurrenceDate = date ?? todayStr();
    const wasDone = get().isCompletedOn(taskId, occurrenceDate);
    await db.setCompletion(taskId, occurrenceDate, !wasDone);
    set((s) => ({
      completions: wasDone
        ? s.completions.filter(
            (c) => !(c.taskId === taskId && c.occurrenceDate === occurrenceDate),
          )
        : [
            ...s.completions,
            {
              id: `${taskId}-${occurrenceDate}`,
              taskId,
              occurrenceDate,
              completedAt: new Date().toISOString(),
            },
          ],
    }));
  },
}));
