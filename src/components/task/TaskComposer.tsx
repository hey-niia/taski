import { useState, type FormEvent } from "react";
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
    <div className="pr-4 pl-11">
      <form onSubmit={submit} className="flex items-center gap-2 py-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="placeholder:text-ink-faint flex-1 bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={() => setShowRecurrence((v) => !v)}
          className={`rounded-chip px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
            recurrence ? "bg-accent-soft text-accent" : "text-ink-faint hover:text-ink-soft"
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
