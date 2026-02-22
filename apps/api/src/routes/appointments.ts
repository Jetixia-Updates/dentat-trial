import { Router } from "express";
import { PrismaClient } from "database";
import { createAppointmentSchema } from "shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  const { status, doctorId, patientId, date, branchId } = req.query;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = doctorId;
  if (patientId) where.patientId = patientId;
  if (branchId) where.branchId = branchId;
  if (date) {
    const d = new Date(String(date));
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    where.date = { gte: d, lt: next };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
      doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
      branch: { select: { name: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  res.json(appointments);
});

router.post("/", authorize("ADMIN", "RECEPTION", "DOCTOR"), async (req: AuthRequest, res) => {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }

  const appointment = await prisma.appointment.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
    include: {
      patient: { select: { firstName: true, lastName: true } },
      doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });
  res.status(201).json(appointment);
});

router.patch("/:id", authorize("ADMIN", "RECEPTION", "DOCTOR"), async (req: AuthRequest, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ code: "VALIDATION_ERROR", message: "status required" });

  const appointment = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(appointment);
});

export const appointmentsRoutes = router;
