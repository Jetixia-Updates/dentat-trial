import { Router } from "express";
import { PrismaClient } from "database";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  const doctors = await prisma.doctor.findMany({
    where: { isActive: true },
    include: {
      user: { select: { firstName: true, lastName: true, avatar: true } },
      branches: { include: { branch: { select: { name: true, address: true } } } },
    },
  });
  res.json(doctors);
});

router.get("/:id", async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
      branches: { include: { branch: true } },
    },
  });
  if (!doctor) return res.status(404).json({ code: "NOT_FOUND", message: "Doctor not found" });
  res.json(doctor);
});

export const doctorsRoutes = router;
