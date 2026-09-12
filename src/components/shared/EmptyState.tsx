import type { ReactNode } from "react";

export default function EmptyState({ children }: { children: ReactNode }) {
  return <p className="text-ink-soft py-3 text-[0.95rem] italic">{children}</p>;
}
