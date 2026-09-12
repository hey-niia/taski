import { useState, type KeyboardEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskRow from "./TaskRow";
import TaskComposer from "./TaskComposer";
import EmptyState from "../shared/EmptyState";
import type { Task } from "../../lib/types";

function EditableTitle({ title, onRename }: { title: string; onRename: (name: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  function commit() {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== title) onRename(trimmed);
    else setDraft(title);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      setDraft(title);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        onFocus={(e) => e.currentTarget.select()}
        className="text-ink -my-0.5 -ml-1 rounded bg-transparent px-1 py-0.5 font-medium outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(title);
        setIsEditing(true);
      }}
      className="text-ink -my-0.5 -ml-1 rounded px-1 py-0.5 text-left font-medium"
    >
      {title}
    </button>
  );
}

/**
 * Suggested on-device (Apple Intelligence) when a routine is created, but
 * always editable by hand — click it, type or paste a replacement (⌃⌘Space
 * opens the system emoji picker in the field), blur/Enter to save.
 */
function EditableIcon({
  icon,
  onChange,
}: {
  icon: string | null;
  onChange: (icon: string | null) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(icon ?? "");

  function commit() {
    setIsEditing(false);
    onChange(draft.trim() || null);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      setDraft(icon ?? "");
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
        onFocus={(e) => e.currentTarget.select()}
        className="border-line bg-paper h-7 w-7 shrink-0 rounded-full border text-center outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(icon ?? "");
        setIsEditing(true);
      }}
      aria-label={icon ? "Change icon" : "Set an icon"}
      className="text-ink-faint hover:bg-accent-soft flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base"
    >
      {icon ?? "·"}
    </button>
  );
}

export default function RoutineSection({
  id,
  routineId,
  title,
  icon,
  emptyHint,
  composerPlaceholder,
  tasks,
  onDelete,
  onRename,
  onIconChange,
}: {
  id: string;
  routineId: string | null;
  title: string;
  icon?: string | null;
  emptyHint: string;
  composerPlaceholder: string;
  tasks: Task[];
  onDelete?: () => void;
  onRename?: (name: string) => void;
  onIconChange?: (icon: string | null) => void;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <section className="rounded-card bg-paper-raised border-line mb-5 border">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-1">
        <div className="flex items-center gap-1.5">
          {onIconChange && <EditableIcon icon={icon ?? null} onChange={onIconChange} />}
          {onRename ? (
            <EditableTitle title={title} onRename={onRename} />
          ) : (
            <h2 className="text-ink font-medium">{title}</h2>
          )}
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-ink-faint hover:text-ink-soft text-xs"
          >
            Delete routine
          </button>
        )}
      </div>

      <ul ref={setNodeRef} className="min-h-2 px-4">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 && <EmptyState>{emptyHint}</EmptyState>}
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </SortableContext>
      </ul>

      <TaskComposer routineId={routineId} placeholder={composerPlaceholder} />
    </section>
  );
}
