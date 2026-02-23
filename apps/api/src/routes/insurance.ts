import { Router } from "express";
import { PrismaClient } from "database";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

/**
 * Fallback when DB is unavailable or Insurance table not migrated.
 */
const FALLBACK_INSURANCE = [
  { id: "allianz-egypt", nameEn: "Allianz Insurance Company – Egypt", nameAr: "شركة أليانز للتأمين – مصر", isActive: true },
  { id: "allianz-life-egypt", nameEn: "Allianz Life Assurance Company – Egypt", nameAr: "شركة أليانز للتأمين على الحياة – مصر", isActive: true },
  { id: "axa-egypt", nameEn: "AXA Egypt for Insurance", nameAr: "أكسا مصر للتأمين", isActive: true },
  { id: "metlife-egypt", nameEn: "MetLife Egypt for Insurance and Reinsurance", nameAr: "ميت لايف مصر للتأمين وإعادة التأمين", isActive: true },
  { id: "misr-insurance", nameEn: "Misr Insurance Company", nameAr: "شركة مصر للتأمين", isActive: true },
  { id: "misr-life", nameEn: "Misr Life Insurance Company", nameAr: "شركة مصر للتأمين على الحياة", isActive: true },
  { id: "delta-insurance", nameEn: "Delta Insurance Company", nameAr: "شركة الدلتا للتأمين", isActive: true },
  { id: "suez-canal-insurance", nameEn: "Suez Canal Insurance Company", nameAr: "شركة قناة السويس للتأمين", isActive: true },
  { id: "bupa-egypt", nameEn: "Bupa Egypt for Medical Insurance", nameAr: "بوبا مصر للتأمين الطبي", isActive: true },
  { id: "other", nameEn: "Other Insurance", nameAr: "تأمين أخرى", isActive: true },
];

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const all = req.query.all === "true";
  try {
    const where = all ? {} : { isActive: true };
    const companies = await prisma.insurance.findMany({
      where,
      orderBy: { nameEn: "asc" },
    });
    const list = companies.map((c) => ({ id: c.id, nameEn: c.nameEn, nameAr: c.nameAr, isActive: c.isActive }));
    return res.json({ companies: list });
  } catch {
    const list = all ? FALLBACK_INSURANCE : FALLBACK_INSURANCE.filter((c) => c.isActive);
    return res.json({ companies: list.map(({ id, nameEn, nameAr }) => ({ id, nameEn, nameAr })) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const company = await prisma.insurance.findUnique({
      where: { id: req.params.id },
    });
    if (!company) return res.status(404).json({ code: "NOT_FOUND", message: "Insurance not found" });
    return res.json(company);
  } catch {
    const mock = FALLBACK_INSURANCE.find((c) => c.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Insurance not found" });
    return res.json({ ...mock, createdAt: new Date(), updatedAt: new Date() });
  }
});

router.post("/", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { nameEn, nameAr, isActive } = req.body;
  if (!nameEn) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "nameEn required" });
  }
  try {
    const company = await prisma.insurance.create({
      data: {
        nameEn: String(nameEn),
        nameAr: nameAr || null,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });
    return res.status(201).json(company);
  } catch {
    const id = `ins-${Date.now()}`;
    const newMock = {
      id,
      nameEn: String(nameEn),
      nameAr: nameAr || null,
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return res.status(201).json(newMock);
  }
});

router.patch("/:id", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { nameEn, nameAr, isActive } = req.body;
  try {
    const existing = await prisma.insurance.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ code: "NOT_FOUND", message: "Insurance not found" });
    const data: Record<string, unknown> = {};
    if (nameEn != null) data.nameEn = nameEn;
    if (nameAr !== undefined) data.nameAr = nameAr || null;
    if (typeof isActive === "boolean") data.isActive = isActive;
    const company = await prisma.insurance.update({
      where: { id: req.params.id },
      data,
    });
    return res.json(company);
  } catch {
    const mock = FALLBACK_INSURANCE.find((c) => c.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Insurance not found" });
    const updated = {
      ...mock,
      nameEn: nameEn ?? mock.nameEn,
      nameAr: nameAr !== undefined ? nameAr : mock.nameAr,
      isActive: typeof isActive === "boolean" ? isActive : mock.isActive,
    };
    return res.json(updated);
  }
});

export const insuranceRoutes = router;
