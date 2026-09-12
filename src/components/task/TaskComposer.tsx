import { useRef, useState, type FormEvent } from "react";
import PlusIcon from "../shared/PlusIcon";
import RecurrencePicker from "./RecurrencePicker";
import { useDataStore } from "../../app/dataStore";
import type { RecurrenceRule } from "../../lib/types";

export default function TaskComposer({
  routineId,
  placeholder,
}: {
  routineId: string | null;
  placeholder: string;
}) {
  const addTask = useDataStore((s) => s.addTask);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(null);
  const [showRecurrence, setShowRecurrence] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, routineId, recurrence });
    setTitle("");
    setRecurrence(null);
    setShowRecurrence(false);
  }

  return (
    <div className="px-4">
      <form onSubmit={submit} className="group flex items-center py-2.5">
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          aria-label="Add a task"
          className="text-ink-faint hover:bg-paper mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        >
          <PlusIcon />
        </button>
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="placeholder:text-ink-faint flex-1 bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={() => setShowRecurrence((v) => !v)}
          className={`rounded-chip mr-1 px-2.5 py-1 text-xs whitespace-nowrap transition-opacity ${
            recurrence
              ? "bg-accent-soft text-accent"
              : "text-ink-faint opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          }`}
        >
          {recurrence ? "Repeats" : "Repeat"}
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-chip bg-accent text-accent-ink shrink-0 px-2.5 py-1 text-xs whitespace-nowrap disabled:opacity-30"
        >
          Add
        </button>
      </form>
      {showRecurrence && <RecurrencePicker value={recurrence} onChange={setRecurrence} />}
    </div>
  );
}
