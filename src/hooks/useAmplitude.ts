import { useEffect, useRef } from "react";

export function useAmplitude() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import("@amplitude/analytics-browser").then((amplitude) => {
      import("@amplitude/plugin-session-replay-browser").then(
        ({ sessionReplayPlugin }) => {
          amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
          amplitude.init("fd72b87546c0880a293df4f4569a01c", {
            autocapture: true,
          });
        }
      );
    });
  }, []);
}
