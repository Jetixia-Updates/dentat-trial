import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "database";
import { loginSchema } from "shared";
import type { LoginResponse, AuthUser } from "shared";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES = "7d";

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email, isActive: true },
    include: { doctor: true, patient: true },
  });
  if (!user) {
    return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? undefined,
    avatar: user.avatar ?? undefined,
  };

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  const response: LoginResponse = {
    accessToken,
    refreshToken,
    expiresIn: 3600,
    user: authUser,
  };
  res.json(response);
});

export const authRoutes = router;
