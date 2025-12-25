# 📋 Environment Variables المبسطة (بدون Manus)

## ✅ المتغيرات المطلوبة فقط

في Render، أضف هذه المتغيرات فقط:

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://mynumperphon_user:IAuuflz6GSsbXNW5SJ17dHSv5dj4R7DQ@dpg-d567geumcj7s73fo109g-a/mynumperphon

# Gemini API
GEMINI_API_KEY=AIzaSyCkMe_7ryRa0L0HOPqRmvtORNxkC-pZxgI

# JWT Secret (أنشئ مفتاح عشوائي قوي - 32+ حرف)
JWT_SECRET=your_very_strong_random_secret_key_here_min_32_chars

# Environment
NODE_ENV=production
```

## ❌ لم تعد تحتاج

- ❌ `VITE_APP_ID` - تم إزالته
- ❌ `OAUTH_SERVER_URL` - تم إزالته
- ❌ `OWNER_OPEN_ID` - تم إزالته
- ❌ `VITE_OAUTH_PORTAL_URL` - تم إزالته

## 🔑 كيفية إنشاء JWT_SECRET

### خيار 1: عبر Terminal
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### خيار 2: مفتاح يدوي
استخدم أي مفتاح عشوائي قوي مثل:
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

⚠️ **مهم**: يجب أن يكون المفتاح قوياً (32+ حرف) ولا تشاركه علناً!

## 📝 ملخص سريع

| المتغير | القيمة | ملاحظات |
|---------|--------|---------|
| `DATABASE_URL` | رابط PostgreSQL | من Render Database |
| `GEMINI_API_KEY` | مفتاح Gemini | لديك بالفعل |
| `JWT_SECRET` | مفتاح عشوائي | أنشئه بنفسك |
| `NODE_ENV` | `production` | دائماً production |

---

**الآن النظام بسيط ومستقل تماماً!** 🎉

