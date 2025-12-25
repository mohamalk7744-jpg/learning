# 🚀 دليل تشغيل التطبيق واستخدامه في الهاتف

## 📊 الوضع الحالي

### ✅ ما تم إنجازه:
- ✅ نظام المصادقة الخاص (بدون Manus)
- ✅ قاعدة بيانات PostgreSQL
- ✅ Gemini API integration
- ✅ جميع الميزات جاهزة

### ⚠️ ما يحتاج إعداد:
- ⚠️ السيرفر على Render (لم يتم نشره بعد)
- ⚠️ ربط التطبيق بالسيرفر

---

## 🎯 خياران للتشغيل

### الخيار 1: تشغيل محلي (للاختبار) 🏠

#### الخطوة 1: إعداد قاعدة البيانات محلياً

**خيار أ: استخدام قاعدة بيانات محلية**
```bash
# إذا كان لديك PostgreSQL محلي
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

**خيار ب: استخدام قاعدة بيانات Render (موصى به)**
```bash
# استخدم نفس رابط Render
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon
```

#### الخطوة 2: إنشاء ملف `.env` في المجلد الرئيسي

```bash
# Database
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# JWT Secret
JWT_SECRET=your_very_strong_random_secret_key_min_32_chars

# API Base URL (للتطبيق المحمول)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

#### الخطوة 3: تثبيت المكتبات

```bash
pnpm install
```

#### الخطوة 4: إعداد قاعدة البيانات

```bash
pnpm db:push
```

#### الخطوة 5: تشغيل السيرفر

```bash
# في Terminal 1
pnpm dev:server
```

السيرفر سيعمل على: `http://localhost:3000`

#### الخطوة 6: تشغيل التطبيق

```bash
# في Terminal 2
pnpm dev:metro
```

أو:

```bash
# للتشغيل على الهاتف مباشرة
pnpm android  # للـ Android
pnpm ios      # للـ iOS
```

---

### الخيار 2: نشر على Render (للإنتاج) ☁️

#### الخطوة 1: نشر السيرفر على Render

اتبع `RENDER_CONNECTION_GUIDE.md` لنشر السيرفر.

بعد النشر، ستحصل على رابط مثل:
```
https://earning-mobile-api.onrender.com
```

#### الخطوة 2: تحديث `.env` في التطبيق

```bash
# Database (نفس رابط Render)
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# JWT Secret (نفس المفتاح المستخدم في Render)
JWT_SECRET=your_very_strong_random_secret_key_min_32_chars

# API Base URL (رابط Render)
EXPO_PUBLIC_API_BASE_URL=https://earning-mobile-api.onrender.com

# Environment
NODE_ENV=production
```

#### الخطوة 3: تحديث `constants/oauth.ts`

افتح `constants/oauth.ts` وتأكد من أن `getApiBaseUrl()` يعيد رابط Render:

```typescript
export function getApiBaseUrl(): string {
  // إذا كان EXPO_PUBLIC_API_BASE_URL موجود، استخدمه
  if (API_BASE_URL) {
    return API_BASE_URL.replace(/\/$/, "");
  }
  
  // Fallback
  return "https://earning-mobile-api.onrender.com";
}
```

---

## 📱 استخدام التطبيق في الهاتف

### الطريقة 1: Expo Go (للاختبار السريع)

#### 1. تثبيت Expo Go
- 📱 **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- 🍎 **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

#### 2. تشغيل التطبيق

```bash
pnpm dev:metro
```

ستظهر QR Code في Terminal.

#### 3. فتح التطبيق في الهاتف

**على Android:**
1. افتح تطبيق **Expo Go**
2. اضغط **Scan QR Code**
3. امسح QR Code

**على iOS:**
1. افتح تطبيق **الكاميرا**
2. امسح QR Code
3. اضغط على الإشعار الذي يظهر

### الطريقة 2: Build للتطبيق النهائي

#### للـ Android:
```bash
# Build APK
eas build --platform android

# أو Build AAB (لـ Google Play)
eas build --platform android --profile production
```

#### للـ iOS:
```bash
# Build IPA
eas build --platform ios
```

---

## 🔗 ربط التطبيق بالسيرفر

### الوضع الحالي:
- ❌ التطبيق **ليس مربوطاً** بالسيرفر بعد
- ✅ السيرفر جاهز (لكن يحتاج نشر على Render)

### كيفية الربط:

#### 1. بعد نشر السيرفر على Render:

احصل على الرابط، مثل:
```
https://earning-mobile-api.onrender.com
```

#### 2. أضف في `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://earning-mobile-api.onrender.com
```

#### 3. أو حدث `constants/oauth.ts`:

```typescript
const env = {
  // ... باقي الإعدادات
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://earning-mobile-api.onrender.com",
};
```

#### 4. أعد تشغيل التطبيق:

```bash
pnpm dev:metro
```

---

## ✅ التحقق من الربط

### 1. تحقق من السيرفر:

افتح في المتصفح:
```
https://earning-mobile-api.onrender.com/api/health
```

يجب أن ترى:
```json
{"ok": true, "timestamp": ...}
```

### 2. اختبر Register:

```bash
curl -X POST https://earning-mobile-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد",
    "email": "ahmed@test.com",
    "password": "password123"
  }'
```

### 3. اختبر Login:

```bash
curl -X POST https://earning-mobile-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@test.com",
    "password": "password123"
  }'
```

---

## 📋 خطوات سريعة للتشغيل

### للتشغيل المحلي:

```bash
# 1. أنشئ .env
cat > .env << EOF
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI
JWT_SECRET=your_secret_key_here
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
NODE_ENV=development
EOF

# 2. ثبت المكتبات
pnpm install

# 3. أعد قاعدة البيانات
pnpm db:push

# 4. شغل السيرفر (Terminal 1)
pnpm dev:server

# 5. شغل التطبيق (Terminal 2)
pnpm dev:metro
```

### للربط مع Render:

```bash
# 1. بعد نشر السيرفر على Render، حدث .env
EXPO_PUBLIC_API_BASE_URL=https://your-app.onrender.com

# 2. أعد تشغيل التطبيق
pnpm dev:metro
```

---

## 🎯 ملخص

| الوضع | السيرفر | التطبيق | الربط |
|-------|---------|---------|------|
| **محلي** | `localhost:3000` | Expo Go | ✅ جاهز |
| **Render** | `https://...onrender.com` | Expo Go/APK | ⚠️ يحتاج إعداد |

---

## ❓ أسئلة شائعة

### س: كيف أعرف إذا كان مربوطاً؟
**ج:** افتح التطبيق وحاول تسجيل الدخول. إذا نجح، فهو مربوط.

### س: لماذا لا يعمل في الهاتف؟
**ج:** تأكد من:
1. السيرفر يعمل
2. `EXPO_PUBLIC_API_BASE_URL` صحيح
3. الهاتف والتطبيق على نفس الشبكة (للاختبار المحلي)

### س: كيف أختبر بدون Render؟
**ج:** استخدم الخيار المحلي (`localhost:3000`) لكن تأكد من أن الهاتف على نفس الشبكة.

---

**الآن جاهز للتشغيل!** 🚀

