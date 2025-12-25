# ✅ قائمة التحقق لنشر Render

## قبل النشر

### 1. Environment Variables في Render

تأكد من إضافة **جميع** المتغيرات التالية:

- [ ] `DATABASE_URL` = `postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon`
- [ ] `GEMINI_API_KEY` = `AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI`
- [ ] `JWT_SECRET` = `ilishfdlk451204fds4fdf15%DGH$#F%74ds1c`
- [ ] `NEW_SECRET` = `7008d7916e15e227ab636c615d13680e` (اختياري)
- [ ] `NODE_ENV` = `production`
- [ ] `VITE_APP_ID` = `space.manus.e_learning_mobile_app.t20251219214100` (اختياري)

### 2. إعدادات Web Service

- [ ] Name: `earning-mobile-api` (أو أي اسم)
- [ ] Repository: `mohamalk7744-jpg/learning`
- [ ] Branch: `main`
- [ ] Build Command: `pnpm install && pnpm build`
- [ ] Start Command: `pnpm start`
- [ ] Runtime: `Node`

### 3. قاعدة البيانات

- [ ] قاعدة البيانات موجودة على Render
- [ ] `DATABASE_URL` صحيح ومضبوط

---

## بعد النشر

### 1. التحقق من السيرفر

- [ ] افتح: `https://your-app.onrender.com/api/health`
- [ ] يجب أن ترى: `{"ok": true}`

### 2. إعداد قاعدة البيانات

- [ ] اذهب إلى Render Shell
- [ ] نفذ: `pnpm db:push`
- [ ] تأكد من نجاح العملية

### 3. اختبار API

- [ ] اختبر Register: `POST /api/auth/register`
- [ ] اختبر Login: `POST /api/auth/login`
- [ ] اختبر Health: `GET /api/health`

### 4. ربط التطبيق

- [ ] حدث `.env` في التطبيق:
  ```bash
  EXPO_PUBLIC_API_BASE_URL=https://your-app.onrender.com
  ```
- [ ] أعد تشغيل التطبيق
- [ ] اختبر تسجيل الدخول من التطبيق

---

## 🔍 استكشاف الأخطاء

### Build فشل:
- [ ] تحقق من Build Logs
- [ ] تأكد من `package.json` صحيح
- [ ] تأكد من Node version

### Start فشل:
- [ ] تحقق من Runtime Logs
- [ ] تأكد من Environment Variables
- [ ] تأكد من `DATABASE_URL` صحيح

### قاعدة البيانات لا تعمل:
- [ ] تحقق من `DATABASE_URL` صحيح
- [ ] شغّل `pnpm db:push` من Shell
- [ ] تأكد من أن قاعدة البيانات متاحة

---

## 📝 معلومات مهمة

### رابط السيرفر:
```
https://your-app-name.onrender.com
```

### Health Check:
```
https://your-app-name.onrender.com/api/health
```

### API Base:
```
https://your-app-name.onrender.com/api
```

---

**بعد إكمال جميع الخطوات، السيرفر سيعمل!** ✅

