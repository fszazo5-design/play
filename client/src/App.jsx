import { useEffect, useState } from "react";
import { BarChart3, CalendarClock, Check, CreditCard, Download, LayoutDashboard, MonitorPlay, Package, Settings2, Trophy, Users, X } from "lucide-react";
import Home from "./pages/Home.jsx";
import OperationsPage from "./pages/OperationsPage.jsx";
import { usePlayroomState } from "./hooks/usePlayroomState.js";
import { usePwaInstall } from "./hooks/usePwaInstall.js";
const navigation = [
    { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
    { id: "stations", label: "المحطات والجلسات", icon: MonitorPlay },
    { id: "inventory", label: "المخزون والمبيعات", icon: Package },
    { id: "players", label: "اللاعبون", icon: Users },
    { id: "tournaments", label: "البطولات", icon: Trophy },
    { id: "reservations", label: "الحجوزات", icon: CalendarClock },
    { id: "billing", label: "الفوترة والدفعات", icon: CreditCard },
    { id: "shifts", label: "تقارير الورديات", icon: BarChart3 },
    { id: "settings", label: "إعدادات الفرع", icon: Settings2 },
];
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
    const [activeView, setActiveView] = useState("overview");
    const playroom = usePlayroomState();
    const currentLabel = navigation.find((item) => item.id === activeView)?.label;
    const renderView = () => {
        if (activeView === "overview") {
            return <Home state={playroom.state} lastSnapshotAt={playroom.lastSnapshotAt} isOnline={playroom.isOnline} onCapture={playroom.captureNow} onStartSession={playroom.startSession} onPauseSession={playroom.pauseSession} onFinishSession={playroom.finishSession} onSetStationStatus={playroom.setStationStatus}/>;
        }
        if (activeView === "stations") {
            return <Home state={playroom.state} lastSnapshotAt={playroom.lastSnapshotAt} isOnline={playroom.isOnline} onCapture={playroom.captureNow} onStartSession={playroom.startSession} onPauseSession={playroom.pauseSession} onFinishSession={playroom.finishSession} onSetStationStatus={playroom.setStationStatus}/>;
        }
        return <OperationsPage kind={activeView} label={currentLabel} state={playroom.state} updateState={playroom.updateState} onBack={() => setActiveView("overview")}/>;
    };
    return (<div className="app-shell" dir="rtl">
      <InstallPrompt />
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark"><span>PX</span></div><div><p className="eyebrow">CONTROL CENTER</p><h1>PLAYROOM<span>OS</span></h1></div></div>
        <div className="branch-pill"><span className="pulse-dot"/><div><strong>{playroom.state.systemConfig.branchId}</strong><small>الفرع الرئيسي · متصل</small></div><Settings2 size={15}/></div>
        <nav className="side-nav" aria-label="التنقل الرئيسي"><p className="nav-label">إدارة الصالة</p>{navigation.map((item) => { const Icon = item.icon; const selected = activeView === item.id || (activeView === "stations" && item.id === "overview"); return <button type="button" className={`nav-item ${selected ? "selected" : ""}`} onClick={() => setActiveView(item.id)} key={item.id}><Icon size={18} strokeWidth={selected ? 2.4 : 1.8}/><span>{item.label}</span>{item.id === "stations" && <b>{playroom.metrics.activeStations}</b>}{item.id === "inventory" && playroom.metrics.lowStockItems > 0 && <b className="nav-alert">{playroom.metrics.lowStockItems}</b>}</button>; })}</nav>
        <div className="sidebar-footer"><div className="operator-card"><div className="avatar">م</div><div><strong>مشغل الصالة</strong><small>وردية المساء · #SHIFT-042</small></div><span className="status-indicator"/></div><p className="version-label">Playroom OS v0.2 · Offline-first</p></div>
      </aside>
      <main className="main-content">{renderView()}</main>
    </div>);
}
