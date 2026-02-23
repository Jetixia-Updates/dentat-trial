import { Router } from "express";
import { PrismaClient } from "database";
import { MOCK_BRANCHES } from "../mockData.js";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const all = req.query.all === "true";
  try {
    const where = all ? {} : { isActive: true };
    const branches = await prisma.branch.findMany({
      where,
      orderBy: { name: "asc" },
    });
    return res.json(branches);
  } catch {
    const list = all ? MOCK_BRANCHES : MOCK_BRANCHES.filter((b) => b.isActive);
    return res.json(list);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: req.params.id },
    });
    if (!branch) return res.status(404).json({ code: "NOT_FOUND", message: "Branch not found" });
    return res.json(branch);
  } catch {
    const mock = MOCK_BRANCHES.find((b) => b.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Branch not found" });
    return res.json(mock);
  }
});

router.post("/", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { name, nameAr, address, addressAr, city, phone, whatsapp, isActive } = req.body;
  if (!name || !address) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "name and address required" });
  }
  try {
    const branch = await prisma.branch.create({
      data: {
        name: String(name),
        nameAr: nameAr || null,
        address: String(address),
        addressAr: addressAr || null,
        city: city || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });
    return res.status(201).json(branch);
  } catch {
    const id = `mock-b${Date.now()}`;
    const newMock = {
      id,
      name: String(name),
      nameAr: nameAr || null,
      address: String(address),
      addressAr: addressAr || null,
      city: city || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return res.status(201).json(newMock);
  }
});

router.patch("/:id", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { name, nameAr, address, addressAr, city, phone, whatsapp, isActive } = req.body;
  try {
    const existing = await prisma.branch.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ code: "NOT_FOUND", message: "Branch not found" });
    const data: Record<string, unknown> = {};
    if (name != null) data.name = name;
    if (nameAr !== undefined) data.nameAr = nameAr || null;
    if (address != null) data.address = address;
    if (addressAr !== undefined) data.addressAr = addressAr || null;
    if (city !== undefined) data.city = city || null;
    if (phone !== undefined) data.phone = phone || null;
    if (whatsapp !== undefined) data.whatsapp = whatsapp || null;
    if (typeof isActive === "boolean") data.isActive = isActive;
    const branch = await prisma.branch.update({
      where: { id: req.params.id },
      data,
    });
    return res.json(branch);
  } catch {
    const mock = MOCK_BRANCHES.find((b) => b.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Branch not found" });
    const updated = {
      ...mock,
      name: name ?? mock.name,
      nameAr: nameAr !== undefined ? nameAr : mock.nameAr,
      address: address ?? mock.address,
      addressAr: addressAr !== undefined ? addressAr : mock.addressAr,
      city: city !== undefined ? city : mock.city,
      phone: phone !== undefined ? phone : mock.phone,
      whatsapp: whatsapp !== undefined ? whatsapp : mock.whatsapp,
      isActive: typeof isActive === "boolean" ? isActive : mock.isActive,
    };
    return res.json(updated);
  }
});

export const branchesRoutes = router;
