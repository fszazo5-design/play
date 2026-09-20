from pathlib import Path

root = Path('/home/ubuntu/playroom-management-system')

domain = root / 'client/src/lib/domain.js'
text = domain.read_text()
old = '''      branchId: "PLAYROOM-RYD-01",
      currency: "SAR",'''
new = '''      branchId: "PLAYROOM-RYD-01",
      branchName: "Playroom Riyadh · الفرع الرئيسي",
      branchAddress: "طريق الملك فهد، حي العليا، الرياض",
      branchPhone: "+966 11 234 5678",
      taxNumber: "310123456700003",
      logoMark: "PX",
      currency: "SAR",'''
if old not in text:
    raise SystemExit('domain anchor not found')
domain.write_text(text.replace(old, new, 1))

page = root / 'client/src/pages/OperationsPage.jsx'
text = page.read_text()
old = '<section className="module-panel invoice-panel"><div className="panel-toolbar">'
new = '<section className="module-panel invoice-panel"><div className="invoice-print-header"><div className="invoice-logo">{state.systemConfig.logoMark || "PX"}</div><div className="invoice-branch-details"><strong>{state.systemConfig.branchName || "Playroom OS"}</strong><span>{state.systemConfig.branchAddress || ""}</span><small>{state.systemConfig.branchPhone || ""}</small></div><div className="invoice-tax-details"><span>الرقم الضريبي</span><b>{state.systemConfig.taxNumber || "غير مسجل"}</b><small>{state.systemConfig.branchId}</small></div></div><div className="panel-toolbar">'
if old not in text:
    raise SystemExit('invoice anchor not found')
page.write_text(text.replace(old, new, 1))

css = root / 'client/src/index.css'
text = css.read_text()
old = '''  .invoice-panel::before { content: "PLAYROOM OS  ·  فاتورة جلسة"; display: block; padding-bottom: 12px; margin-bottom: 18px; color: #111827; border-bottom: 2px solid #7c63ff; font: 700 18px "Space Grotesk", sans-serif; direction: rtl; }
'''
new = '''  .invoice-panel::before { display: none; }
  .invoice-print-header { display: flex !important; align-items: flex-start; gap: 13px; padding-bottom: 14px; margin-bottom: 18px; border-bottom: 2px solid #7c63ff; direction: rtl; }
  .invoice-logo { width: 45px; height: 45px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 13px; color: #fff !important; background: #7c63ff !important; font: 700 15px "Space Grotesk", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .invoice-branch-details { flex: 1; text-align: right; }
  .invoice-branch-details strong, .invoice-branch-details span, .invoice-branch-details small, .invoice-tax-details span, .invoice-tax-details b, .invoice-tax-details small { display: block; color: #111827 !important; }
  .invoice-branch-details strong { font-size: 16px; margin-bottom: 5px; }
  .invoice-branch-details span, .invoice-branch-details small, .invoice-tax-details span, .invoice-tax-details small { font-size: 9px; color: #4b5563 !important; }
  .invoice-tax-details { min-width: 135px; text-align: left; border-right: 1px solid #dbe2ea; padding-right: 12px; }
  .invoice-tax-details b { font: 600 10px "Space Grotesk", sans-serif; margin: 5px 0; }
'''
if old not in text:
    raise SystemExit('print css anchor not found')
css.write_text(text.replace(old, new, 1))
