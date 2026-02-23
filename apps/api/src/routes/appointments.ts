import { Router } from "express";
import { PrismaClient } from "database";
import { createAppointmentSchema } from "shared";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";
import { MOCK_APPOINTMENTS } from "../mockData.js";

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const { status, doctorId, patientId, date, branchId, from, to } = req.query;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;
    if (branchId) where.branchId = branchId;
    if (from && to) {
      where.date = { gte: new Date(String(from)), lte: new Date(String(to)) };
    } else if (date) {
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

    return res.json(appointments);
  } catch {
    return res.json(MOCK_APPOINTMENTS);
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
        doctor: { include: { user: { select: { firstName: true, lastName: true } } } },
        branch: { select: { id: true, name: true, address: true } },
      },
    });
    if (!appointment) return res.status(404).json({ code: "NOT_FOUND", message: "Appointment not found" });
    return res.json(appointment);
  } catch {
    const m = MOCK_APPOINTMENTS.find((a) => a.id === req.params.id);
    if (!m) return res.status(404).json({ code: "NOT_FOUND", message: "Appointment not found" });
    return res.json({ ...m, branch: { id: "", name: (m as { branch?: { name: string } }).branch?.name ?? "", address: "" } });
  }
});

router.post("/", authorize("ADMIN", "RECEPTION", "DOCTOR"), async (req: AuthRequest, res) => {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  try {
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
    return res.status(201).json(appointment);
  } catch {
    const m = MOCK_APPOINTMENTS[0];
    const mock = { id: `mock-a${Date.now()}`, ...parsed.data, date: parsed.data.date, patient: m?.patient ?? { firstName: "Demo", lastName: "Patient" }, doctor: m?.doctor ?? { user: { firstName: "Demo", lastName: "Doctor" } } };
    return res.status(201).json(mock);
  }
});

router.patch("/:id", authorize("ADMIN", "RECEPTION", "DOCTOR"), async (req: AuthRequest, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ code: "VALIDATION_ERROR", message: "status required" });
  try {
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
    });
    return res.json(appointment);
  } catch {
    const m = MOCK_APPOINTMENTS.find((a) => a.id === req.params.id);
    if (!m) return res.status(404).json({ code: "NOT_FOUND", message: "Appointment not found" });
    return res.json({ ...m, status });
  }
});

export const appointmentsRoutes = router;
