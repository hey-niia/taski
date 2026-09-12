import { useEffect } from "react";
import { useNavStore } from "./app/store";
import { useDataStore } from "./app/dataStore";
import { useThemeStore } from "./app/themeStore";
import { getSetting, setSetting } from "./lib/db";
import IntroScreen from "./screens/IntroScreen";
import HowItWorksScreen from "./screens/HowItWorksScreen";
import MainScreen from "./screens/MainScreen";
import CalendarScreen from "./screens/CalendarScreen";

export default function App() {
  const screen = useNavStore((s) => s.screen);
  const goTo = useNavStore((s) => s.goTo);
  const init = useDataStore((s) => s.init);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    (async () => {
      await Promise.all([init(), initTheme()]);
      const hasSeenIntro = await getSetting("has_seen_intro");
      if (hasSeenIntro === "true") {
        goTo("main");
      } else {
        goTo("intro");
      }
    })();
  }, [init, initTheme, goTo]);

  switch (screen) {
    case "loading":
      return <div className="bg-paper h-screen" />;
    case "intro":
      return (
        <IntroScreen
          onContinue={async () => {
            await setSetting("has_seen_intro", "true");
            goTo("how-it-works");
          }}
        />
      );
    case "how-it-works":
      return <HowItWorksScreen />;
    case "main":
      return <MainScreen />;
    case "calendar":
      return <CalendarScreen />;
  }
}
