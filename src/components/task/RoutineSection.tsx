import { useState, type KeyboardEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskRow from "./TaskRow";
import TaskComposer from "./TaskComposer";
import IconPicker from "../shared/IconPicker";
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

export default function RoutineSection({
  id,
  routineId,
  title,
  icon,
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
  composerPlaceholder: string;
  tasks: Task[];
  onDelete?: () => void;
  onRename?: (name: string) => void;
  onIconChange?: (icon: string | null) => void;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <section className="rounded-card bg-paper-raised shadow-card mb-5">
      <div className="group/header flex items-center justify-between px-4 pt-3.5 pb-1">
        <div className="flex items-center gap-1.5">
          {onIconChange && <IconPicker icon={icon ?? null} onChange={onIconChange} />}
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
            className="text-ink-faint hover:text-ink-soft text-xs opacity-0 transition-opacity group-hover/header:opacity-100 focus-visible:opacity-100"
          >
            Delete routine
          </button>
        )}
      </div>

      <ul ref={setNodeRef} className="min-h-2 px-4">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </SortableContext>
      </ul>

      <TaskComposer routineId={routineId} placeholder={composerPlaceholder} />
    </section>
  );
}
