# دليل نشر التطبيق على Render

هذا الدليل يشرح كيفية ربط ونشر السيرفر على Render.

## المتطلبات الأساسية

1. حساب على [Render](https://render.com)
2. قاعدة بيانات MySQL (يمكن استخدام Render Database أو أي مزود آخر)
3. مفتاح Gemini API

## الخطوات

### 1. إعداد قاعدة البيانات

#### خيار أ: استخدام Render Database
1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. انقر على "New +" واختر "PostgreSQL" أو "MySQL"
3. اختر اسم للقاعدة البيانات
4. بعد الإنشاء، احصل على:
   - **Database URL** (مثل: `mysql://user:password@host:port/database`)
   - **Host**
   - **Port**
   - **Database Name**
   - **Username**
   - **Password**

#### خيار ب: استخدام قاعدة بيانات خارجية
- استخدم نفس المعلومات المطلوبة أعلاه

### 2. إعداد متغيرات البيئة في Render

عند إنشاء Web Service جديد على Render، ستحتاج إلى إضافة المتغيرات التالية في قسم "Environment":

#### متغيرات مطلوبة:

```bash
# Gemini API Key
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# Database Connection
DATABASE_URL=mysql://username:password@host:port/database_name

# OAuth Configuration (من Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://your-oauth-server.com
OWNER_OPEN_ID=your_owner_open_id

# JWT Secret (أنشئ مفتاح عشوائي قوي)
JWT_SECRET=your_very_strong_random_secret_key_here

# Optional: Forge API (إذا كنت تستخدمه)
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=

# Environment
NODE_ENV=production
```

### 3. إنشاء Web Service على Render

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. انقر على "New +" واختر "Web Service"
3. اربط مستودع GitHub الخاص بك
4. اختر الفرع (Branch) الذي تريد نشره (عادة `main` أو `master`)

### 4. إعدادات Build & Deploy

في قسم "Build & Deploy"، استخدم الإعدادات التالية:

#### Build Command:
```bash
pnpm install && pnpm build
```

#### Start Command:
```bash
pnpm start
```

#### Environment:
- **Node Version**: `20.x` أو أحدث

### 5. معلومات إضافية تحتاجها من Render

بعد نشر السيرفر، ستحتاج إلى:

1. **URL الخاص بالسيرفر**: 
   - سيكون مثل: `https://your-app-name.onrender.com`
   - أو إذا استخدمت اسم مخصص: `https://your-custom-domain.com`

2. **Port**: 
   - Render يستخدم Port 10000 افتراضياً
   - لكن يمكنك التحقق من المتغير `PORT` في Environment Variables

### 6. تحديث إعدادات التطبيق

بعد الحصول على URL الخاص بالسيرفر، قم بتحديث:

1. **في ملف `.env` المحلي**:
   ```bash
   VITE_API_BASE_URL=https://your-app-name.onrender.com
   ```

2. **في Render Environment Variables** (إذا كان التطبيق يحتاجها):
   ```bash
   VITE_API_BASE_URL=https://your-app-name.onrender.com
   ```

### 7. إعداد قاعدة البيانات

بعد نشر السيرفر، ستحتاج إلى تشغيل migrations:

1. **خيار أ: عبر Render Shell**
   - اذهب إلى Service → Shell
   - نفذ:
     ```bash
     pnpm db:push
     ```

2. **خيار ب: محلياً**
   - تأكد من أن `DATABASE_URL` يشير إلى قاعدة البيانات على Render
   - نفذ:
     ```bash
     pnpm db:push
     ```

### 8. التحقق من النشر

1. افتح URL الخاص بالسيرفر
2. تحقق من أن Health Check يعمل: `https://your-app-name.onrender.com/api/health`
3. اختبر API endpoints

## معلومات مهمة للربط

عند طلب المساعدة في الربط، قدم المعلومات التالية:

### من Render Dashboard:

1. **Service URL**:
   ```
   https://your-app-name.onrender.com
   ```

2. **Database Connection String** (بدون كلمة المرور):
   ```
   mysql://username:***@host:port/database_name
   ```
   أو المعلومات منفصلة:
   - Host: `xxx.xxx.xxx.xxx`
   - Port: `3306`
   - Database Name: `database_name`
   - Username: `username`
   - Password: `****` (لا تشاركها علناً)

3. **Environment Variables** (قائمة بأسماء المتغيرات فقط، بدون القيم الحساسة):
   - GEMINI_API_KEY: ✓ (مضبوط)
   - DATABASE_URL: ✓ (مضبوط)
   - VITE_APP_ID: ✓ (مضبوط)
   - OAUTH_SERVER_URL: ✓ (مضبوط)
   - JWT_SECRET: ✓ (مضبوط)
   - NODE_ENV: production

4. **Build Logs** (إذا كان هناك أخطاء):
   - انسخ آخر 50 سطر من Build Logs

5. **Runtime Logs** (إذا كان هناك أخطاء):
   - انسخ آخر 50 سطر من Runtime Logs

## استكشاف الأخطاء

### خطأ في الاتصال بقاعدة البيانات:
- تأكد من أن `DATABASE_URL` صحيح
- تأكد من أن قاعدة البيانات تسمح بالاتصالات من خارج Render (إذا كانت خارجية)
- تحقق من Firewall rules

### خطأ في Gemini API:
- تأكد من أن `GEMINI_API_KEY` صحيح
- تحقق من أن المفتاح نشط وله صلاحيات

### خطأ في Build:
- تحقق من أن `package.json` يحتوي على scripts صحيحة
- تأكد من أن Node version متوافق

## ملاحظات أمنية

⚠️ **مهم جداً**:
- لا تشارك `GEMINI_API_KEY` علناً
- لا تشارك `JWT_SECRET` علناً
- لا تشارك `DATABASE_URL` كاملاً علناً
- استخدم Environment Variables في Render دائماً للبيانات الحساسة

## الدعم

إذا واجهت مشاكل، قدم:
1. Service URL
2. قائمة Environment Variables (أسماء فقط)
3. Build/Runtime Logs
4. وصف المشكلة بالتفصيل

