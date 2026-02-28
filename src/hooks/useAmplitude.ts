import { useEffect, useRef } from "react";

let amplitudeInstance: any = null;
let initPromise: Promise<any> | null = null;

function getAmplitude(): Promise<any> {
  if (amplitudeInstance) return Promise.resolve(amplitudeInstance);
  if (initPromise) return initPromise;

  initPromise = import("@amplitude/analytics-browser").then((amplitude) =>
    import("@amplitude/plugin-session-replay-browser").then(
      ({ sessionReplayPlugin }) => {
        amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
        amplitude.init("fd72b87546c0880a293df4f4569a01c", {
          autocapture: true,
        });
        amplitudeInstance = amplitude;
        return amplitude;
      }
    )
  );
  return initPromise;
}

export function track(eventName: string, properties?: Record<string, any>) {
  getAmplitude().then((amp) => {
    amp.track(eventName, properties);
  });
}

export function identify(userProperties: Record<string, any>) {
  getAmplitude().then((amp) => {
    const identifyEvent = new amp.Identify();
    Object.entries(userProperties).forEach(([key, value]) => {
      identifyEvent.set(key, value);
    });
    amp.identify(identifyEvent);
  });
}

export function useAmplitude() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    getAmplitude();
  }, []);
}
