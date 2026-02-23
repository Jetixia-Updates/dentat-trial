import { Router } from "express";
import { PrismaClient } from "database";
import { MOCK_DOCTORS, MOCK_BRANCHES } from "../mockData.js";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const all = req.query.all === "true";
  try {
    const where = all ? {} : { isActive: true };
    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        branches: { include: { branch: { select: { id: true, name: true, address: true } } } },
      },
    });
    return res.json(doctors);
  } catch {
    const list = all ? MOCK_DOCTORS : MOCK_DOCTORS.filter((d) => d.isActive);
    return res.json(list);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
        branches: { include: { branch: true } },
      },
    });
    if (!doctor) return res.status(404).json({ code: "NOT_FOUND", message: "Doctor not found" });
    return res.json(doctor);
  } catch {
    const mock = MOCK_DOCTORS.find((d) => d.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Doctor not found" });
    return res.json({ ...mock, user: { ...mock.user, phone: null }, branches: mock.branches.map((b) => ({ branch: b.branch })) });
  }
});

router.post("/", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { firstName, lastName, email, phone, specialty, specialtyAr, branchIds } = req.body;
  if (!firstName || !lastName || !email || !specialty) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "firstName, lastName, email and specialty required" });
  }
  try {
    const user = await prisma.user.create({
      data: { email: String(email), firstName: String(firstName), lastName: String(lastName), phone: phone || null, role: "DOCTOR" },
    });
    const doctor = await prisma.doctor.create({
      data: { userId: user.id, specialty: String(specialty), specialtyAr: specialtyAr || null },
    });
    if (Array.isArray(branchIds) && branchIds.length > 0) {
      await prisma.doctorBranch.createMany({
        data: branchIds.map((branchId: string) => ({ doctorId: doctor.id, branchId })),
      });
    }
    const created = await prisma.doctor.findUnique({
      where: { id: doctor.id },
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        branches: { include: { branch: { select: { id: true, name: true, address: true } } } },
      },
    });
    return res.status(201).json(created);
  } catch {
    const id = `mock-d${Date.now()}`;
    const branchList = Array.isArray(branchIds) ? branchIds : [];
    const newMock = {
      id,
      userId: `u-${id}`,
      specialty: String(specialty),
      specialtyAr: specialtyAr || null,
      isActive: true,
      user: { firstName: String(firstName), lastName: String(lastName), avatar: null, phone: phone || null },
      branches: branchList.map((bid: string) => ({
        branch: MOCK_BRANCHES.find((b) => b.id === bid) || { id: bid, name: "", address: "" },
      })),
    };
    return res.status(201).json(newMock);
  }
});

router.patch("/:id", authenticate, authorize("ADMIN"), async (req: AuthRequest, res) => {
  const { firstName, lastName, phone, specialty, specialtyAr, isActive, branchIds } = req.body;
  const data: Record<string, unknown> = {};
  if (firstName != null) data.firstName = firstName;
  if (lastName != null) data.lastName = lastName;
  if (phone !== undefined) data.phone = phone || null;
  if (specialty != null) data.specialty = specialty;
  if (specialtyAr !== undefined) data.specialtyAr = specialtyAr || null;
  if (typeof isActive === "boolean") data.isActive = isActive;

  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: req.params.id }, include: { user: true } });
    if (!doctor) return res.status(404).json({ code: "NOT_FOUND", message: "Doctor not found" });
    const userUpdate: Record<string, unknown> = {};
    if (firstName != null) userUpdate.firstName = firstName;
    if (lastName != null) userUpdate.lastName = lastName;
    if (phone !== undefined) userUpdate.phone = phone || null;
    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({ where: { id: doctor.userId }, data: userUpdate });
    }
    const doctorUpdate: Record<string, unknown> = {};
    if (specialty != null) doctorUpdate.specialty = specialty;
    if (specialtyAr !== undefined) doctorUpdate.specialtyAr = specialtyAr || null;
    if (typeof isActive === "boolean") doctorUpdate.isActive = isActive;
    if (Object.keys(doctorUpdate).length > 0) {
      await prisma.doctor.update({ where: { id: req.params.id }, data: doctorUpdate });
    }
    if (Array.isArray(branchIds)) {
      await prisma.doctorBranch.deleteMany({ where: { doctorId: req.params.id } });
      if (branchIds.length > 0) {
        await prisma.doctorBranch.createMany({
          data: branchIds.map((branchId: string) => ({ doctorId: req.params.id, branchId })),
        });
      }
    }
    const updated = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, phone: true } },
        branches: { include: { branch: { select: { id: true, name: true, address: true } } } },
      },
    });
    return res.json(updated);
  } catch {
    const mock = MOCK_DOCTORS.find((d) => d.id === req.params.id);
    if (!mock) return res.status(404).json({ code: "NOT_FOUND", message: "Doctor not found" });
    const mockUser = mock.user as { firstName: string; lastName: string; avatar: string | null; phone?: string | null };
    const updated = {
      ...mock,
      user: {
        ...mock.user,
        firstName: firstName ?? mockUser.firstName,
        lastName: lastName ?? mockUser.lastName,
        phone: phone !== undefined ? phone : mockUser.phone ?? null,
      },
      specialty: specialty ?? mock.specialty,
      specialtyAr: specialtyAr !== undefined ? specialtyAr : mock.specialtyAr,
      isActive: typeof isActive === "boolean" ? isActive : mock.isActive,
      branches: Array.isArray(branchIds)
        ? branchIds.map((bid: string) => ({
            branch: MOCK_BRANCHES.find((b) => b.id === bid) || { id: bid, name: "", address: "" },
          }))
        : mock.branches,
    };
    return res.json(updated);
  }
});

export const doctorsRoutes = router;
