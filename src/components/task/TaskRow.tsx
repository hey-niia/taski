import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandle from "../shared/DragHandle";
import TaskRowContent from "./TaskRowContent";
import { todayStr } from "../../lib/recurrence";
import type { Task } from "../../lib/types";

export default function TaskRow({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className="border-line group border-b last:border-b-0">
      <TaskRowContent
        task={task}
        date={todayStr()}
        dragHandle={<DragHandle listeners={listeners} attributes={attributes} />}
      />
    </li>
  );
}
