# 🔗 دليل ربط المستودع مع Render

## المستودع على GitHub
**الرابط**: https://github.com/mohamalk7744-jpg/learning

---

## خطوات الربط السريعة

### 1️⃣ إنشاء Web Service على Render

1. **اذهب إلى**: [Render Dashboard](https://dashboard.render.com)
2. **انقر**: "New +" (في الأعلى)
3. **اختر**: "Web Service"

### 2️⃣ ربط المستودع

1. **في صفحة "Create a new Web Service"**:
   - إذا لم تكن مرتبطاً بـ GitHub:
     - انقر "Connect GitHub"
     - سجل دخول وامنح Render صلاحيات الوصول
   
2. **بعد الربط**:
   - ابحث عن المستودع: `mohamalk7744-jpg/learning`
   - أو أدخل الرابط: `https://github.com/mohamalk7744-jpg/learning`
   - انقر على المستودع

3. **اختر الفرع**:
   - Branch: `main` (أو `master` حسب ما هو موجود)

### 3️⃣ إعدادات الخدمة

#### Basic Settings:

- **Name**: `earning-mobile-api` (أو أي اسم تريده)
  - ⚠️ سيظهر في الرابط: `https://earning-mobile-api.onrender.com`

- **Region**: اختر أقرب منطقة (مثل: `Frankfurt` أو `Singapore`)

- **Root Directory**: اتركه فارغاً

- **Runtime**: `Node`

#### Build & Deploy:

- **Build Command**:
  ```bash
  pnpm install && pnpm build
  ```

- **Start Command**:
  ```bash
  pnpm start
  ```

- **Auto-Deploy**: `Yes` (للتحديث التلقائي عند Push)

### 4️⃣ إضافة Environment Variables

**في قسم "Environment"**، أضف:

```bash
# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# Database (PostgreSQL من Render)
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# OAuth (من Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://your-oauth-server.com
OWNER_OPEN_ID=your_owner_open_id

# Security
JWT_SECRET=your_very_strong_random_secret_key_min_32_chars

# Environment
NODE_ENV=production
```

**كيفية الإضافة**:
1. انقر "Add Environment Variable"
2. أدخل Name و Value
3. انقر "Save Changes"
4. كرر لكل متغير

### 5️⃣ إنشاء قاعدة البيانات (إذا لم تكن موجودة)

#### خيار أ: Render Database

1. في Dashboard، انقر "New +"
2. اختر "MySQL"
3. Name: `earning_db` (أو أي اسم)
4. بعد الإنشاء:
   - اذهب إلى "Info" tab
   - انسخ "Internal Database URL"
   - أضفها في `DATABASE_URL`

#### خيار ب: قاعدة بيانات خارجية

- استخدم معلومات الاتصال من مزودك

### 6️⃣ النشر

1. **انقر**: "Create Web Service"
2. **انتظر**: 5-10 دقائق للنشر
3. **راقب**: Build Logs للتأكد من نجاح النشر

### 7️⃣ الحصول على الرابط

بعد اكتمال النشر:

- **الرابط**: `https://earning-mobile-api.onrender.com`
  - (استبدل `earning-mobile-api` بالاسم الذي اخترته)

- **للتحقق**:
  ```
  https://earning-mobile-api.onrender.com/api/health
  ```
  يجب أن ترى: `{"ok":true,"timestamp":...}`

---

## 📋 قائمة التحقق

- [ ] حساب Render موجود
- [ ] GitHub مرتبط مع Render
- [ ] المستودع `mohamalk7744-jpg/learning` مرتبط
- [ ] Web Service تم إنشاؤه
- [ ] Environment Variables مضافة (جميعها)
- [ ] قاعدة البيانات موجودة ومرتبطة
- [ ] Build نجح
- [ ] السيرفر يعمل (Health Check)

---

## 🔧 إعداد قاعدة البيانات بعد النشر

بعد نشر السيرفر:

1. **في Render Dashboard**:
   - اذهب إلى خدمتك
   - انقر "Shell" tab
   - نفذ:
     ```bash
     pnpm db:push
     ```

أو محلياً:
```bash
# أضف DATABASE_URL في .env
DATABASE_URL=mysql://user:password@host:port/database

# ثم نفذ
pnpm db:push
```

---

## ⚠️ ملاحظات مهمة

1. **Free Tier**:
   - السيرفر ينام بعد 15 دقيقة
   - أول طلب بعد النوم قد يستغرق 30-60 ثانية

2. **Environment Variables**:
   - لا تشارك القيم الحساسة علناً
   - يمكن تغييرها لاحقاً من Settings

3. **Auto-Deploy**:
   - عند Push إلى `main`، Render سيعيد النشر تلقائياً

4. **Logs**:
   - Build Logs: أثناء النشر
   - Runtime Logs: أثناء التشغيل
   - يمكنك رؤيتها من Dashboard

---

## 🆘 استكشاف الأخطاء

### Build فشل:
- تحقق من Build Logs
- تأكد من أن `package.json` صحيح
- تأكد من Node version

### Start فشل:
- تحقق من Runtime Logs
- تأكد من Environment Variables
- تأكد من `DATABASE_URL` صحيح

### السيرفر لا يستجيب:
- تحقق من Runtime Logs
- تأكد من أن Port صحيح
- Render يستخدم `PORT` environment variable تلقائياً

---

## 📞 بعد الحصول على الرابط

بعد الحصول على رابط السيرفر:

1. ✅ اختبر: `https://your-app.onrender.com/api/health`
2. ✅ حدث `VITE_API_BASE_URL` في تطبيقك
3. ✅ اختبر التطبيق مع السيرفر

---

## 🎯 ملخص سريع

```
1. Render Dashboard → New + → Web Service
2. اربط: mohamalk7744-jpg/learning
3. Name: earning-mobile-api
4. Build: pnpm install && pnpm build
5. Start: pnpm start
6. أضف Environment Variables
7. Create Web Service
8. انتظر النشر
9. احصل على: https://earning-mobile-api.onrender.com
```

---

**رابط المستودع**: https://github.com/mohamalk7744-jpg/learning

