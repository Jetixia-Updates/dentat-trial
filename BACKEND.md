# Dental Clinic API - إعداد الباكند

## المتطلبات

- **PostgreSQL** (إصدار 14 أو أحدث)
- Node.js 18+

## التشغيل السريع

### 1. تشغيل قاعدة البيانات (PostgreSQL)

**الخيار أ: Docker**
```bash
docker compose up -d
```

**الخيار ب: PostgreSQL محلي**
- ثبّت PostgreSQL على جهازك
- أنشئ قاعدة بيانات باسم `dental_clinic`

### 2. إعداد ملف `.env`

تأكد من وجود ملف `.env` في جذر المشروع:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dental_clinic"
JWT_SECRET="your-secret-key"
CLIENT_URL="http://localhost:3000"
```

### 3. إنشاء الجداول والبيانات التجريبية

```bash
pnpm db:push    # إنشاء الجداول
pnpm db:seed    # إضافة بيانات تجريبية (admin, doctor, branch, services)
```

### 4. تشغيل الـ API

```bash
pnpm dev:api    # أو pnpm dev لتشغيل الويب والـ API معاً
```

الـ API يعمل على: **http://localhost:4000**

## Endpoints المتوفرة

| المسار | الوصف |
|--------|-------|
| `GET /api/health` | فحص صحة الـ API |
| `POST /api/auth/login` | تسجيل الدخول |
| `GET /api/doctors` | قائمة الأطباء |
| `GET /api/branches` | قائمة الفروع |
| `POST /api/bookings` | حجز موعد (صفحة الحجز) |
| `POST /api/contact` | إرسال رسالة تواصل |
| `GET /api/patients` | المرضى (يتطلب توكن) |
| `POST /api/patients` | إضافة مريض (يتطلب توكن) |
| `GET /api/appointments` | المواعيد (يتطلب توكن) |
| `POST /api/appointments` | إنشاء موعد (يتطلب توكن) |
| `GET /api/services` | الخدمات |

## حسابات تجريبية

بعد تشغيل `pnpm db:seed`:

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| Admin | admin@dental.com | Admin@123 |
| Doctor | doctor@dental.com | Doctor@123 |
