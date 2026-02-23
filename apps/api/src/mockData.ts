/**
 * Mock data when PostgreSQL is unavailable.
 * Allows the app to work for demo without a database.
 */

export const MOCK_BRANCHES = [
  { id: "mock-b1", name: "Main Clinic", nameAr: "العيادة الرئيسية", address: "123 Dental Street, Cairo", addressAr: "123 شارع الأسنان", city: "Cairo", phone: "+201234567890", whatsapp: "+201234567890", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "mock-b2", name: "Nasr City", nameAr: "مدينة نصر", address: "Nasr City Mall", addressAr: "مول مدينة نصر", city: "Cairo", phone: "+201234567891", whatsapp: "+201234567891", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "mock-b3", name: "Heliopolis", nameAr: "مصر الجديدة", address: "Roxy Square", addressAr: "ميدان روكسي", city: "Cairo", phone: "+201234567892", whatsapp: "+201234567892", isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "mock-b4", name: "Maadi", nameAr: "المعادي", address: "Road 9, Maadi", addressAr: "شارع 9 المعادي", city: "Cairo", phone: "+201234567893", whatsapp: "+201234567893", isActive: true, createdAt: new Date(), updatedAt: new Date() },
];

export const MOCK_DOCTORS = [
  { id: "mock-d1", userId: "u1", specialty: "General Dentistry", specialtyAr: "طب الأسنان العام", isActive: true, user: { firstName: "Ahmed", lastName: "Hassan", avatar: null }, branches: [{ branch: { name: "Main Clinic", address: "123 Dental Street" } }] },
  { id: "mock-d2", userId: "u2", specialty: "Orthodontics", specialtyAr: "التقويم", isActive: true, user: { firstName: "Sara", lastName: "Mohamed", avatar: null }, branches: [{ branch: { name: "Nasr City", address: "Nasr City Mall" } }] },
  { id: "mock-d3", userId: "u3", specialty: "Cosmetic Dentistry", specialtyAr: "طب الأسنان التجميلي", isActive: true, user: { firstName: "Omar", lastName: "Ali", avatar: null }, branches: [{ branch: { name: "Main Clinic", address: "123 Dental Street" } }] },
  { id: "mock-d4", userId: "u4", specialty: "Oral Surgery", specialtyAr: "جراحة الفم", isActive: true, user: { firstName: "Nadia", lastName: "Ahmed", avatar: null }, branches: [{ branch: { name: "Heliopolis", address: "Roxy Square" } }] },
];

export const MOCK_PATIENTS = [
  { id: "mock-p1", firstName: "Mohamed", lastName: "Ahmed", phone: "+201111111111", email: "mohamed@example.com", dateOfBirth: null, gender: null, address: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "mock-p2", firstName: "Fatma", lastName: "Hassan", phone: "+201222222222", email: "fatma@example.com", dateOfBirth: null, gender: null, address: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "mock-p3", firstName: "Ali", lastName: "Ibrahim", phone: "+201333333333", email: null, dateOfBirth: null, gender: null, address: null, createdAt: new Date(), updatedAt: new Date() },
];

export const MOCK_APPOINTMENTS = [
  { id: "mock-a1", date: new Date().toISOString(), startTime: "10:00", endTime: "10:30", status: "CONFIRMED", patient: { firstName: "Mohamed", lastName: "Ahmed" }, doctor: { user: { firstName: "Ahmed", lastName: "Hassan" } }, branch: { name: "Main Clinic" } },
  { id: "mock-a2", date: new Date().toISOString(), startTime: "11:00", endTime: "11:45", status: "PENDING", patient: { firstName: "Fatma", lastName: "Hassan" }, doctor: { user: { firstName: "Sara", lastName: "Mohamed" } }, branch: { name: "Nasr City" } },
  { id: "mock-a3", date: new Date().toISOString(), startTime: "14:00", endTime: "14:30", status: "COMPLETED", patient: { firstName: "Ali", lastName: "Ibrahim" }, doctor: { user: { firstName: "Omar", lastName: "Ali" } }, branch: { name: "Main Clinic" } },
];

export const MOCK_SERVICES = [
  { id: "mock-s1", name: "Teeth Cleaning", nameAr: "تنظيف الأسنان", department: "GENERAL_DENTISTRY", price: 150, duration: 45, isActive: true },
  { id: "mock-s2", name: "Filling", nameAr: "حشو الأسنان", department: "GENERAL_DENTISTRY", price: 200, duration: 60, isActive: true },
  { id: "mock-s3", name: "Root Canal", nameAr: "علاج العصب", department: "GENERAL_DENTISTRY", price: 800, duration: 90, isActive: true },
  { id: "mock-s4", name: "Metal Braces", nameAr: "تقويم معدني", department: "ORTHODONTICS", price: 3000, duration: 60, isActive: true },
  { id: "mock-s5", name: "Teeth Whitening", nameAr: "تبييض الأسنان", department: "COSMETIC_DENTISTRY", price: 400, duration: 60, isActive: true },
  { id: "mock-s6", name: "Panoramic X-ray", nameAr: "أشعة بانورامية", department: "RADIOLOGY", price: 120, duration: 15, isActive: true },
  { id: "mock-s7", name: "CBCT", nameAr: "أشعة مقطعية مخروطية", department: "RADIOLOGY", price: 350, duration: 20, isActive: true },
];

export const MOCK_BILLS = [
  { id: "mock-bill-1", patientId: "mock-p1", appointmentId: "mock-a1", total: 350, status: "PAID", paidAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: "mock-bill-2", patientId: "mock-p2", appointmentId: "mock-a2", total: 200, status: "PENDING", paidAt: null, createdAt: new Date().toISOString() },
];

export const DEMO_CREDENTIALS = {
  admin: { email: "demo@dental.com", password: "Demo@123", role: "ADMIN" as const },
  doctor: { email: "doctor@dental.com", password: "Demo@123", role: "DOCTOR" as const },
  patient: { email: "patient@dental.com", password: "Demo@123", role: "PATIENT" as const },
  reception: { email: "reception@dental.com", password: "Demo@123", role: "RECEPTION" as const },
};
