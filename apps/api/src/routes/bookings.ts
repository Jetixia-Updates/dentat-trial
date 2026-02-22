import { Router } from "express";
import { PrismaClient } from "database";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, branchId, doctorId, date, department = "GENERAL_DENTISTRY" } = req.body;
    if (!name || !phone || !branchId || !doctorId || !date) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Name, phone, branch, doctor and date required" });
    }

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
        department: department as "GENERAL_DENTISTRY",
        status: "PENDING",
        reason: "Online booking",
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
        branch: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      id: appointment.id,
      message: "Appointment request received. We will contact you to confirm.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "SERVER_ERROR", message: "Failed to create booking" });
  }
});

export const bookingsRoutes = router;
