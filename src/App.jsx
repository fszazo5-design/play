import { useEffect, useState } from "react";
import { Check, Download, X } from "lucide-react";
import Home from "./pages/Home.jsx";
import ModulesPage from "./pages/ModulesPage.jsx";
import OperationsPage from "./pages/OperationsPage.jsx";
import { usePlayroomState } from "./hooks/usePlayroomState.js";
import { usePwaInstall } from "./hooks/usePwaInstall.js";
const PWA_INVITE_DISMISSED_KEY = "playroom-pwa-invite-dismissed";

function InstallPrompt() {
    const { canInstall, promptInstall } = usePwaInstall();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!canInstall) return undefined;
        const dismissedAt = Number(localStorage.getItem(PWA_INVITE_DISMISSED_KEY) || 0);
        if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return undefined;
        const timer = window.setTimeout(() => setVisible(true), 2200);
        return () => window.clearTimeout(timer);
    }, [canInstall]);
    const close = () => {
        localStorage.setItem(PWA_INVITE_DISMISSED_KEY, String(Date.now()));
        setVisible(false);
    };
    const install = async () => {
        const result = await promptInstall();
        if (result.outcome === "accepted") {
            setVisible(false);
            return;
        }
        close();
    };
    if (!visible) return null;
    return <div className="pwa-invite-backdrop" role="presentation"><section className="pwa-invite-modal" role="dialog" aria-modal="true" aria-labelledby="pwa-invite-title"><button type="button" className="pwa-invite-close" onClick={close} aria-label="إغلاق"><X size={17}/></button><div className="pwa-invite-art"><Download size={25}/></div><div className="section-kicker">PLAYROOM OS / DESKTOP APP</div><h2 id="pwa-invite-title">ثبّت Playroom على جهازك</h2><p>افتح لوحة التحكم بسرعة من سطح المكتب، واستمتع بتجربة تطبيق مستقلة حتى عند ضعف الاتصال.</p><div className="pwa-invite-benefits"><span><Check size={13}/> وصول سريع من سطح المكتب</span><span><Check size={13}/> يعمل بواجهة تطبيق مستقلة</span><span><Check size={13}/> يدعم العمل دون اتصال</span></div><div className="pwa-invite-actions"><button type="button" className="module-button pwa-invite-install" onClick={install}><Download size={15}/> تثبيت الآن</button><button type="button" className="pwa-invite-later" onClick={close}>لاحقًا</button></div></section></div>;
}
export default function App() {
    const [activeView, setActiveView] = useState("modules");
    const playroom = usePlayroomState();
    const renderView = () => {
        if (activeView === "overview") {
            return <Home state={playroom.state} lastSnapshotAt={playroom.lastSnapshotAt} isOnline={playroom.isOnline} onCapture={playroom.captureNow} onStartSession={playroom.startSession} onPauseSession={playroom.pauseSession} onFinishSession={playroom.finishSession} onSetStationStatus={playroom.setStationStatus} onOpenModules={() => setActiveView("modules")}/>;
        }
        if (activeView === "stations") {
            return <Home state={playroom.state} lastSnapshotAt={playroom.lastSnapshotAt} isOnline={playroom.isOnline} onCapture={playroom.captureNow} onStartSession={playroom.startSession} onPauseSession={playroom.pauseSession} onFinishSession={playroom.finishSession} onSetStationStatus={playroom.setStationStatus} onOpenModules={() => setActiveView("modules")}/>;
        }
        if (activeView === "modules") {
            return <ModulesPage onOpen={setActiveView}/>;
        }
        return <OperationsPage kind={activeView} state={playroom.state} updateState={playroom.updateState} onBack={() => setActiveView("modules")}/>;
    };
    return (<div className="app-shell" dir="rtl">
      <InstallPrompt />
      <main className="main-content">{renderView()}</main>
    </div>);
}
