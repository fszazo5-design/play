from pathlib import Path

root = Path('/home/ubuntu/playroom-management-system')

app = root / 'client/src/App.jsx'
text = app.read_text()
old = '  { id: "shifts", label: "تقارير الورديات", icon: BarChart3 },\n];'
new = '  { id: "shifts", label: "تقارير الورديات", icon: BarChart3 },\n  { id: "settings", label: "إعدادات الفرع", icon: Settings2 },\n];'
if old not in text:
    raise SystemExit('app navigation anchor not found')
app.write_text(text.replace(old, new, 1))

domain = root / 'client/src/lib/domain.js'
text = domain.read_text()
old = '      logoMark: "PX",\n      currency: "SAR",'
new = '      logoMark: "PX",\n      logoUrl: "",\n      currency: "SAR",'
if old not in text:
    raise SystemExit('domain logo anchor not found')
domain.write_text(text.replace(old, new, 1))

page = root / 'client/src/pages/OperationsPage.jsx'
text = page.read_text()
text = text.replace(
    'const labels = { inventory: "المخزون والمبيعات", players: "اللاعبون", reservations: "الحجوزات", tournaments: "البطولات", billing: "الفوترة والدفعات", shifts: "تقارير الورديات" };',
    'const labels = { inventory: "المخزون والمبيعات", players: "اللاعبون", reservations: "الحجوزات", tournaments: "البطولات", billing: "الفوترة والدفعات", shifts: "تقارير الورديات", settings: "إعدادات الفرع" };',
    1,
)
text = text.replace(
    '<div className="invoice-logo">{state.systemConfig.logoMark || "PX"}</div>',
    '<div className="invoice-logo">{state.systemConfig.logoUrl ? <img src={state.systemConfig.logoUrl} alt="شعار الفرع" /> : state.systemConfig.logoMark || "PX"}</div>',
    1,
)
anchor = 'function BillingPage({ state, updateState }) {'
settings = '''function SettingsPage({ state, updateState }) {
  const [draft, setDraft] = useState({ ...state.systemConfig });
  const [notice, setNotice] = useState("");
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const handleLogoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logoUrl", String(reader.result));
    reader.readAsDataURL(file);
  };
  const saveSettings = (event) => {
    event.preventDefault();
    updateState((current) => ({
      ...current,
      systemConfig: { ...current.systemConfig, ...draft },
      auditLogs: [{ id: `LOG-${Date.now()}`, timestamp: Date.now(), operatorId: "operator-local", action: "BRANCH_SETTINGS_UPDATED", details: "تم تحديث بيانات الفرع والشعار" }, ...current.auditLogs],
    }));
    setNotice("تم حفظ بيانات الفرع، وستظهر التغييرات في الفواتير المطبوعة.");
  };
  return <><Header label={labels.settings} icon={Settings2} subtitle="حدّث هوية الفرع التي تظهر في لوحة التحكم والفواتير والتقارير." /><div className="settings-layout"><section className="module-panel settings-panel"><div className="panel-toolbar"><div><div className="section-kicker">BRANCH IDENTITY</div><h3 className="panel-heading-title">بيانات الفرع</h3><p className="panel-heading-sub">تُحفظ التعديلات محليًا وتُستخدم مباشرة في الترويسة المطبوعة.</p></div><span className="settings-saved"><ShieldCheck size={14} /> حفظ محلي فوري</span></div><form className="settings-form" onSubmit={saveSettings}><div className="settings-section-title"><span className="module-icon"><Settings2 size={16} /></span><div><strong>البيانات الأساسية</strong><small>المعلومات التي تظهر للعملاء وفي التقارير</small></div></div><div className="form-grid"><Field label="اسم الفرع" value={draft.branchName || ""} onChange={(v) => update("branchName", v)} placeholder="Playroom Riyadh · الفرع الرئيسي" /><Field label="معرّف الفرع" value={draft.branchId || ""} onChange={(v) => update("branchId", v)} placeholder="PLAYROOM-RYD-01" /></div><Field label="العنوان" value={draft.branchAddress || ""} onChange={(v) => update("branchAddress", v)} placeholder="الحي، الشارع، المدينة" /><div className="form-grid"><Field label="رقم الهاتف" value={draft.branchPhone || ""} onChange={(v) => update("branchPhone", v)} placeholder="+966 ..." /><Field label="الرقم الضريبي" value={draft.taxNumber || ""} onChange={(v) => update("taxNumber", v)} placeholder="15 رقمًا" /></div><div className="settings-section-title second"><span className="module-icon violet-icon"><Sparkles size={16} /></span><div><strong>هوية الشعار</strong><small>اختر صورة صغيرة أو استخدم رمزًا نصيًا</small></div></div><div className="logo-editor"><div className="logo-preview">{draft.logoUrl ? <img src={draft.logoUrl} alt="معاينة الشعار" /> : draft.logoMark || "PX"}</div><div className="logo-controls"><Field label="رمز الشعار النصي" value={draft.logoMark || ""} onChange={(v) => update("logoMark", v)} placeholder="PX" /><label className="upload-logo"><span><Download size={14} /> رفع شعار PNG / JPG</span><input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoFile} /></label>{draft.logoUrl && <button type="button" className="clear-logo" onClick={() => update("logoUrl", "")}>استخدام الرمز النصي بدل الصورة</button>}</div></div><div className="settings-footer"><div>{notice && <span className="success-notice"><Check size={14} /> {notice}</span>}</div><ModuleButton><Check size={15} /> حفظ إعدادات الفرع</ModuleButton></div></form></section><aside className="module-panel settings-preview"><div className="section-kicker">LIVE PREVIEW</div><h3>معاينة الترويسة</h3><p>هذه المعاينة مطابقة للبيانات التي ستظهر أعلى الفاتورة عند الطباعة.</p><div className="invoice-preview-card"><div className="preview-brand"><div className="invoice-logo">{draft.logoUrl ? <img src={draft.logoUrl} alt="" /> : draft.logoMark || "PX"}</div><div><strong>{draft.branchName || "اسم الفرع"}</strong><span>{draft.branchAddress || "العنوان"}</span><small>{draft.branchPhone || "رقم الهاتف"}</small></div></div><div className="preview-tax"><span>الرقم الضريبي</span><b>{draft.taxNumber || "غير مسجل"}</b><small>{draft.branchId || "BRANCH-ID"}</small></div></div><div className="settings-tip"><ShieldCheck size={16} /><span>الشعار والبيانات تحفظ تلقائيًا على هذا الجهاز ضمن حالة النظام المحلية.</span></div></aside></div></>;
}

'''
if anchor not in text:
    raise SystemExit('billing anchor not found')
