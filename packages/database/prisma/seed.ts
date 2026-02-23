import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Branches
  const branches = [
    { name: "Main Clinic", nameAr: "العيادة الرئيسية", address: "123 Dental Street, Cairo", addressAr: "123 شارع الأسنان", city: "Cairo", phone: "+201234567890", whatsapp: "+201234567890" },
    { name: "Nasr City", nameAr: "مدينة نصر", address: "Nasr City Mall", addressAr: "مول مدينة نصر", city: "Cairo", phone: "+201234567891", whatsapp: "+201234567891" },
    { name: "Heliopolis", nameAr: "مصر الجديدة", address: "Roxy Square", addressAr: "ميدان روكسي", city: "Cairo", phone: "+201234567892", whatsapp: "+201234567892" },
    { name: "Maadi", nameAr: "المعادي", address: "Road 9, Maadi", addressAr: "شارع 9 المعادي", city: "Cairo", phone: "+201234567893", whatsapp: "+201234567893" },
  ];
  for (const b of branches) {
    const exists = await prisma.branch.findFirst({ where: { name: b.name } });
    if (!exists) await prisma.branch.create({ data: b });
  }

  // Services
  const services = [
    { name: "Teeth Cleaning", nameAr: "تنظيف الأسنان", department: "GENERAL_DENTISTRY", price: 150, duration: 45 },
    { name: "Filling", nameAr: "حشو الأسنان", department: "GENERAL_DENTISTRY", price: 200, duration: 60 },
    { name: "Root Canal", nameAr: "علاج العصب", department: "GENERAL_DENTISTRY", price: 800, duration: 90 },
    { name: "Metal Braces", nameAr: "تقويم معدني", department: "ORTHODONTICS", price: 3000, duration: 60 },
    { name: "Teeth Whitening", nameAr: "تبييض الأسنان", department: "COSMETIC_DENTISTRY", price: 400, duration: 60 },
    { name: "Panoramic X-ray", nameAr: "أشعة بانورامية", department: "RADIOLOGY", price: 120, duration: 15 },
    { name: "CBCT", nameAr: "أشعة مقطعية مخروطية", department: "RADIOLOGY", price: 350, duration: 20 },
  ];
  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) await prisma.service.create({ data: s });
  }

  // Insurance
  const insuranceList = [
    { nameEn: "Allianz Insurance Company – Egypt", nameAr: "شركة أليانز للتأمين – مصر" },
    { nameEn: "AXA Egypt for Insurance", nameAr: "أكسا مصر للتأمين" },
    { nameEn: "Misr Insurance Company", nameAr: "شركة مصر للتأمين" },
    { nameEn: "Bupa Egypt for Medical Insurance", nameAr: "بوبا مصر للتأمين الطبي" },
    { nameEn: "Other Insurance", nameAr: "تأمين أخرى" },
  ];
  for (const i of insuranceList) {
    const existing = await prisma.insurance.findFirst({ where: { nameEn: i.nameEn } });
    if (!existing) await prisma.insurance.create({ data: i });
  }

  console.log("✅ Seed completed: branches, services, insurance.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
