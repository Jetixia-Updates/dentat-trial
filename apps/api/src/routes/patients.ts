import { Router } from "express";
import { PrismaClient } from "database";
import { createPatientSchema } from "shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);
router.use(authorize("ADMIN", "DOCTOR", "RECEPTION"));

router.get("/", async (req: AuthRequest, res) => {
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

  res.json({ patients, total, page: Number(page), limit: Number(limit) });
});

router.post("/", async (req: AuthRequest, res) => {
  const parsed = createPatientSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  const { dateOfBirth, ...rest } = parsed.data;
  const data = {
    ...rest,
    ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
  };
  const patient = await prisma.patient.create({ data });
  res.status(201).json(patient);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: req.params.id },
    include: {
      appointments: { orderBy: { date: "desc" }, take: 10 },
      diagnoses: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!patient) return res.status(404).json({ code: "NOT_FOUND", message: "Patient not found" });
  res.json(patient);
});

export const patientsRoutes = router;
