# ⚡ دليل البدء السريع

## 🎯 الوضع الحالي

- ✅ **التطبيق جاهز** - جميع الميزات مكتملة
- ⚠️ **السيرفر** - يحتاج نشر على Render أو تشغيل محلي
- ⚠️ **الربط** - يحتاج إعداد `EXPO_PUBLIC_API_BASE_URL`

---

## 🚀 البدء السريع (3 خطوات)

### الخطوة 1: إعداد Environment Variables

أنشئ ملف `.env` في المجلد الرئيسي:

```bash
# Database (من Render)
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# JWT Secret (أنشئ مفتاح عشوائي)
JWT_SECRET=your_random_secret_key_32_chars_minimum

# API URL (اختر واحداً)
# للتشغيل المحلي:
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
# أو بعد نشر Render:
# EXPO_PUBLIC_API_BASE_URL=https://your-app.onrender.com

# Environment
NODE_ENV=development
```

### الخطوة 2: تثبيت وإعداد

```bash
# تثبيت المكتبات
pnpm install

# إعداد قاعدة البيانات
pnpm db:push
```

### الخطوة 3: التشغيل

**خيار أ: تشغيل كامل (سيرفر + تطبيق)**

```bash
pnpm dev
```

**خيار ب: تشغيل منفصل**

```bash
# Terminal 1 - السيرفر
pnpm dev:server

# Terminal 2 - التطبيق
pnpm dev:metro
```

---

## 📱 استخدام في الهاتف

### 1. تثبيت Expo Go

- 📱 **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- 🍎 **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### 2. تشغيل التطبيق

```bash
pnpm dev:metro
```

### 3. مسح QR Code

- **Android**: افتح Expo Go → Scan QR Code
- **iOS**: افتح الكاميرا → امسح QR Code

---

## ☁️ نشر على Render (للإنتاج)

### 1. اتبع `RENDER_CONNECTION_GUIDE.md`

### 2. بعد الحصول على الرابط، حدث `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-app.onrender.com
```

### 3. أعد تشغيل التطبيق

```bash
pnpm dev:metro
```

---

## ✅ التحقق من الربط

### 1. تحقق من السيرفر:

افتح: `http://localhost:3000/api/health` (محلي)
أو: `https://your-app.onrender.com/api/health` (Render)

يجب أن ترى: `{"ok": true}`

### 2. اختبر في التطبيق:

1. افتح التطبيق
2. سجل مستخدم جديد
3. سجل دخول
4. جرب البوت الذكي

---

## 🔧 استكشاف الأخطاء

### التطبيق لا يتصل بالسيرفر:

1. ✅ تأكد من أن السيرفر يعمل
2. ✅ تحقق من `EXPO_PUBLIC_API_BASE_URL` في `.env`
3. ✅ أعد تشغيل التطبيق بعد تغيير `.env`

### خطأ في قاعدة البيانات:

1. ✅ تحقق من `DATABASE_URL` صحيح
2. ✅ شغّل `pnpm db:push`
3. ✅ تأكد من أن قاعدة البيانات متاحة

### لا يظهر QR Code:

1. ✅ تأكد من أن `pnpm dev:metro` يعمل
2. ✅ تحقق من الاتصال بالإنترنت
3. ✅ جرب `pnpm android` أو `pnpm ios`

---

## 📝 ملخص سريع

```bash
# 1. أنشئ .env
# 2. ثبت المكتبات
pnpm install

# 3. أعد قاعدة البيانات
pnpm db:push

# 4. شغل
pnpm dev

# 5. امسح QR Code في Expo Go
```

---

**جاهز للاستخدام!** 🎉

