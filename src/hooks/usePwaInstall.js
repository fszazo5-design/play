import { useCallback, useEffect, useState } from "react";

export function usePwaInstall() {
  const [installPrompt, setInstallPrompt] = useState(() => window.__playroomInstallPrompt || null);
  const [isInstalled, setIsInstalled] = useState(() => window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

  useEffect(() => {
    const handleAvailable = () => setInstallPrompt(window.__playroomInstallPrompt || null);
    const handleInstalled = () => {
      window.__playroomInstallPrompt = null;
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener("pwa-install-available", handleAvailable);
    window.addEventListener("appinstalled", handleInstalled);
    handleAvailable();
    return () => {
      window.removeEventListener("pwa-install-available", handleAvailable);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const prompt = window.__playroomInstallPrompt || installPrompt;
    if (!prompt) return { outcome: "unavailable" };
    prompt.prompt();
    const choice = await prompt.userChoice;
    window.__playroomInstallPrompt = null;
    setInstallPrompt(null);
    return { outcome: choice?.outcome || "dismissed" };
  }, [installPrompt]);

  return { canInstall: Boolean(installPrompt) && !isInstalled, isInstalled, promptInstall };
}
