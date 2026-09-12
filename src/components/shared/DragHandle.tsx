import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

export default function DragHandle({
  listeners,
  attributes,
}: {
  listeners?: DraggableSyntheticListeners;
  attributes?: DraggableAttributes;
}) {
  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      className="text-ink-faint hover:text-ink-soft flex h-11 w-8 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        <circle cx="8" cy="2" r="1.5" fill="currentColor" />
        <circle cx="2" cy="8" r="1.5" fill="currentColor" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="2" cy="14" r="1.5" fill="currentColor" />
        <circle cx="8" cy="14" r="1.5" fill="currentColor" />
      </svg>
    </button>
  );
}
