import { useNavStore } from "../app/store";

const STEPS = [
  {
    title: "Add anything",
    body: "No categories to choose, no due time required. Just write down what's on your mind.",
  },
  {
    title: "Let some things repeat",
    body: "Any task can repeat — daily, on certain weekdays, or every few days. It reappears on its own; you never re-add it.",
  },
  {
    title: "Group into a routine",
    body: "Tasks that belong together — like a morning routine — can live under one named group. Drag the handle to reorder or move them.",
  },
  {
    title: "Check it off, no pressure",
    body: "There's no streak to lose and no red \"overdue.\" A repeating task quietly resets the next time it's due.",
  },
];

export default function HowItWorksScreen() {
  const closeHowItWorks = useNavStore((s) => s.closeHowItWorks);

  return (
    <div className="bg-paper flex min-h-screen flex-col items-center px-8 py-16">
      <div className="w-full max-w-md">
        <h1 className="font-serif mb-8 text-3xl font-normal tracking-tight">How Taski works</h1>

        <ol className="mb-10 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="bg-accent-soft text-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-ink-soft text-sm leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={closeHowItWorks}
          className="bg-accent text-accent-ink rounded-full px-6 py-3 font-medium"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
