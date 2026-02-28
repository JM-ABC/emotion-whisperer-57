import { createRoot } from "react-dom/client";
import * as amplitude from "@amplitude/analytics-browser";
import { sessionReplayPlugin } from "@amplitude/plugin-session-replay-browser";
import App from "./App.tsx";
import "./index.css";

amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
amplitude.init("fd72b87546c0880a293df4f4569a01c", { autocapture: true });

createRoot(document.getElementById("root")!).render(<App />);
