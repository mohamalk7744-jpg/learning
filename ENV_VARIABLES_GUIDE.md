# 📋 دليل متغيرات البيئة (Environment Variables)

## من أين تحصل على كل متغير؟

### 1. `NODE_ENV=production` ✅

**هذا بسيط:**
- في Render: ضع `production` دائماً
- هذا يخبر Node.js أنك في بيئة الإنتاج

```bash
NODE_ENV=production
```

---

### 2. `VITE_APP_ID` - من Manus Platform أو من app.config.ts

**من أين تحصل عليه:**

#### خيار أ: من app.config.ts (إذا كان موجوداً)
في ملف `app.config.ts`، ابحث عن `bundleId`:
```typescript
const bundleId = "space.manus.e_learning_mobile_app.t20251219214100";
```
استخدم هذا القيمة مباشرة:
```bash
VITE_APP_ID=space.manus.e_learning_mobile_app.t20251219214100
```

#### خيار ب: من Manus Platform
1. سجل دخول إلى [Manus Platform](https://manus.im) أو منصة Manus الخاصة بك
2. اذهب إلى قسم **"Apps"** أو **"Applications"**
3. اختر التطبيق الخاص بك (أو أنشئ واحداً جديداً)
4. ستجد **App ID** في صفحة إعدادات التطبيق

**مثال:**
```bash
VITE_APP_ID=space.manus.e_learning_mobile_app.t20251219214100
```

**ملاحظة:** إذا كنت تستخدم Manus، يجب أن يكون لديك حساب على المنصة.

---

### 3. `OAUTH_SERVER_URL` - من Manus Platform

**من أين تحصل عليه:**
1. في نفس صفحة إعدادات التطبيق في Manus
2. ابحث عن **"OAuth Server URL"** أو **"Backend URL"**
3. عادة يكون مثل: `https://api.manus.im` أو `https://your-manus-instance.com`

**مثال:**
```bash
OAUTH_SERVER_URL=https://api.manus.im
# أو
OAUTH_SERVER_URL=https://your-manus-instance.com
```

**إذا لم تكن تستخدم Manus:**
- يمكنك استخدام أي OAuth provider آخر
- أو تعطيل OAuth مؤقتاً (لكن ستحتاج لتعديل الكود)

---

### 4. `OWNER_OPEN_ID` - من Manus Platform

**من أين تحصل عليه:**
1. سجل دخول إلى Manus Platform
2. اذهب إلى **"Profile"** أو **"Account Settings"**
3. ستجد **"Open ID"** أو **"User ID"** في معلومات حسابك
4. هذا هو المعرف الفريد لحسابك

**مثال:**
```bash
OWNER_OPEN_ID=user_1234567890abcdef
```

**ملاحظة:** هذا يستخدم لتحديد المستخدم الرئيسي/المالك للتطبيق.

---

## 🔍 إذا لم تكن تستخدم Manus

إذا لم تكن تستخدم Manus OAuth، لديك خياران:

### خيار 1: تعطيل OAuth مؤقتاً (للاختبار)

يمكنك وضع قيم وهمية (لكن OAuth لن يعمل):

```bash
VITE_APP_ID=test_app_id
OAUTH_SERVER_URL=https://example.com
OWNER_OPEN_ID=test_owner_id
```

⚠️ **تحذير:** مع هذه القيم، تسجيل الدخول لن يعمل.

### خيار 2: استخدام OAuth Provider آخر

ستحتاج لتعديل الكود ليدعم:
- Google OAuth
- GitHub OAuth
- أو أي provider آخر

---

## 📝 ملخص سريع

| المتغير | المصدر | مثال |
|---------|--------|------|
| `NODE_ENV` | دائماً `production` | `production` |
| `VITE_APP_ID` | Manus Platform → Apps → App ID | `space.manus.app.t123456` |
| `OAUTH_SERVER_URL` | Manus Platform → Apps → OAuth Server URL | `https://api.manus.im` |
| `OWNER_OPEN_ID` | Manus Platform → Profile → Open ID | `user_1234567890` |

---

## 🎯 خطوات الحصول على القيم من Manus

### إذا كان لديك حساب Manus:

1. **سجل دخول**: https://manus.im (أو منصة Manus الخاصة بك)

2. **اذهب إلى Apps**:
   - Dashboard → Apps
   - أو Settings → Applications

3. **اختر التطبيق** (أو أنشئ واحداً):
   - ستجد `VITE_APP_ID` في صفحة التطبيق

4. **ابحث عن OAuth Settings**:
   - ستجد `OAUTH_SERVER_URL` في نفس الصفحة

5. **اذهب إلى Profile**:
   - ستجد `OWNER_OPEN_ID` في معلومات حسابك

### إذا لم يكن لديك حساب Manus:

1. **سجل في Manus**: https://manus.im
2. **أنشئ تطبيق جديد**
3. **احصل على القيم** من إعدادات التطبيق

---

## ⚙️ إعدادات Render النهائية

بعد الحصول على القيم، أضفها في Render:

```bash
# Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# OAuth (من Manus)
VITE_APP_ID=your_actual_app_id_from_manus
OAUTH_SERVER_URL=https://your_actual_oauth_server_url
OWNER_OPEN_ID=your_actual_owner_open_id

# Security
JWT_SECRET=your_random_secret_key_min_32_chars
```

---

## ❓ أسئلة شائعة

### س: ماذا لو لم أستخدم Manus؟
**ج:** ستحتاج إما:
- إنشاء حساب Manus واستخدامه
- تعديل الكود ليدعم OAuth provider آخر
- تعطيل OAuth مؤقتاً (للاختبار فقط)

### س: هل يمكنني استخدام Google OAuth بدلاً من Manus؟
**ج:** نعم، لكن ستحتاج لتعديل الكود في `server/_core/oauth.ts`

### س: ماذا لو نسيت OWNER_OPEN_ID؟
**ج:** يمكنك العثور عليه من:
- Manus Platform → Profile → Open ID
- أو من أي جلسة تسجيل دخول سابقة

---

## 🔗 روابط مفيدة

- [Manus Platform](https://manus.im)
- [Render Dashboard](https://dashboard.render.com)
- [OAuth Documentation](https://oauth.net/2/)

