import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const departments = [
  { type: "GENERAL_DENTISTRY" as const, name: "General Dentistry", nameAr: "طب الأسنان العام" },
  { type: "ORTHODONTICS" as const, name: "Orthodontics", nameAr: "التقويم" },
  { type: "COSMETIC_DENTISTRY" as const, name: "Cosmetic Dentistry", nameAr: "طب الأسنان التجميلي" },
  { type: "ORAL_SURGERY" as const, name: "Oral Surgery", nameAr: "جراحة الفم" },
  { type: "PEDIATRIC_DENTISTRY" as const, name: "Pediatric Dentistry", nameAr: "أسنان الأطفال" },
  { type: "PERIODONTICS" as const, name: "Periodontics", nameAr: "علاج اللثة" },
];

const services = [
  { name: "Teeth Cleaning", nameAr: "تنظيف الأسنان", department: "GENERAL_DENTISTRY" as const, price: 150, duration: 45 },
  { name: "Filling", nameAr: "حشو", department: "GENERAL_DENTISTRY" as const, price: 200, duration: 60 },
  { name: "Root Canal", nameAr: "علاج عصب", department: "GENERAL_DENTISTRY" as const, price: 800, duration: 90 },
  { name: "Metal Braces", nameAr: "تقويم معدني", department: "ORTHODONTICS" as const, price: 3000, duration: 60 },
  { name: "Clear Aligners", nameAr: "تقويم شفاف", department: "ORTHODONTICS" as const, price: 5000, duration: 30 },
  { name: "Teeth Whitening", nameAr: "تبييض", department: "COSMETIC_DENTISTRY" as const, price: 400, duration: 60 },
  { name: "Veneers", nameAr: "قشور خزفية", department: "COSMETIC_DENTISTRY" as const, price: 1500, duration: 90 },
  { name: "Wisdom Tooth Extraction", nameAr: "خلع ضرس العقل", department: "ORAL_SURGERY" as const, price: 600, duration: 45 },
  { name: "Dental Implant", nameAr: "زراعة الأسنان", department: "ORAL_SURGERY" as const, price: 3000, duration: 120 },
  { name: "Children's Dentistry", nameAr: "أسنان الأطفال", department: "PEDIATRIC_DENTISTRY" as const, price: 100, duration: 30 },
  { name: "Deep Cleaning", nameAr: "تنظيف عميق", department: "PERIODONTICS" as const, price: 250, duration: 60 },
];

async function main() {
  const hash = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@dental.com" },
    update: {},
    create: {
      email: "admin@dental.com",
      passwordHash: hash,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User",
      isActive: true,
    },
  });
  console.log("Admin user:", admin.email);

  let branch = await prisma.branch.findFirst({ where: { name: "Main Clinic" } });
  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        name: "Main Clinic",
        nameAr: "العيادة الرئيسية",
        address: "123 Dental Street, Cairo, Egypt",
        addressAr: "شارع الأسنان 123، القاهرة، مصر",
        city: "Cairo",
        phone: "+20 123 456 7890",
        whatsapp: "+201234567890",
        isActive: true,
      },
    });
  }
  console.log("Branch:", branch.name);

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.service.create({
        data: {
          name: s.name,
          nameAr: s.nameAr,
          department: s.department,
          price: s.price,
          duration: s.duration,
          isActive: true,
        },
      });
    }
  }
  console.log("Services created:", services.length);

  // Create demo doctor
  const doctorUser = await prisma.user.findFirst({ where: { email: "doctor@dental.com" } });
  if (!doctorUser) {
    const doctorHash = await bcrypt.hash("Doctor@123", 10);
    const docUser = await prisma.user.create({
      data: {
        email: "doctor@dental.com",
        passwordHash: doctorHash,
        role: "DOCTOR",
        firstName: "Ahmed",
        lastName: "Hassan",
        phone: "+201234567891",
        isActive: true,
      },
    });
    const doctor = await prisma.doctor.create({
      data: {
        userId: docUser.id,
        specialty: "General Dentistry",
        specialtyAr: "طب الأسنان العام",
        isActive: true,
      },
    });
    await prisma.doctorBranch.create({
      data: {
        doctorId: doctor.id,
        branchId: branch.id,
      },
    });
    console.log("Demo doctor created: doctor@dental.com / Doctor@123");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
