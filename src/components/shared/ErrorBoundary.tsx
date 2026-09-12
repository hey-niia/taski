import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Last-resort safety net. A crash with no boundary blanks the whole native
 * window and forces a restart — unacceptable for an app whose entire premise
 * is staying low-pressure. This can't fix the bug, but it keeps the app
 * alive and gives a way back to Today instead of a dead white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="bg-paper flex h-screen flex-col items-center justify-center px-8 text-center">
          <p className="mb-2 font-medium">Something went wrong.</p>
          <p className="text-ink-soft mb-6 max-w-sm text-sm">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-accent text-accent-ink rounded-full px-6 py-3 font-medium"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