text = text.replace(anchor, settings + anchor, 1)
old_map = 'billing: <BillingPage state={state} updateState={updateState} />, shifts: <ShiftsPage state={state} updateState={updateState} /> }[kind];'
new_map = 'billing: <BillingPage state={state} updateState={updateState} />, shifts: <ShiftsPage state={state} updateState={updateState} />, settings: <SettingsPage state={state} updateState={updateState} /> }[kind];'
if old_map not in text:
    raise SystemExit('page map anchor not found')
page.write_text(text.replace(old_map, new_map, 1))

css = root / 'client/src/index.css'
text = css.read_text()
text += '''\n\n/* Branch settings */\n.settings-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 16px; }\n.settings-panel { min-width: 0; }.settings-saved { display: inline-flex; align-items: center; gap: 5px; color: var(--green); background: rgba(109,228,165,.08); border-radius: 7px; padding: 7px 9px; font-size: 9px; }.settings-form { max-width: 760px; }.settings-section-title { display: flex; align-items: center; gap: 9px; padding: 14px 0 15px; margin-top: 2px; border-top: 1px solid rgba(255,255,255,.07); }.settings-section-title.second { margin-top: 10px; }.settings-section-title strong, .settings-section-title small { display: block; }.settings-section-title strong { font-size: 11px; }.settings-section-title small { color: #6f7b8f; font-size: 9px; margin-top: 4px; }.violet-icon { color: var(--violet); background: rgba(155,123,255,.1); border-color: rgba(155,123,255,.2); }.logo-editor { display: flex; align-items: center; gap: 15px; margin-bottom: 16px; }.logo-preview { width: 64px; height: 64px; display: grid; place-items: center; flex: 0 0 auto; overflow: hidden; border-radius: 16px; color: #fff; background: linear-gradient(135deg, #7c63ff, #bb56da); box-shadow: 0 0 25px rgba(153,93,255,.23); font: 700 17px "Space Grotesk", sans-serif; }.logo-preview img, .invoice-logo img { width: 100%; height: 100%; object-fit: contain; border-radius: inherit; }.logo-controls { flex: 1; }.upload-logo { display: inline-flex; align-items: center; gap: 6px; color: var(--cyan); border: 1px dashed rgba(57,214,232,.35); border-radius: 8px; padding: 8px 10px; font-size: 9px; cursor: pointer; }.upload-logo input { display: none; }.clear-logo { display: block; border: 0; background: transparent; color: #8390a3; font-size: 9px; margin-top: 8px; padding: 0; }.clear-logo:hover { color: var(--red); }.settings-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 17px; margin-top: 4px; border-top: 1px solid rgba(255,255,255,.07); }.settings-preview { align-self: start; }.settings-preview h3 { margin: 8px 0 6px; font-size: 18px; }.settings-preview > p { color: #748095; font-size: 10px; line-height: 1.7; margin: 0 0 17px; }.invoice-preview-card { padding: 14px; border: 1px solid #dbe2ea; border-radius: 10px; background: #f8fafc; color: #111827; }.preview-brand { display: flex; align-items: flex-start; gap: 9px; padding-bottom: 11px; border-bottom: 2px solid #7c63ff; }.preview-brand .invoice-logo { width: 34px; height: 34px; border-radius: 9px; color: #fff; background: #7c63ff; font-size: 11px; }.preview-brand strong, .preview-brand span, .preview-brand small { display: block; }.preview-brand strong { font-size: 10px; }.preview-brand span, .preview-brand small { color: #4b5563; font-size: 8px; margin-top: 3px; }.preview-tax { padding-top: 11px; text-align: left; }.preview-tax span, .preview-tax b, .preview-tax small { display: block; color: #111827; }.preview-tax span, .preview-tax small { color: #4b5563; font-size: 8px; }.preview-tax b { font: 600 9px "Space Grotesk", sans-serif; margin: 3px 0; }.settings-tip { display: flex; align-items: flex-start; gap: 7px; margin-top: 15px; padding: 11px; color: #9a86d8; background: rgba(155,123,255,.08); border-radius: 8px; font-size: 9px; line-height: 1.7; }.settings-tip svg { flex: 0 0 auto; }\n@media (max-width: 980px) { .settings-layout { grid-template-columns: 1fr; }.settings-preview { max-width: none; } }\n@media (max-width: 680px) { .settings-footer { align-items: stretch; flex-direction: column; }.logo-editor { align-items: flex-start; flex-direction: column; }.logo-controls { width: 100%; } }\n@media print { .invoice-logo img { width: 100%; height: 100%; object-fit: contain; } }\n'''
css.write_text(text)
