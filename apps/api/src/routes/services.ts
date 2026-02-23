import { Router } from "express";
import { PrismaClient } from "database";
import { MOCK_SERVICES } from "../mockData.js";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

const DEPARTMENTS = [
  "GENERAL_DENTISTRY",
  "ORTHODONTICS",
  "COSMETIC_DENTISTRY",
  "ORAL_SURGERY",
  "PEDIATRIC_DENTISTRY",
  "PERIODONTICS",
  "RADIOLOGY",
] as const;

router.get("/", async (req, res) => {
  const all = req.query.all === "true";
  const department = req.query.department as string | undefined;
  try {
    const where: { department?: string; isActive?: boolean } = {};
    if (department) where.department = department;
    if (!all) where.isActive = true;
    const services = await prisma.service.findMany({
      where,
      orderBy: [{ department: "asc" }, { name: "asc" }],
    });
    return res.json(services);
  } catch {
    let list = all ? MOCK_SERVICES : MOCK_SERVICES.filter((s) => s.isActive);
    if (department) list = list.filter((s) => s.department === department);
    return res.json(list);
  }
});

router.get("/departments", (_req, res) => {
  res.json({ departments: DEPARTMENTS });
});

router.get("/:id", async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
    });
    if (!service) return res.status(404).json({ code: "NOT_FOUND", message: "Service not found" });
    return res.json(service);
  } catch {
    const mock = MOCK_SERVICES.find((s) => s.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Service not found" });
    return res.json(mock);
  }
});

router.post("/", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { name, nameAr, department, price, duration, isActive } = req.body;
  if (!name || !department) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "name and department required" });
  }
  try {
    const service = await prisma.service.create({
      data: {
        name: String(name),
        nameAr: nameAr || null,
        department: String(department),
        price: price != null ? Number(price) : null,
        duration: duration != null ? Number(duration) : null,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });
    return res.status(201).json(service);
  } catch {
    const id = `mock-s${Date.now()}`;
    const newMock = {
      id,
      name: String(name),
      nameAr: nameAr || null,
      department: String(department),
      price: price != null ? Number(price) : null,
      duration: duration != null ? Number(duration) : null,
      isActive: typeof isActive === "boolean" ? isActive : true,
    };
    return res.status(201).json(newMock);
  }
});

router.patch("/:id", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { name, nameAr, department, price, duration, isActive } = req.body;
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ code: "NOT_FOUND", message: "Service not found" });
    const data: Record<string, unknown> = {};
    if (name != null) data.name = name;
    if (nameAr !== undefined) data.nameAr = nameAr || null;
    if (department != null) data.department = department;
    if (price !== undefined) data.price = price != null ? Number(price) : null;
    if (duration !== undefined) data.duration = duration != null ? Number(duration) : null;
    if (typeof isActive === "boolean") data.isActive = isActive;
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data,
    });
    return res.json(service);
  } catch {
    const mock = MOCK_SERVICES.find((s) => s.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Service not found" });
    const updated = {
      ...mock,
      name: name ?? mock.name,
      nameAr: nameAr !== undefined ? nameAr : mock.nameAr,
      department: department ?? mock.department,
      price: price !== undefined ? (price != null ? Number(price) : null) : mock.price,
      duration: duration !== undefined ? (duration != null ? Number(duration) : null) : mock.duration,
      isActive: typeof isActive === "boolean" ? isActive : mock.isActive,
    };
    return res.json(updated);
  }
});

export const servicesRoutes = router;
