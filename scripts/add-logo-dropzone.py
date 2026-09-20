from pathlib import Path

path = Path('/home/ubuntu/playroom-management-system/client/src/pages/OperationsPage.jsx')
text = path.read_text()
old = '''  const [draft, setDraft] = useState({ ...state.systemConfig });
  const [notice, setNotice] = useState("");
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const handleLogoFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logoUrl", String(reader.result));
    reader.readAsDataURL(file);
  };'''
new = '''  const [draft, setDraft] = useState({ ...state.systemConfig });
  const [notice, setNotice] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [logoError, setLogoError] = useState("");
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const readLogoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setLogoError("يرجى اختيار ملف صورة صالح."); return; }
    if (file.size > 2 * 1024 * 1024) { setLogoError("حجم الشعار يجب ألا يتجاوز 2MB."); return; }
    setLogoError("");
    const reader = new FileReader();
    reader.onload = () => update("logoUrl", String(reader.result));
    reader.readAsDataURL(file);
  };
  const handleLogoFile = (event) => readLogoFile(event.target.files?.[0]);
  const handleDrop = (event) => { event.preventDefault(); setIsDragging(false); readLogoFile(event.dataTransfer.files?.[0]); };'''
if old not in text:
    raise SystemExit('settings state anchor not found')
text = text.replace(old, new, 1)
old = '''<label className="upload-logo"><span><Download size={14} /> رفع شعار PNG / JPG</span><input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoFile} /></label>{draft.logoUrl && <button type="button" className="clear-logo" onClick={() => update("logoUrl", "")}>استخدام الرمز النصي بدل الصورة</button>}'''
new = '''<label className={`logo-dropzone ${isDragging ? "dragging" : ""}`} onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }} onDrop={handleDrop}><input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoFile} /><span className="dropzone-icon"><Download size={17} /></span><span><strong>{isDragging ? "أفلت الشعار هنا" : "اسحب الشعار وأفلته هنا"}</strong><small>أو انقر للاختيار · PNG / JPG / SVG · حتى 2MB</small></span></label>{logoError && <p className="logo-error">{logoError}</p>}{draft.logoUrl && <button type="button" className="clear-logo" onClick={() => update("logoUrl", "")}>استخدام الرمز النصي بدل الصورة</button>}'''
if old not in text:
    raise SystemExit('upload markup anchor not found')
path.write_text(text.replace(old, new, 1))

css = Path('/home/ubuntu/playroom-management-system/client/src/index.css')
text = css.read_text()
text += '''\n\n/* Drag and drop logo upload */\n.logo-dropzone { display: flex; align-items: center; gap: 9px; width: 100%; padding: 11px; border: 1px dashed rgba(57,214,232,.35); border-radius: 10px; color: var(--cyan); background: rgba(57,214,232,.035); cursor: pointer; transition: border-color .18s var(--ease-out), background .18s var(--ease-out), transform .18s var(--ease-out); }.logo-dropzone:hover, .logo-dropzone.dragging { border-color: var(--cyan); background: rgba(57,214,232,.11); transform: translateY(-1px); }.logo-dropzone input { display: none; }.dropzone-icon { width: 30px; height: 30px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 8px; background: rgba(57,214,232,.12); }.logo-dropzone strong, .logo-dropzone small { display: block; }.logo-dropzone strong { color: #dceaf0; font-size: 10px; }.logo-dropzone small { color: #6f8290; font-size: 8px; margin-top: 4px; }.logo-error { color: var(--red); font-size: 9px; margin: 7px 0 0; }\n'''
css.write_text(text)
