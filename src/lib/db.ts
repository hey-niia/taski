import Database from "@tauri-apps/plugin-sql";
import { todayStr } from "./recurrence";
import type { Completion, RecurrenceRule, Routine, Task } from "./types";

let dbPromise: Promise<Database> | null = null;

function getDb(): Promise<Database> {
  if (!dbPromise) dbPromise = Database.load("sqlite:taski.db");
  return dbPromise;
}

function uid(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

// --- row <-> domain mapping -------------------------------------------------

interface RoutineRow {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

function routineFromRow(r: RoutineRow): Routine {
  return {
    id: r.id,
    name: r.name,
    icon: r.icon,
    sortOrder: r.sort_order,
    createdAt: r.created_at,
  };
}

interface TaskRow {
  id: string;
  title: string;
  notes: string | null;
  routine_id: string | null;
  sort_order: number;
  is_recurring: number;
  recurrence_json: string | null;
  scheduled_date: string | null;
  due_time: string | null;
  estimated_minutes: number | null;
  archived: number;
  created_at: string;
}

function taskFromRow(r: TaskRow): Task {
  return {
    id: r.id,
    title: r.title,
    notes: r.notes,
    routineId: r.routine_id,
    sortOrder: r.sort_order,
    isRecurring: r.is_recurring === 1,
    recurrence: r.recurrence_json ? (JSON.parse(r.recurrence_json) as RecurrenceRule) : null,
    // Rows created before this column existed have no scheduled_date — treat
    // them as "today" rather than leaving the domain type nullable everywhere.
    scheduledDate: r.scheduled_date ?? todayStr(),
    dueTime: r.due_time,
    estimatedMinutes: r.estimated_minutes,
    archived: r.archived === 1,
    createdAt: r.created_at,
  };
}

interface CompletionRow {
  id: string;
  task_id: string;
  occurrence_date: string;
  completed_at: string;
}

function completionFromRow(r: CompletionRow): Completion {
  return {
    id: r.id,
    taskId: r.task_id,
    occurrenceDate: r.occurrence_date,
    completedAt: r.completed_at,
  };
}

// --- settings ----------------------------------------------------------------

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db.select<{ value: string }[]>(
    "SELECT value FROM settings WHERE key = ?",
    [key],
  );
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.execute(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, value],
  );
}

// --- routines ------------------------------------------------------------------

export async function listRoutines(): Promise<Routine[]> {
  const db = await getDb();
  const rows = await db.select<RoutineRow[]>("SELECT * FROM routines ORDER BY sort_order ASC");
  return rows.map(routineFromRow);
}

export async function createRoutine(name: string): Promise<Routine> {
  const db = await getDb();
  const existing = await db.select<{ n: number }[]>(
    "SELECT COUNT(*) as n FROM routines",
  );
  const routine: Routine = {
    id: uid(),
    name,
    icon: null,
    sortOrder: existing[0]?.n ?? 0,
    createdAt: nowIso(),
  };
  await db.execute(
    "INSERT INTO routines (id, name, icon, sort_order, created_at) VALUES (?, ?, ?, ?, ?)",
    [routine.id, routine.name, routine.icon, routine.sortOrder, routine.createdAt],
  );
  return routine;
}

export async function updateRoutineIcon(id: string, icon: string | null): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE routines SET icon = ? WHERE id = ?", [icon, id]);
}

export async function deleteRoutine(id: string): Promise<void> {
  const db = await getDb();
  // tasks in this routine fall back to ungrouped (routine_id NULL), not deleted
  await db.execute("UPDATE tasks SET routine_id = NULL WHERE routine_id = ?", [id]);
  await db.execute("DELETE FROM routines WHERE id = ?", [id]);
}

export async function renameRoutine(id: string, name: string): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE routines SET name = ? WHERE id = ?", [name, id]);
}

// --- tasks -----------------------------------------------------------------

