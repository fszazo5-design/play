# Neon + Vercel API

يضيف المشروع طبقة HTTP مستقلة تحت `api/` لتخزين snapshots الخاصة بحالة Playroom في Neon عند نشر الموقع على Vercel. التطبيق لا يتصل بـ Neon مباشرة من المتصفح؛ المتصفح يرسل إلى `/api/snapshots`، وتنفذ Vercel Function عملية الكتابة باستخدام `NEON_DATABASE_URL` على الخادم.

## الإعداد على Vercel

أضف متغيرات البيئة التالية إلى مشروع Vercel:

| المتغير | الاستخدام |
| --- | --- |
| `NEON_DATABASE_URL` | رابط اتصال PostgreSQL من Neon، ويجب أن يبقى Server-only. |
| `PLAYROOM_SYNC_TOKEN` | رمز حماية اختياري لنقاط API. |
| `VITE_PLAYROOM_SYNC_TOKEN` | نفس الرمز أثناء بناء الواجهة؛ لأنه يصل إلى المتصفح فهو ليس سرًا عالي الحساسية. |
| `PLAYROOM_ALLOWED_ORIGIN` | أصل الموقع المسموح به، مثل `https://playroom.example.com`. اتركه فارغًا للتجربة فقط. |
| `VITE_PLAYROOM_API_URL` | اختياري؛ اتركه فارغًا لاستخدام نفس الأصل `/api`. |

في بيئة الإنتاج، إذا كان `PLAYROOM_SYNC_TOKEN` غير مضبوط، سترفض نقاط API الطلبات لحماية قاعدة البيانات.

## تهيئة جدول Neon

نفّذ SQL الموجود في `sql/playroom_snapshots.sql` مرة واحدة على قاعدة Neon. الاستعلامات تستخدم `IF NOT EXISTS` ويمكن تشغيلها بأمان أكثر من مرة. لا تضع رابط Neon داخل `src/` أو أي كود يعمل في المتصفح.

## نقاط HTTP

| الطريقة | الرابط | الوظيفة |
| --- | --- | --- |
| `GET` | `/api/health` | اختبار اتصال Vercel بـ Neon. |
| `POST` | `/api/snapshots` | حفظ snapshot لحالة فرع كاملة. |
| `GET` | `/api/snapshots?branchId=PLAYROOM-RYD-01&limit=10` | قراءة آخر snapshots للفرع. |

يُرسل رمز الحماية في الترويسة `X-Playroom-Sync-Token`. يحتفظ التطبيق بالبيانات محليًا أولًا، ثم يفرغ طابور المزامنة عند بدء التشغيل أو عودة الاتصال. إذا فشل الطلب، تبقى العناصر في `localStorage` لإعادة المحاولة لاحقًا.
