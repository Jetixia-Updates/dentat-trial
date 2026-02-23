# Dental Clinic API – Full Backend Modules

Base URL: `http://localhost:4000/api` (or `process.env.PORT`).

All modules support **mock data** when PostgreSQL is not configured; the app runs without a database for demo.

---

## Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/health` | No | Health check. Returns `{ ok, timestamp }`. |

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/auth/login` | No | Login. Body: `{ email, password }`. Returns `{ accessToken, refreshToken, expiresIn, user }`. |
| POST | `/api/auth/refresh` | No | Refresh access token. Body: `{ refreshToken }`. Returns same shape as login. |
| GET | `/api/auth/me` | Bearer | Current user. Returns `{ user }`. |

**Demo credentials:** `demo@dental.com` / `doctor@dental.com` / `patient@dental.com` / `reception@dental.com` — password: `Demo@123`.

---

## Branches (public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/branches` | No | List active branches. |

---

## Doctors (public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/doctors` | No | List active doctors with user and branches. |
| GET | `/api/doctors/:id` | No | Doctor by ID. |

---

## Services (public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/services` | No | List services. Query: `?department=GENERAL_DENTISTRY` (optional). Departments: GENERAL_DENTISTRY, ORTHODONTICS, COSMETIC_DENTISTRY, ORAL_SURGERY, PEDIATRIC_DENTISTRY, PERIODONTICS, RADIOLOGY. |

---

## Insurance (public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/insurance` | No | List accepted insurance companies (Egypt). Returns `{ companies }` with `id`, `nameEn`, `nameAr`. |

---

## Bookings (public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/bookings` | No | Create appointment request. Body: `{ name, phone, email?, branchId, doctorId, date, insuranceId? }`. Uses shared `bookingSchema`. |

---

## Contact (public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| POST | `/api/contact` | No | Submit contact form. Body: `{ name, email, message }`. Uses shared `contactSchema`. |

---

## Patients (protected: Admin, Doctor, Reception)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/patients` | Bearer | List patients. Query: `search`, `page`, `limit`. Returns `{ patients, total, page, limit }`. |
| GET | `/api/patients/:id` | Bearer | Patient by ID with appointments and diagnoses. |
| POST | `/api/patients` | Bearer | Create patient. Body: see shared `createPatientSchema`. |

---

## Appointments (protected)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/appointments` | Bearer | List appointments. Query: `status`, `doctorId`, `patientId`, `date`, `branchId`. |
| POST | `/api/appointments` | Bearer (Admin, Reception, Doctor) | Create appointment. Body: see shared `createAppointmentSchema`. |
| PATCH | `/api/appointments/:id` | Bearer (Admin, Reception, Doctor) | Update appointment status. Body: `{ status }`. |

---

## Admin (protected: Admin only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/admin/stats` | Bearer (Admin) | Dashboard stats: `totalPatients`, `appointmentsToday`, `activeDoctors`, `revenue`. |

---

## Reports (protected: Admin, Reception)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/reports/appointments` | Bearer | Appointments in date range. Query: `from`, `to`. Returns `{ appointments, from, to }`. |
| GET | `/api/reports/revenue` | Bearer | Revenue summary (current month). Returns `{ revenue, completedAppointments, from }`. |
| GET | `/api/reports/patients-summary` | Bearer | Patient counts: `{ total, newLast30Days }`. |

---

## Billing (protected: Admin, Reception)

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/billing` | Bearer | List bills. Query: `status`, `patientId`. Returns `{ bills }`. |
| GET | `/api/billing/:id` | Bearer | Bill by ID. |
| POST | `/api/billing` | Bearer | Create bill. Body: `{ patientId, appointmentId?, total, items? }`. |
| PATCH | `/api/billing/:id/status` | Bearer | Update bill status. Body: `{ status }` (PENDING, PAID, CANCELLED). |

---

## Shared schemas (packages/shared)

- **loginSchema:** `{ email, password }`
- **createPatientSchema:** `firstName`, `lastName`, `phone`, optional: `email`, `dateOfBirth`, `gender`, `address`, `medicalHistory`, `allergies`, `emergencyContact`
- **createAppointmentSchema:** `patientId`, `doctorId`, `branchId`, `date`, `startTime`, `endTime`, `department`, optional: `reason`, `notes`. Department enum includes `RADIOLOGY`.
- **bookingSchema:** `name`, `phone`, optional `email`, `branchId`, `doctorId`, `date`, `insuranceId`
- **contactSchema:** `name`, `email`, `message`

---

## Auth header

Protected routes require:

```
Authorization: Bearer <accessToken>
```

Roles: `ADMIN`, `DOCTOR`, `RECEPTION`, `PATIENT`.
