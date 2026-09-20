# Playroom OS — الهيكل الأولي

هذا المشروع هو نقطة بداية عملية لنظام إدارة صالة ألعاب يعمل بأسلوب **offline-first**، ومبني على React/Vite مع طبقة خادم جاهزة للتوسع.

## المجلدات الأساسية

```text
client/
  public/
    manifest.json             # إعداد التثبيت كتطبيق PWA
    service-worker.js         # cache-first shell للويب-فيو
  src/
    App.jsx                   # القشرة العامة، التنقل، وربط الحالة
    main.jsx                  # نقطة تشغيل React وتسجيل service worker
    index.css                 # نظام التصميم الداكن والنيون
    pages/
      Home.jsx                # لوحة التحكم الرئيسية
      NotFound.jsx            # حالة الوحدات غير المنفذة بعد
    hooks/
      usePlayroomState.js     # الحالة، الجلسات، الحفظ، والنسخ الدورية
    lib/
      domain.js               # نموذج البيانات الأولي والمؤشرات
      storage.js              # localStorage ونسخ JSON المحلية
      sync.js                 # طابور المزامنة عند عودة الاتصال

shared/
  playroom-schema.js          # ثوابت وصيغة snapshot المشتركة للعميل والخادم

server/
  playroomSync.ts             # عقد التحقق وفضّ تعارض snapshots
  routers.ts                   # نقطة إضافة إجراءات tRPC لاحقًا
  db.ts                        # طبقة Drizzle المولّدة من القالب
  _core/                      # البنية التحتية للمصادقة وVite وtRPC

drizzle/
  schema.ts                   # جداول قاعدة البيانات الأساسية
```

## مسار البيانات المحلي

1. يبدأ التطبيق من `createDefaultState()` في `client/src/lib/domain.js`.
2. تتم قراءة الحالة من `localStorage` عند التشغيل.
3. كل تعديل في `usePlayroomState` يحفظ الحالة فورًا ويضيف حدثًا إلى طابور المزامنة.
4. يتم حفظ snapshot كامل كل 30 ثانية أو يدويًا من زر «التقاط نسخة الآن».
5. عند عودة الاتصال، يبقى طابور المزامنة جاهزًا لربطه بإجراء tRPC أو API سحابي.

## نقاط التوسع التالية

- نقل snapshot envelopes إلى جدول `playroom_snapshots` في Drizzle.
- إضافة إجراءات tRPC مثل `playroom.snapshot.push` و`playroom.snapshot.latest`.
- استبدال no-op في `flushSyncQueue` باستدعاء tRPC مع retry وbackoff.
- إضافة صفحات المحطات، المخزون، اللاعبين، الحجوزات، والبطولات بنفس القالب البصري.
- إضافة اختبارات Vitest للتحقق من استعادة snapshot وحساب الفواتير وحل التعارض.
