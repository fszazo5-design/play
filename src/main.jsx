import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.__playroomInstallPrompt = event;
    window.dispatchEvent(new Event("pwa-install-available"));
});
createRoot(document.getElementById("root")).render(<React.StrictMode>
    <App />
  </React.StrictMode>);
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch(() => {
            // Offline storage still works when service-worker registration is unavailable.
        });
    });
}
