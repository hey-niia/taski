import { useState, type FormEvent } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import AppMenu from "../components/shared/AppMenu";
import RoutineSection from "../components/task/RoutineSection";
import TaskRow from "../components/task/TaskRow";
import { useDataStore } from "../app/dataStore";
import { UNGROUPED } from "../lib/types";

type ContainerMap = Record<string, string[]>;

export default function MainScreen() {
  const routines = useDataStore((s) => s.routines);
  const tasks = useDataStore((s) => s.tasks);
  const reorderTasks = useDataStore((s) => s.reorderTasks);
  const addRoutine = useDataStore((s) => s.addRoutine);
  const deleteRoutine = useDataStore((s) => s.deleteRoutine);
  const renameRoutine = useDataStore((s) => s.renameRoutine);
  const setRoutineIcon = useDataStore((s) => s.setRoutineIcon);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [override, setOverride] = useState<ContainerMap | null>(null);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [showNewRoutine, setShowNewRoutine] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function computeContainers(): ContainerMap {
    const map: ContainerMap = { [UNGROUPED]: [] };
    for (const r of routines) map[r.id] = [];
    for (const t of [...tasks].sort((a, b) => a.sortOrder - b.sortOrder)) {
      const cid = t.routineId ?? UNGROUPED;
      if (!map[cid]) map[cid] = [];
      map[cid].push(t.id);
    }
    return map;
  }

  const containers = override ?? computeContainers();

  function findContainer(id: string, map: ContainerMap): string | undefined {
    if (id in map) return id;
    return Object.keys(map).find((cid) => map[cid].includes(id));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    setOverride(computeContainers());
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    setOverride((prev) => {
      const map = prev ?? computeContainers();
      const activeContainer = findContainer(activeId, map);
      const overContainer = findContainer(overId, map);
      if (!activeContainer || !overContainer || activeContainer === overContainer) return map;

      const activeItems = map[activeContainer];
      const overItems = map[overContainer];
      const overIndex = overItems.indexOf(overId);
      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      return {
        ...map,
        [activeContainer]: activeItems.filter((id) => id !== activeId),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeId,
          ...overItems.slice(newIndex),
        ],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      setOverride(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    let finalMap = override ?? computeContainers();

    const activeContainer = findContainer(activeId, finalMap);
    const overContainer = findContainer(overId, finalMap);
    if (activeContainer && overContainer && activeContainer === overContainer) {
      const items = finalMap[activeContainer];
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        finalMap = { ...finalMap, [activeContainer]: arrayMove(items, oldIndex, newIndex) };
      }
    }

    const updates: { id: string; routineId: string | null; sortOrder: number }[] = [];
    for (const [containerId, ids] of Object.entries(finalMap)) {
      ids.forEach((id, index) => {
        updates.push({
          id,
          routineId: containerId === UNGROUPED ? null : containerId,
          sortOrder: index,
        });
      });
    }
    reorderTasks(updates);
    setOverride(null);
  }

  function submitNewRoutine(e: FormEvent) {
    e.preventDefault();
    const name = newRoutineName.trim();
    if (!name) return;
    addRoutine(name);
    setNewRoutineName("");
    setShowNewRoutine(false);
  }

  const tasksById = new Map(tasks.map((t) => [t.id, t]));
  const activeTask = activeId ? tasksById.get(activeId) : undefined;

  return (
    <div className="bg-paper min-h-screen">
      <AppMenu active="main" />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="mx-auto max-w-xl px-6 pb-16">
          {routines.map((routine) => (
            <RoutineSection
              key={routine.id}
              id={routine.id}
              routineId={routine.id}
              title={routine.name}
              icon={routine.icon}
              emptyHint="Drag a task here, or add one below."
              composerPlaceholder={`Add to ${routine.name}…`}
              tasks={(containers[routine.id] ?? [])
                .map((id) => tasksById.get(id))
                .filter((t): t is NonNullable<typeof t> => Boolean(t))}
              onDelete={() => deleteRoutine(routine.id)}
              onRename={(name) => renameRoutine(routine.id, name)}
              onIconChange={(icon) => setRoutineIcon(routine.id, icon)}
            />
          ))}

          <RoutineSection
            id={UNGROUPED}
            routineId={null}
            title={routines.length > 0 ? "Everything else" : "Your list"}
            emptyHint="Nothing here yet — add anything on your mind below."
            composerPlaceholder="Add a task…"
            tasks={(containers[UNGROUPED] ?? [])
              .map((id) => tasksById.get(id))
              .filter((t): t is NonNullable<typeof t> => Boolean(t))}
          />

          {showNewRoutine ? (
            <form onSubmit={submitNewRoutine} className="flex items-center gap-2 px-1">
              <input
                autoFocus
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                onBlur={() => !newRoutineName.trim() && setShowNewRoutine(false)}
                placeholder="Morning, Wind down, Errands…"
                className="placeholder:text-ink-faint flex-1 bg-transparent outline-none"
              />
              <button type="submit" className="text-accent text-sm font-medium">
                Create
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewRoutine(true)}
              className="text-ink-soft hover:text-ink px-1 text-sm"
            >
              + New routine
            </button>
          )}
        </main>

        <DragOverlay>
          {activeTask && (
            <ul className="bg-paper-raised border-line rounded-card border shadow-lg">
              <TaskRow task={activeTask} />
            </ul>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
