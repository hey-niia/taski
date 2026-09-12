import TaskRowContent from "../task/TaskRowContent";
import type { Task } from "../../lib/types";

export default function OccurrenceRow({ task, date }: { task: Task; date: string }) {
  return (
    <div className="border-line group flex items-start border-b last:border-b-0">
      {/* Matches TaskRow's drag-handle width so rows line up the same way
          they do on the Today screen — Calendar just has nothing to drag. */}
      <div className="w-8 shrink-0" aria-hidden="true" />
      <TaskRowContent task={task} date={date} />
    </div>
  );
}
