# 🚀 نشر السيرفر على Render - الآن!

## ✅ المتغيرات المطلوبة (من الصورة)

أضف هذه المتغيرات **بالضبط** في Render Environment Variables:

```bash
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

JWT_SECRET=ilishfdlk451204fds4fdf15%DGH$#F%74ds1c

NEW_SECRET=7008d7916e15e227ab636c615d13680e

NODE_ENV=production

VITE_APP_ID=space.manus.e_learning_mobile_app.t20251219214100
```

---

## 📝 خطوات النشر

### 1. اذهب إلى Render

[Render Dashboard](https://dashboard.render.com) → "New +" → "Web Service"

### 2. اربط المستودع

- Repository: `mohamalk7744-jpg/learning`
- Branch: `main`

### 3. الإعدادات

```
Name: earning-mobile-api
Build Command: pnpm install && pnpm build
Start Command: pnpm start
```

### 4. أضف Environment Variables

انسخ المتغيرات من الأعلى وأضفها في قسم "Environment"

### 5. انقر "Create Web Service"

انتظر 5-10 دقائق للنشر

---

## ✅ بعد النشر

### 1. احصل على الرابط

```
https://earning-mobile-api.onrender.com
```
(أو الاسم الذي اخترته)

### 2. تحقق من السيرفر

افتح: `https://your-app.onrender.com/api/health`

يجب أن ترى: `{"ok": true}`

### 3. إعداد قاعدة البيانات

من Render → Shell:
```bash
pnpm db:push
```

---

## 📱 ربط التطبيق

بعد الحصول على الرابط، حدث `.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://earning-mobile-api.onrender.com
```

---

## ✅ كل شيء جاهز!

السيرفر سيعمل بعد النشر! 🎉

