import { useState, type KeyboardEvent } from "react";
import CheckIcon from "../shared/CheckIcon";
import ClockIcon from "../shared/ClockIcon";
import RecurrencePicker from "./RecurrencePicker";
import TaskSchedulePicker from "./TaskSchedulePicker";
import { describeRecurrence, todayStr } from "../../lib/recurrence";
import { formatDateLabel, formatDuration, formatTime } from "../../lib/format";
import { useDataStore } from "../../app/dataStore";
import type { Task } from "../../lib/types";

/**
 * The checkbox/title/time/repeat/delete row shared by the Today list
 * (TaskRow, wrapped in a drag handle + sortable `<li>`) and the Calendar
 * screen (OccurrenceRow, for a specific occurrence date, no drag) — kept as
 * one component so the two screens can't drift apart in behavior or size.
 */
export default function TaskRowContent({ task, date }: { task: Task; date: string }) {
  const [editingRecurrence, setEditingRecurrence] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const toggleCompletion = useDataStore((s) => s.toggleCompletion);
  const renameTask = useDataStore((s) => s.renameTask);
  const setTaskRecurrence = useDataStore((s) => s.setTaskRecurrence);
  const setTaskSchedule = useDataStore((s) => s.setTaskSchedule);
  const deleteTask = useDataStore((s) => s.deleteTask);
  const isDone = useDataStore((s) => s.isCompletedOn(task.id, date));

  const today = todayStr();
  const showsDateBadge = !task.recurrence && task.scheduledDate !== today;
  const hasSchedule = task.dueTime !== null || task.estimatedMinutes !== null || showsDateBadge;
  const scheduleLabel = [
    showsDateBadge ? formatDateLabel(task.scheduledDate, today) : null,
    task.dueTime ? formatTime(task.dueTime) : null,
    task.estimatedMinutes ? `~${formatDuration(task.estimatedMinutes)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  function commitTitle() {
    setIsEditingTitle(false);
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== task.title) renameTask(task.id, trimmed);
    else setTitleDraft(task.title);
  }

  function onTitleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      setTitleDraft(task.title);
      setIsEditingTitle(false);
    }
  }

  return (
    <div className="flex-1">
      <div className="flex items-center py-2.5">
        <button
          type="button"
          onClick={() => toggleCompletion(task.id, date)}
          aria-pressed={isDone}
          aria-label={isDone ? `Mark "${task.title}" not done` : `Mark "${task.title}" done`}
          className="mr-3 shrink-0"
        >
          <span
            className={`rounded-control flex h-6 w-6 items-center justify-center border ${
              isDone
                ? "bg-ink border-ink text-paper-raised"
                : "bg-paper-raised border-ink-faint"
            }`}
          >
            {isDone && <CheckIcon />}
          </span>
        </button>

        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={onTitleKeyDown}
            onFocus={(e) => e.currentTarget.select()}
            className="-my-1 -ml-1 flex-1 rounded bg-transparent px-1 py-1 outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setTitleDraft(task.title);
              setIsEditingTitle(true);
            }}
            className={`-my-1 -ml-1 flex-1 rounded px-1 py-1 text-left ${
              isDone ? "text-ink-soft line-through" : ""
            }`}
          >
            {task.title}
          </button>
        )}

        <button
          type="button"
          onClick={() => setEditingSchedule((v) => !v)}
          className={`mr-1 flex items-center gap-1 rounded-full px-2 py-1 text-xs whitespace-nowrap transition-opacity ${
            hasSchedule
              ? "text-ink-soft opacity-100"
              : "text-ink-faint opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          }`}
          aria-label={hasSchedule ? `Edit schedule for "${task.title}"` : `Add a schedule for "${task.title}"`}
        >
          <ClockIcon />
          {hasSchedule && scheduleLabel}
        </button>

        <button
          type="button"
          onClick={() => setEditingRecurrence((v) => !v)}
          className={`rounded-chip mr-1 px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
            task.recurrence
              ? "bg-accent-soft text-accent"
              : "text-ink-faint hover:text-ink-soft"
          }`}
        >
          {task.recurrence ? describeRecurrence(task.recurrence) : "Repeat"}
        </button>

        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          aria-label={`Delete "${task.title}"`}
          className="text-ink-faint hover:text-ink-soft p-3"
        >
          ×
        </button>
      </div>

      {editingSchedule && (
        <div className="pb-3 pl-9">
          <TaskSchedulePicker
            scheduledDate={task.scheduledDate}
            isRecurring={task.recurrence !== null}
            dueTime={task.dueTime}
            estimatedMinutes={task.estimatedMinutes}
            onChange={(schedule) => setTaskSchedule(task.id, schedule)}
          />
        </div>
      )}

      {editingRecurrence && (
        <div className="pb-3 pl-9">
          <RecurrencePicker
            value={task.recurrence}
            onChange={(rule) => setTaskRecurrence(task.id, rule)}
          />
        </div>
      )}
    </div>
  );
}
