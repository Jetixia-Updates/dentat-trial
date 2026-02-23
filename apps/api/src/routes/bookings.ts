import { Router } from "express";
import { PrismaClient } from "database";
import { bookingSchema } from "shared";
import { MOCK_BRANCHES, MOCK_DOCTORS } from "../mockData.js";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  const { name, phone, email, branchId, doctorId, date, insuranceId } = parsed.data;

  try {
    const [firstName, ...lastParts] = name.trim().split(" ");
    const lastName = lastParts.join(" ") || firstName;

    let patient = await prisma.patient.findFirst({ where: { phone: phone.trim() } });
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          firstName: firstName || "Guest",
          lastName,
          phone: phone.trim(),
          email: email?.trim() || null,
        },
      });
    }

    const d = new Date(date);
    const startTime = "09:00";
    const endTime = "09:30";

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        branchId,
        date: d,
        startTime,
        endTime,
        department: "GENERAL_DENTISTRY",
        status: "PENDING",
        reason: insuranceId ? `Online booking | Insurance: ${insuranceId}` : "Online booking",
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        branch: { select: { name: true } },
      },
    });

    return res.status(201).json({
      success: true,
      id: appointment.id,
      message: "Appointment request received. We will contact you to confirm.",
    });
  } catch {
    const branch = MOCK_BRANCHES.find((b) => b.id === branchId);
    const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
    if (!branch || !doctor) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Invalid branch or doctor" });
    }
    return res.status(201).json({
      success: true,
      id: `mock-booking-${Date.now()}`,
      message: "Appointment request received. We will contact you to confirm.",
    });
  }
});

export const bookingsRoutes = router;
