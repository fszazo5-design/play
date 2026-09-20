from pathlib import Path

path = Path('/home/ubuntu/playroom-management-system/client/src/pages/OperationsPage.jsx')
text = path.read_text()
text = text.replace(
    'const money = (value, currency = "SAR") => formatMoney(Number(value || 0), currency);',
    'const money = (value, currency = "SAR") => formatMoney(Number(value || 0), currency);\nconst printDocument = (title) => { const previousTitle = document.title; document.title = title; window.setTimeout(() => { window.print(); document.title = previousTitle; }, 50); };',
    1,
)
text = text.replace(
    '<button type="button" className="print-button"><Download size={14} /> PDF</button>',
    '<button type="button" className="print-button" onClick={() => printDocument(`فاتورة ${session?.sessionId || "جلسة"}`)}><Download size={14} /> طباعة / PDF</button>',
    1,
)
text = text.replace(
    '<button type="button" className="print-report"><Download size={14} /> تنزيل تقرير الوردية</button>',
    '<button type="button" className="print-report" onClick={() => printDocument(`تقرير الوردية ${report.shiftId}`)}><Download size={14} /> طباعة / تصدير PDF</button>',
    1,
)
path.write_text(text)

css = Path('/home/ubuntu/playroom-management-system/client/src/index.css')
css.write_text(css.read_text() + '''\n\n/* Print / PDF export: use the browser's native Save as PDF dialog. */\n@page { size: A4; margin: 14mm; }\n@media print {\n  body { background: #fff !important; color: #111827 !important; }\n  .sidebar, .module-header, .module-stats, .checkout-aside, .close-shift, .back-link, .panel-toolbar, .split-payment, .print-button, .print-report, .module-date { display: none !important; }\n  .app-shell, .main-content, .module-page, .billing-layout, .shift-layout { display: block !important; min-height: auto !important; width: 100% !important; padding: 0 !important; margin: 0 !important; background: #fff !important; }\n  .invoice-panel, .report-panel { display: block !important; padding: 0 !important; border: 0 !important; border-radius: 0 !important; background: #fff !important; color: #111827 !important; box-shadow: none !important; }\n  .invoice-panel::before { content: "PLAYROOM OS  ·  فاتورة جلسة"; display: block; padding-bottom: 12px; margin-bottom: 18px; color: #111827; border-bottom: 2px solid #7c63ff; font: 700 18px "Space Grotesk", sans-serif; direction: rtl; }\n  .report-panel::before { content: "PLAYROOM OS  ·  تقرير الوردية"; display: block; padding-bottom: 12px; margin-bottom: 18px; color: #111827; border-bottom: 2px solid #7c63ff; font: 700 18px "Space Grotesk", sans-serif; direction: rtl; }\n  .invoice-head, .report-board { background: #f8fafc !important; border: 1px solid #dbe2ea !important; color: #111827 !important; }\n  .invoice-head *, .invoice-lines *, .report-board *, .report-bars * { color: #111827 !important; }\n  .invoice-lines > div, .report-row { border-color: #dbe2ea !important; }\n  .invoice-total strong, .report-total strong { color: #5b3fc4 !important; }\n  .report-bars > div > div { background: #e5e7eb !important; }\n  .report-bars i { print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n}\n''')
