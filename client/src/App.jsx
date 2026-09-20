import { useState } from "react";
import { BarChart3, CalendarClock, CreditCard, LayoutDashboard, MonitorPlay, Package, Settings2, Trophy, Users } from "lucide-react";
import Home from "./pages/Home.jsx";
import OperationsPage from "./pages/OperationsPage.jsx";
import { usePlayroomState } from "./hooks/usePlayroomState.js";

const navigation = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "stations", label: "المحطات والجلسات", icon: MonitorPlay },
  { id: "inventory", label: "المخزون والمبيعات", icon: Package },
  { id: "players", label: "اللاعبون", icon: Users },
  { id: "tournaments", label: "البطولات", icon: Trophy },
  { id: "reservations", label: "الحجوزات", icon: CalendarClock },
  { id: "billing", label: "الفوترة والدفعات", icon: CreditCard },
  { id: "shifts", label: "تقارير الورديات", icon: BarChart3 },
];

export default function App() {
  const [activeView, setActiveView] = useState("overview");
  const playroom = usePlayroomState();
  const currentLabel = navigation.find((item) => item.id === activeView)?.label;

  const renderView = () => {
    if (activeView === "overview") {
      return <Home state={playroom.state} lastSnapshotAt={playroom.lastSnapshotAt} isOnline={playroom.isOnline} onCapture={playroom.captureNow} onStartSession={playroom.startSession} onPauseSession={playroom.pauseSession} onFinishSession={playroom.finishSession} onSetStationStatus={playroom.setStationStatus} />;
    }
    if (activeView === "stations") {
      return <Home state={playroom.state} lastSnapshotAt={playroom.lastSnapshotAt} isOnline={playroom.isOnline} onCapture={playroom.captureNow} onStartSession={playroom.startSession} onPauseSession={playroom.pauseSession} onFinishSession={playroom.finishSession} onSetStationStatus={playroom.setStationStatus} />;
    }
    return <OperationsPage kind={activeView} label={currentLabel} state={playroom.state} updateState={playroom.updateState} onBack={() => setActiveView("overview")} />;
  };

  return (
    <div className="app-shell" dir="rtl">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark"><span>PX</span></div><div><p className="eyebrow">CONTROL CENTER</p><h1>PLAYROOM<span>OS</span></h1></div></div>
        <div className="branch-pill"><span className="pulse-dot" /><div><strong>{playroom.state.systemConfig.branchId}</strong><small>الفرع الرئيسي · متصل</small></div><Settings2 size={15} /></div>
        <nav className="side-nav" aria-label="التنقل الرئيسي"><p className="nav-label">إدارة الصالة</p>{navigation.map((item) => { const Icon = item.icon; const selected = activeView === item.id || (activeView === "stations" && item.id === "overview"); return <button type="button" className={`nav-item ${selected ? "selected" : ""}`} onClick={() => setActiveView(item.id)} key={item.id}><Icon size={18} strokeWidth={selected ? 2.4 : 1.8} /><span>{item.label}</span>{item.id === "stations" && <b>{playroom.metrics.activeStations}</b>}{item.id === "inventory" && playroom.metrics.lowStockItems > 0 && <b className="nav-alert">{playroom.metrics.lowStockItems}</b>}</button>; })}</nav>
        <div className="sidebar-footer"><div className="operator-card"><div className="avatar">م</div><div><strong>مشغل الصالة</strong><small>وردية المساء · #SHIFT-042</small></div><span className="status-indicator" /></div><p className="version-label">Playroom OS v0.2 · Offline-first</p></div>
      </aside>
      <main className="main-content">{renderView()}</main>
    </div>
  );
}
