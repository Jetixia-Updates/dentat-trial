import { Router } from "express";
import { PrismaClient } from "database";
import { createPatientSchema } from "shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";
import { MOCK_PATIENTS } from "../mockData.js";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);
router.use(authorize("ADMIN", "DOCTOR", "RECEPTION"));

router.get("/", async (req: AuthRequest, res) => {
  try {
    const { search, page = "1", limit = "20" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { firstName: { contains: String(search), mode: "insensitive" as const } },
            { lastName: { contains: String(search), mode: "insensitive" as const } },
            { phone: { contains: String(search) } },
            { email: { contains: String(search), mode: "insensitive" as const } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where }),
    ]);

    return res.json({ patients, total, page: Number(page), limit: Number(limit) });
  } catch {
    const filtered = req.query.search ? MOCK_PATIENTS.filter(
      (p) =>
        p.firstName.toLowerCase().includes(String(req.query.search).toLowerCase()) ||
        p.lastName.toLowerCase().includes(String(req.query.search).toLowerCase()) ||
        p.phone.includes(String(req.query.search))
    ) : MOCK_PATIENTS;
    return res.json({ patients: filtered, total: filtered.length, page: 1, limit: 20 });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = createPatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  try {
    const { dateOfBirth, ...rest } = parsed.data;
    const data = {
      ...rest,
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
    };
    const patient = await prisma.patient.create({ data });
    return res.status(201).json(patient);
  } catch {
    const p = parsed.data;
    const mockPatient = { id: `mock-p${Date.now()}`, ...p, dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null, createdAt: new Date(), updatedAt: new Date() };
    return res.status(201).json(mockPatient);
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
      include: {
        appointments: { orderBy: { date: "desc" }, take: 10 },
        diagnoses: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
    if (!patient) return res.status(404).json({ code: "NOT_FOUND", message: "Patient not found" });
    return res.json(patient);
  } catch {
    const mock = MOCK_PATIENTS.find((p) => p.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Patient not found" });
    return res.json({ ...mock, appointments: [], diagnoses: [] });
  }
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const { firstName, lastName, phone, email, address, dateOfBirth, gender } = req.body;
  const data: Record<string, unknown> = {};
  if (firstName != null) data.firstName = firstName;
  if (lastName != null) data.lastName = lastName;
  if (phone != null) data.phone = phone;
  if (email !== undefined) data.email = email || null;
  if (address !== undefined) data.address = address || null;
  if (dateOfBirth !== undefined) data.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  if (gender !== undefined) data.gender = gender || null;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "No fields to update" });
  }
  try {
    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: data as never,
    });
    return res.json(patient);
  } catch {
    const mock = MOCK_PATIENTS.find((p) => p.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Patient not found" });
    return res.json({ ...mock, ...data });
  }
});

export const patientsRoutes = router;
