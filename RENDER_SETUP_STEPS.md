# خطوات إنشاء Web Service على Render

## الخطوة 1: إنشاء Web Service جديد

1. **اذهب إلى [Render Dashboard](https://dashboard.render.com)**
   - سجل دخول أو أنشئ حساب جديد

2. **انقر على "New +"** (في الأعلى)
   - اختر **"Web Service"**

3. **اربط مستودع GitHub**
   - إذا لم تكن مرتبطاً: انقر "Connect GitHub" واتبع التعليمات
   - اختر المستودع الخاص بمشروعك
   - اختر الفرع (Branch): عادة `main` أو `master`

## الخطوة 2: إعدادات الخدمة

### Basic Settings (الإعدادات الأساسية):

- **Name**: اختر اسماً لخدمتك (مثل: `earning-mobile-api`)
  - ⚠️ هذا الاسم سيظهر في الرابط: `https://earning-mobile-api.onrender.com`
  
- **Region**: اختر أقرب منطقة (مثل: `Frankfurt` أو `Singapore`)

- **Branch**: اختر الفرع (عادة `main`)

- **Root Directory**: اتركه فارغاً (إذا كان المشروع في الجذر)

- **Runtime**: اختر `Node`

- **Build Command**: 
  ```bash
  pnpm install && pnpm build
  ```

- **Start Command**: 
  ```bash
  pnpm start
  ```

## الخطوة 3: إضافة Environment Variables

في قسم **"Environment"**، أضف المتغيرات التالية:

### متغيرات مطلوبة:

```bash
# Gemini API Key
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# Database Connection (من Render Database أو خارجي)
DATABASE_URL=mysql://username:password@host:port/database_name

# OAuth Configuration
VITE_APP_ID=your_app_id_here
OAUTH_SERVER_URL=https://your-oauth-server.com
OWNER_OPEN_ID=your_owner_open_id_here

# JWT Secret (أنشئ مفتاح عشوائي قوي)
JWT_SECRET=your_very_strong_random_secret_key_min_32_chars

# Environment
NODE_ENV=production
```

### كيفية إضافة متغير:

1. انقر على **"Add Environment Variable"**
2. أدخل **Name** (مثل: `GEMINI_API_KEY`)
3. أدخل **Value** (مثل: `AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI`)
4. انقر **"Save Changes"**

## الخطوة 4: إنشاء قاعدة البيانات (إذا لم تكن موجودة)

### خيار أ: Render Database

1. في Dashboard، انقر **"New +"**
2. اختر **"MySQL"** (أو PostgreSQL)
3. اختر اسم للقاعدة (مثل: `earning_db`)
4. بعد الإنشاء، اذهب إلى **"Info"** tab
5. انسخ **Internal Database URL** أو استخدم:
   ```
   mysql://user:password@host:port/database
   ```
6. أضفها في `DATABASE_URL` في Environment Variables

### خيار ب: قاعدة بيانات خارجية

- استخدم معلومات الاتصال من مزود قاعدة البيانات الخاص بك

## الخطوة 5: النشر

1. بعد إضافة جميع Environment Variables
2. انقر **"Create Web Service"**
3. Render سيبدأ:
   - Clone المستودع
   - تثبيت Dependencies (`pnpm install`)
   - Build المشروع (`pnpm build`)
   - تشغيل السيرفر (`pnpm start`)

## الخطوة 6: الحصول على الرابط

بعد اكتمال النشر (قد يستغرق 5-10 دقائق):

1. **الرابط الافتراضي**:
   ```
   https://your-service-name.onrender.com
   ```
   - استبدل `your-service-name` بالاسم الذي اخترته

2. **للتحقق من أن السيرفر يعمل**:
   - افتح: `https://your-service-name.onrender.com/api/health`
   - يجب أن ترى: `{"status":"ok"}` أو رسالة مشابهة

## الخطوة 7: إعداد قاعدة البيانات

بعد النشر، ستحتاج لتشغيل Migrations:

### خيار أ: عبر Render Shell

1. في Dashboard، اذهب إلى خدمتك
2. انقر على **"Shell"** tab
3. نفذ:
   ```bash
   pnpm db:push
   ```

### خيار ب: محلياً

1. أضف `DATABASE_URL` في `.env` المحلي
2. نفذ:
   ```bash
   pnpm db:push
   ```

## معلومات مهمة

### ⚠️ ملاحظات:

1. **الرابط المجاني**:
   - Render يعطي رابط مجاني مثل: `https://your-app.onrender.com`
   - يمكنك إضافة Custom Domain لاحقاً

2. **Free Tier Limitations**:
   - السيرفر ينام بعد 15 دقيقة من عدم الاستخدام
   - أول طلب بعد النوم قد يستغرق 30-60 ثانية (Cold Start)

3. **Environment Variables**:
   - لا تشارك القيم الحساسة علناً
   - يمكنك تغييرها لاحقاً من Settings → Environment

4. **Logs**:
   - يمكنك رؤية Logs من Dashboard
   - Build Logs: تظهر أثناء النشر
   - Runtime Logs: تظهر أثناء التشغيل

## مثال كامل

### اسم الخدمة:
```
earning-mobile-api
```

### الرابط النهائي:
```
https://earning-mobile-api.onrender.com
```

### API Endpoints:
```
https://earning-mobile-api.onrender.com/api/trpc
https://earning-mobile-api.onrender.com/api/health
https://earning-mobile-api.onrender.com/api/auth/me
```

## استكشاف الأخطاء

### إذا فشل Build:

1. تحقق من **Build Logs**
2. تأكد من:
   - `package.json` يحتوي على scripts صحيحة
   - جميع Dependencies موجودة
   - Node version متوافق

### إذا فشل Start:

1. تحقق من **Runtime Logs**
2. تأكد من:
   - جميع Environment Variables موجودة
   - `DATABASE_URL` صحيح
   - Port صحيح (Render يستخدم `PORT` environment variable)

### إذا كان السيرفر لا يستجيب:

1. تحقق من Runtime Logs
2. تأكد من أن السيرفر يعمل على Port الصحيح
3. Render يستخدم متغير `PORT` تلقائياً

## الخطوات التالية

بعد الحصول على الرابط:

1. ✅ اختبر Health Check: `https://your-app.onrender.com/api/health`
2. ✅ اختبر API endpoints
3. ✅ حدث `VITE_API_BASE_URL` في تطبيقك المحمول
4. ✅ اختبر التطبيق مع السيرفر

---

## ملخص سريع:

1. **New +** → **Web Service**
2. اربط GitHub repository
3. أدخل:
   - Name: `earning-mobile-api`
   - Build: `pnpm install && pnpm build`
   - Start: `pnpm start`
4. أضف Environment Variables
5. **Create Web Service**
6. انتظر النشر (5-10 دقائق)
7. احصل على الرابط: `https://earning-mobile-api.onrender.com`

