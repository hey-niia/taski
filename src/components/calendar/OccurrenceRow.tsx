import TaskRowContent from "../task/TaskRowContent";
import type { Task } from "../../lib/types";

export default function OccurrenceRow({ task, date }: { task: Task; date: string }) {
  return (
    <div className="border-line group border-b last:border-b-0">
      <TaskRowContent task={task} date={date} />
    </div>
  );
}
