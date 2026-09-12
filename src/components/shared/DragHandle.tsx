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
      className="text-ink-faint hover:text-ink-soft absolute top-1/2 left-[-20px] flex h-8 w-5 -translate-y-1/2 cursor-grab touch-none items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <svg width="4" height="14" viewBox="0 0 4 14" fill="none" aria-hidden="true">
        <circle cx="2" cy="2" r="1.2" fill="currentColor" />
        <circle cx="2" cy="7" r="1.2" fill="currentColor" />
        <circle cx="2" cy="12" r="1.2" fill="currentColor" />
      </svg>
    </button>
  );
}