export async function listTasks(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.select<TaskRow[]>(
    "SELECT * FROM tasks WHERE archived = 0 ORDER BY sort_order ASC",
  );
  return rows.map(taskFromRow);
}

export async function createTask(input: {
  title: string;
  routineId: string | null;
  recurrence: RecurrenceRule | null;
}): Promise<Task> {
  const db = await getDb();
  const siblings = await db.select<{ n: number }[]>(
    input.routineId
      ? "SELECT COUNT(*) as n FROM tasks WHERE routine_id = ? AND archived = 0"
      : "SELECT COUNT(*) as n FROM tasks WHERE routine_id IS NULL AND archived = 0",
    input.routineId ? [input.routineId] : [],
  );
  const task: Task = {
    id: uid(),
    title: input.title,
    notes: null,
    routineId: input.routineId,
    sortOrder: siblings[0]?.n ?? 0,
    isRecurring: input.recurrence !== null,
    recurrence: input.recurrence,
    scheduledDate: todayStr(),
    dueTime: null,
    estimatedMinutes: null,
    archived: false,
    createdAt: nowIso(),
  };
  await db.execute(
    `INSERT INTO tasks (id, title, notes, routine_id, sort_order, is_recurring, recurrence_json, scheduled_date, due_time, estimated_minutes, archived, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    [
      task.id,
      task.title,
      task.notes,
      task.routineId,
      task.sortOrder,
      task.isRecurring ? 1 : 0,
      task.recurrence ? JSON.stringify(task.recurrence) : null,
      task.scheduledDate,
      task.dueTime,
      task.estimatedMinutes,
      task.createdAt,
    ],
  );
  return task;
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
}

export async function updateTaskRecurrence(
  id: string,
  recurrence: RecurrenceRule | null,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE tasks SET is_recurring = ?, recurrence_json = ? WHERE id = ?",
    [recurrence ? 1 : 0, recurrence ? JSON.stringify(recurrence) : null, id],
  );
}

export async function updateTaskSchedule(
  id: string,
  schedule: { scheduledDate: string; dueTime: string | null; estimatedMinutes: number | null },
): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE tasks SET scheduled_date = ?, due_time = ?, estimated_minutes = ? WHERE id = ?",
    [schedule.scheduledDate, schedule.dueTime, schedule.estimatedMinutes, id],
  );
}

export async function renameTask(id: string, title: string): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE tasks SET title = ? WHERE id = ?", [title, id]);
}

/** Persists the result of a drag-drop reorder/regroup: one or two containers' full ordering. */
export async function reorderTasks(
  updates: { id: string; routineId: string | null; sortOrder: number }[],
): Promise<void> {
  const db = await getDb();
  for (const u of updates) {
    await db.execute("UPDATE tasks SET routine_id = ?, sort_order = ? WHERE id = ?", [
      u.routineId,
      u.sortOrder,
      u.id,
    ]);
  }
}

// --- completions -------------------------------------------------------------

export async function listCompletionsBetween(
  startDate: string,
  endDate: string,
): Promise<Completion[]> {
  const db = await getDb();
  const rows = await db.select<CompletionRow[]>(
    "SELECT * FROM completions WHERE occurrence_date >= ? AND occurrence_date <= ?",
    [startDate, endDate],
  );
  return rows.map(completionFromRow);
}

export async function setCompletion(
  taskId: string,
  occurrenceDate: string,
  done: boolean,
): Promise<void> {
  const db = await getDb();
  if (done) {
    await db.execute(
      `INSERT INTO completions (id, task_id, occurrence_date, completed_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(task_id, occurrence_date) DO UPDATE SET completed_at = excluded.completed_at`,
      [uid(), taskId, occurrenceDate, nowIso()],
    );
  } else {
    await db.execute("DELETE FROM completions WHERE task_id = ? AND occurrence_date = ?", [
      taskId,
      occurrenceDate,
    ]);
  }
}
