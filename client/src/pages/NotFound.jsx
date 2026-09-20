import { ArrowRight, Construction, LayoutDashboard } from "lucide-react";

export default function NotFound({ viewName = "هذه الوحدة" }) {
  return (
    <div className="placeholder-page" dir="rtl">
      <div className="placeholder-card">
        <span className="placeholder-icon"><Construction size={26} /></span>
        <span className="section-kicker">MODULE IN PROGRESS</span>
        <h2>{viewName} قيد البناء</h2>
        <p>تم تجهيز مكان هذه الوحدة داخل الهيكل modular، وستتصل بنفس نموذج البيانات والتخزين المحلي عند تنفيذها.</p>
        <button type="button" className="primary-button" onClick={() => window.history.back()}><ArrowRight size={15} /> العودة للوحة التحكم</button>
      </div>
    </div>
  );
}
