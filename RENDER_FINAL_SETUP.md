# ✅ الإعداد النهائي للنشر على Render

## 📋 المتغيرات المطلوبة في Render (من الصورة)

أضف هذه المتغيرات **بالضبط** كما في الصورة:

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API Key
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# JWT Secret
JWT_SECRET=ilishfdlk451204fds4fdf15%DGH$#F%74ds1c

# New Secret (إذا كان مستخدماً في الكود)
NEW_SECRET=7008d7916e15e227ab636c615d13680e

# Environment
NODE_ENV=production

# VITE_APP_ID (اختياري - للتوافق)
VITE_APP_ID=space.manus.e_learning_mobile_app.t20251219214100
```

## ⚠️ ملاحظات مهمة

### NEW_SECRET
- هذا المتغير **غير مستخدم حالياً** في الكود
- يمكنك إزالته إذا أردت
- أو اتركه إذا كنت تخطط لاستخدامه لاحقاً

### VITE_APP_ID
- هذا المتغير **غير مستخدم** في نظام المصادقة الجديد
- لكن يمكن تركه للتوافق مع الكود القديم
- لن يؤثر على عمل النظام

---

## 🚀 خطوات النشر على Render

### 1. إنشاء Web Service

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. انقر "New +" → "Web Service"
3. اربط المستودع: `mohamalk7744-jpg/learning`
4. اختر Branch: `main`

### 2. الإعدادات

- **Name**: `earning-mobile-api` (أو أي اسم)
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Runtime**: `Node`

### 3. إضافة Environment Variables

انسخ المتغيرات من الأعلى وأضفها في Render.

### 4. النشر

انقر "Create Web Service" وانتظر 5-10 دقائق.

---

## ✅ بعد النشر

### 1. تحقق من السيرفر

افتح: `https://your-app.onrender.com/api/health`

يجب أن ترى: `{"ok": true, "timestamp": ...}`

### 2. إعداد قاعدة البيانات

من Render Shell:
```bash
pnpm db:push
```

### 3. اختبر API

```bash
# Register
curl -X POST https://your-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"أحمد","email":"ahmed@test.com","password":"password123"}'
```

---

## 📱 ربط التطبيق

بعد الحصول على رابط Render، حدث `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-app.onrender.com
```

---

**كل شيء جاهز للنشر!** 🎉

