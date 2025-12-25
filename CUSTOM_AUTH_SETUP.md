# 🔐 إعداد نظام المصادقة الخاص (بدون Manus)

تم إنشاء نظام مصادقة خاص بك يعمل بدون Manus. يمكن للمستخدمين التسجيل وتسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور.

## ✅ ما تم إنجازه

### 1. نظام المصادقة الجديد
- ✅ تسجيل مستخدم جديد (Register)
- ✅ تسجيل دخول (Login)
- ✅ تسجيل خروج (Logout)
- ✅ التحقق من المستخدم الحالي (Me)
- ✅ JWT Tokens للمصادقة
- ✅ دعم Cookies للويب و Bearer Tokens للموبايل

### 2. قاعدة البيانات
- ✅ إضافة `passwordHash` إلى جدول `users`
- ✅ دعم البحث بالبريد الإلكتروني
- ✅ دعم البحث بالـ ID

### 3. الأمان
- ✅ تشفير كلمات المرور باستخدام SHA-256
- ✅ JWT Tokens مع expiration
- ✅ HTTP-only cookies للويب

## 📋 Environment Variables المطلوبة

**في Render، أضف فقط:**

```bash
# Database
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# JWT Secret (أنشئ مفتاح عشوائي قوي)
JWT_SECRET=your_very_strong_random_secret_key_min_32_chars

# Environment
NODE_ENV=production
```

**لم تعد تحتاج:**
- ❌ `VITE_APP_ID`
- ❌ `OAUTH_SERVER_URL`
- ❌ `OWNER_OPEN_ID`

## 🔧 API Endpoints

### 1. Register (تسجيل مستخدم جديد)

**POST** `/api/auth/register`

```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "openId": "custom_...",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2025-01-20T10:00:00.000Z"
  }
}
```

### 2. Login (تسجيل دخول)

**POST** `/api/auth/login`

```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "openId": "custom_...",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2025-01-20T10:00:00.000Z"
  }
}
```

### 3. Logout (تسجيل خروج)

**POST** `/api/auth/logout`

**Response:**
```json
{
  "success": true
}
```

### 4. Get Current User (المستخدم الحالي)

**GET** `/api/auth/me`

**Response:**
```json
{
  "user": {
    "id": 1,
    "openId": "custom_...",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "loginMethod": "email",
    "lastSignedIn": "2025-01-20T10:00:00.000Z"
  }
}
```

## 📱 استخدام في التطبيق

### tRPC Routes

```typescript
// Register
const register = trpc.auth.register.useMutation();

await register.mutateAsync({
  name: "أحمد محمد",
  email: "ahmed@example.com",
  password: "password123",
});

// Login
const login = trpc.auth.login.useMutation();

await login.mutateAsync({
  email: "ahmed@example.com",
  password: "password123",
});

// Get current user
const { data } = trpc.auth.me.useQuery();
```

### REST API (للويب)

```typescript
// Register
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "أحمد محمد",
    email: "ahmed@example.com",
    password: "password123",
  }),
});

// Login
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "ahmed@example.com",
    password: "password123",
  }),
});
```

## 🗄️ تحديث قاعدة البيانات

بعد النشر، شغّل migrations:

```bash
pnpm db:push
```

سيتم إضافة حقل `passwordHash` إلى جدول `users`.

## ⚠️ ملاحظات أمنية

1. **JWT_SECRET**: استخدم مفتاح قوي عشوائي (32+ حرف)
2. **HTTPS**: استخدم HTTPS في الإنتاج
3. **Password Hashing**: حالياً يستخدم SHA-256، يمكن ترقيته لـ bcrypt لاحقاً
4. **Validation**: تأكد من التحقق من صحة البيانات في الواجهة

## 🔄 الخطوات التالية

1. ✅ أضف Environment Variables في Render (بدون Manus variables)
2. ✅ شغّل `pnpm db:push` لإنشاء/تحديث الجداول
3. ✅ اختبر Register/Login endpoints
4. ✅ حدث واجهة المستخدم لاستخدام النظام الجديد

## 📝 مثال JWT_SECRET

يمكنك إنشاء JWT_SECRET قوي باستخدام:

```bash
# في Terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

أو استخدم أي مفتاح عشوائي قوي مثل:
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

**الآن التطبيق يعمل بشكل مستقل تماماً بدون Manus!** 🎉

