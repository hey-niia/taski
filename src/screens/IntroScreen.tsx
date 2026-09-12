export default function IntroScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="intro-gradient flex h-screen flex-col items-center justify-center px-8 text-center">
      <div className="max-w-sm">
        <div className="bg-accent-soft mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full">
          <span className="text-2xl">◡</span>
        </div>
        <h1 className="font-serif mb-3 text-4xl font-normal tracking-tight">Taski</h1>
        <p className="text-ink-soft mb-8 leading-relaxed">
          A to-do list that doesn't keep score. Add anything, let some things repeat, and group
          the ones that belong together into a routine — at your own pace, not a schedule's.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="bg-accent text-accent-ink rounded-full px-6 py-3 font-medium"
        >
          Get started
        </button>
      </div>
    </div>
  );
}
