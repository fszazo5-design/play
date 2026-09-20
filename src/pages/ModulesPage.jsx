import { ArrowRight, BarChart3, CalendarClock, CreditCard, LayoutDashboard, MonitorPlay, Package, Settings2, Sparkles, Trophy, Users } from "lucide-react";

const modules = [
  { id: "overview", label: "نظرة عامة", description: "مؤشرات الصالة والإيرادات والمحطات", icon: LayoutDashboard, accent: "violet" },
  { id: "stations", label: "المحطات والجلسات", description: "تشغيل المحطات ومتابعة الجلسات", icon: MonitorPlay, accent: "cyan" },
  { id: "inventory", label: "المخزون والمبيعات", description: "الأصناف والمخزون ونقطة البيع", icon: Package, accent: "orange" },
  { id: "players", label: "اللاعبون", description: "ملفات اللاعبين والولاء والمحافظ", icon: Users, accent: "green" },
  { id: "tournaments", label: "البطولات", description: "المنافسات والمشاركون والنتائج", icon: Trophy, accent: "violet" },
  { id: "reservations", label: "الحجوزات", description: "جدولة المحطات والعربون", icon: CalendarClock, accent: "cyan" },
  { id: "billing", label: "الفوترة والدفعات", description: "الفواتير والدفع المنقسم", icon: CreditCard, accent: "green" },
  { id: "shifts", label: "تقارير الورديات", description: "الإيرادات وإغلاق الوردية", icon: BarChart3, accent: "orange" },
  { id: "settings", label: "إعدادات الفرع", description: "بيانات الفرع والشعار والتثبيت", icon: Settings2, accent: "violet" },
];

export default function ModulesPage({ onOpen }) {
  return <div className="modules-page">
    <header className="modules-page-header">
      <div><button type="button" className="back-link" onClick={() => onOpen("overview")}><ArrowRight size={14}/> لوحة التحكم</button><div className="section-kicker">PLAYROOM OS / MODULES GRID</div><h2>كل أدوات الصالة في مكان واحد</h2><p>افتح أي وحدة مباشرة من شبكة واضحة ومصممة للمس والكمبيوتر.</p></div>
      <div className="modules-header-orb"><Sparkles size={21}/></div>
    </header>
    <section className="modules-grid" aria-label="وحدات النظام">
      {modules.map(({ id, label, description, icon: Icon, accent }) => <button key={id} type="button" className={`module-tile accent-${accent}`} onClick={() => onOpen(id)}><span className="module-tile-icon"><Icon size={22}/></span><span className="module-tile-copy"><strong>{label}</strong><small>{description}</small></span><span className="module-tile-arrow"><ArrowRight size={15}/></span></button>)}
    </section>
  </div>;
}
