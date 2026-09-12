CREATE TABLE routines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  routine_id TEXT REFERENCES routines(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL,
  is_recurring INTEGER NOT NULL DEFAULT 0,
  recurrence_json TEXT,
  archived INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE completions (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  occurrence_date TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  UNIQUE(task_id, occurrence_date)
);

CREATE INDEX idx_completions_date ON completions(occurrence_date);
CREATE INDEX idx_completions_task ON completions(task_id);
CREATE INDEX idx_tasks_routine ON tasks(routine_id, sort_order);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
