import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpLeft,
  BatteryCharging,
  BellRing,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Coffee,
  Gamepad2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Radio,
  RefreshCw,
  ShoppingBag,
  Siren,
  Sparkles,
  TimerReset,
  TrendingUp,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { formatMoney, formatRelativeTime } from "../lib/domain.js";

const statusLabels = {
  IDLE: "متاحة",
  ACTIVE: "نشطة الآن",
  RESERVED: "محجوزة",
  MAINTENANCE: "صيانة",
};

const statusClasses = {
  IDLE: "status-idle",
  ACTIVE: "status-active",
  RESERVED: "status-reserved",
  MAINTENANCE: "status-maintenance",
};

function formatDuration(startTime, paused) {
  const minutes = Math.max(0, Math.floor((Date.now() - startTime) / 60000));
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours ? `${hours}س ` : ""}${remaining}د${paused ? " · متوقفة" : ""}`;
}

function MetricCard({ label, value, hint, icon: Icon, accent = "cyan", trend }) {
  return (
    <article className={`metric-card accent-${accent}`}>
      <div className="metric-topline">
        <span className="metric-icon"><Icon size={17} /></span>
        {trend && <span className="metric-trend"><TrendingUp size={13} /> {trend}</span>}
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

function StationCard({ station, currency, onStartSession, onPauseSession, onFinishSession }) {
  const [, setTick] = useState(0);
  const session = station.activeSession;
  const isActive = station.status === "ACTIVE" && session;
  const totalPower = station.powerSpecs.consoleWattage + station.powerSpecs.tvWattage;

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <article className={`station-card ${statusClasses[station.status]} ${session?.paused ? "is-paused" : ""}`}>
      <div className="station-card-header">
        <div className="station-title">
          <span className="station-symbol"><Gamepad2 size={17} /></span>
          <div>
            <strong>{station.name}</strong>
            <span>{station.type} · {totalPower}W</span>
          </div>
        </div>
        <button type="button" className="ghost-icon" aria-label="خيارات المحطة"><MoreHorizontal size={18} /></button>
      </div>

      <div className="station-status-row">
        <span className="station-status"><i /> {statusLabels[station.status]}</span>
        {station.status === "ACTIVE" && <span className="session-id">{session?.sessionId}</span>}
      </div>

      {isActive ? (
        <>
          <div className="station-session-clock">
            <span>{formatDuration(session.startTime, session.paused)}</span>
            <small>{session.mode === "FIXED" ? "جلسة محددة" : "جلسة مفتوحة"}</small>
          </div>
          <div className="station-meta">
            <span><Gamepad2 size={13} /> {session.controllerCount} أذرع</span>
            <span><ShoppingBag size={13} /> {session.ordersTab.reduce((sum, order) => sum + order.qty, 0)} طلبات</span>
            {session.endTime && <span><Clock3 size={13} /> حتى {new Date(session.endTime).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
          <div className="station-actions">
            <button type="button" className="action-button soft" onClick={() => onPauseSession(station.id)}>
              {session.paused ? <Play size={14} /> : <Pause size={14} />}
              {session.paused ? "استئناف" : "إيقاف مؤقت"}
            </button>
            <button type="button" className="action-button danger" onClick={() => onFinishSession(station.id)}>
              <TimerReset size={14} /> إنهاء
            </button>
          </div>
        </>
      ) : (
        <div className="station-empty-state">
          <div className="empty-orbit"><Radio size={20} /></div>
          <div>
            <strong>{station.status === "MAINTENANCE" ? "تحت الصيانة" : station.status === "RESERVED" ? "موعد قادم" : "جاهزة للعب"}</strong>
            <span>{station.status === "IDLE" ? "ابدأ جلسة جديدة خلال ثوانٍ" : station.status === "RESERVED" ? "محجوزة من 08:30 م" : "تحتاج تدخل المشرف"}</span>
          </div>
          {station.status === "IDLE" && <button type="button" className="circle-add" onClick={() => onStartSession(station.id)}><Plus size={18} /></button>}
        </div>
      )}

      <div className="station-progress"><span style={{ width: `${station.status === "ACTIVE" ? 68 : station.status === "MAINTENANCE" ? 100 : 12}%` }} /></div>
      <div className="station-footer"><span>التشغيل التالي للصيانة</span><b>{station.maintenance.nextDeepCleanDueHours}س</b></div>
    </article>
  );
}

export default function Home({ state, lastSnapshotAt, isOnline, onCapture, onStartSession, onPauseSession, onFinishSession }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(() => {
    const active = state.stations.filter((station) => station.status === "ACTIVE").length;
    const utilization = Math.round((active / state.stations.length) * 100);
    return {
      active,
      utilization,
      revenue: state.shiftReport.recordedCashSales + state.shiftReport.recordedDigitalSales,
      lowStock: state.inventory.filter((item) => item.stockQty <= item.minThreshold).length,
    };
  }, [state]);

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <div className="breadcrumb"><span>PLAYROOM OS</span><ArrowUpLeft size={13} /> <b>نظرة عامة</b></div>
          <h2>مساء الخير، <em>مشرف الصالة</em></h2>
          <p className="page-subtitle">تابع نبض الصالة لحظة بلحظة واتخذ القرار قبل أن يطلبه اللاعبون.</p>
        </div>
        <div className="topbar-actions">
          <div className={`sync-chip ${isOnline ? "online" : "offline"}`}><span>{isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}</span>{isOnline ? "متصل · محلي" : "وضع عدم الاتصال"}</div>
          <button type="button" className="icon-button notification-button" aria-label="الإشعارات"><BellRing size={18} /><i /></button>
          <div className="live-clock"><span>السبت، 20 سبتمبر 2026</span><strong>{new Date(now).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</strong></div>
        </div>
      </header>

      <section className="hero-strip">
        <div className="hero-copy">
          <div className="live-label"><span className="live-dot" /> LIVE FLOOR STATUS</div>
          <h3>كل محطة لها قصة.<br /><span>أنت تتحكم بالنهاية.</span></h3>
          <p>الحالة تُحفظ تلقائيًا كل {state.systemConfig.autoCaptureIntervalSec} ثانية على الجهاز.</p>
          <button type="button" className="primary-button" onClick={onCapture}><Camera size={16} /> التقاط نسخة الآن <ArrowUpLeft size={15} /></button>
        </div>
        <div className="hero-radar" aria-hidden="true">
          <div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-ring ring-three" />
          <div className="radar-sweep" /><div className="radar-core"><Zap size={23} /></div>
          <span className="radar-point point-one" /><span className="radar-point point-two" /><span className="radar-point point-three" />
        </div>
        <div className="hero-stats">
          <div><span>الإشغال الحالي</span><strong>{metrics.utilization}%</strong><small><TrendingUp size={12} /> +8.4% منذ الأمس</small></div>
          <div><span>آخر نسخة محلية</span><strong>{lastSnapshotAt ? formatRelativeTime(lastSnapshotAt) : "لم تُلتقط"}</strong><small><CheckCircle2 size={12} /> حماية تلقائية فعالة</small></div>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard label="إيرادات الوردية" value={formatMoney(metrics.revenue, state.systemConfig.currency)} hint="منذ بداية الوردية · نقدي + رقمي" icon={CircleDollarSign} accent="violet" trend="12.6%" />
        <MetricCard label="المحطات النشطة" value={`${metrics.active} / ${state.stations.length}`} hint="جلسات تعمل الآن على أرض الواقع" icon={Activity} accent="cyan" trend="4.2%" />
        <MetricCard label="طلبات المشروبات" value="24" hint="8 طلبات ما زالت قيد التجهيز" icon={Coffee} accent="orange" />
        <MetricCard label="تنبيهات المخزون" value={metrics.lowStock} hint="أصناف تحت الحد الأدنى" icon={Siren} accent="red" />
      </section>

      <section className="content-grid">
        <div className="stations-panel panel-card">
          <div className="section-heading">
            <div><span className="section-kicker">FLOOR MAP / 01</span><h3>المحطات والجلسات</h3></div>
            <div className="heading-tools"><span className="mini-legend"><i className="legend-dot active" /> نشطة</span><span className="mini-legend"><i className="legend-dot idle" /> متاحة</span><button type="button" className="outline-button"><Plus size={15} /> إضافة محطة</button></div>
          </div>
          <div className="stations-grid">
            {state.stations.map((station) => <StationCard key={station.id} station={station} currency={state.systemConfig.currency} onStartSession={onStartSession} onPauseSession={onPauseSession} onFinishSession={onFinishSession} />)}
          </div>
        </div>

        <aside className="activity-panel panel-card">
          <div className="section-heading compact"><div><span className="section-kicker">ACTIVITY STREAM</span><h3>آخر النشاطات</h3></div><button type="button" className="ghost-icon"><MoreHorizontal size={18} /></button></div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-icon purple"><Gamepad2 size={15} /></span><div><strong>بدء جلسة جديدة</strong><span>NEON 02 · سلمان العتيبي</span></div><time>منذ 4 د</time></div>
            <div className="activity-item"><span className="activity-icon orange"><Coffee size={15} /></span><div><strong>تم تسليم طلب</strong><span>Energy Drink × 2 · #ORD-219</span></div><time>منذ 9 د</time></div>
            <div className="activity-item"><span className="activity-icon cyan"><BatteryCharging size={15} /></span><div><strong>اكتملت الصيانة</strong><span>CLASSIC 01 · تنظيف عميق</span></div><time>منذ 21 د</time></div>
            <div className="activity-item"><span className="activity-icon red"><Siren size={15} /></span><div><strong>تنبيه مخزون</strong><span>Nachos أقل من الحد الأدنى</span></div><time>منذ 31 د</time></div>
          </div>
          <button type="button" className="view-all-button">عرض سجل التدقيق الكامل <ArrowUpLeft size={14} /></button>
        </aside>
      </section>

      <footer className="dashboard-footer"><span><Sparkles size={14} /> آخر تحديث للبيانات محليًا قبل لحظات</span><span>المزامنة السحابية: <b>جاهزة عند الاتصال</b></span><span><RefreshCw size={13} /> {formatRelativeTime(state.shiftReport.startTime)} منذ بداية الوردية</span></footer>
    </div>
  );
}
