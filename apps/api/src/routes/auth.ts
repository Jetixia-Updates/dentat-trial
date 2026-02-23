import { Router } from "express";
import jwt from "jsonwebtoken";
import { loginSchema } from "shared";
import type { AuthUser } from "shared";
import { DEMO_CREDENTIALS } from "../mockData.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES = "7d";

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  const { email, password } = parsed.data;

  // Demo login — works without database (no PostgreSQL/Docker needed)
  const demo = Object.values(DEMO_CREDENTIALS).find((d) => d.email === email && d.password === password);
  if (demo) {
    const names: Record<string, [string, string]> = {
      ADMIN: ["Demo", "Admin"],
      DOCTOR: ["Ahmed", "Hassan"],
      PATIENT: ["Patient", "User"],
      RECEPTION: ["Reception", "Staff"],
    };
    const [firstName, lastName] = names[demo.role] ?? ["User", "Demo"];
    const authUser: AuthUser = { id: `demo-${demo.role.toLowerCase()}`, email: demo.email, role: demo.role, firstName, lastName };
    const accessToken = jwt.sign({ userId: authUser.id, email: authUser.email, role: authUser.role }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(
      { userId: authUser.id, email: authUser.email, role: authUser.role, firstName, lastName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
    return res.json({ accessToken, refreshToken, expiresIn: 3600, user: authUser });
  }

  // Real login requires database — return error if demo credentials not used
  return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid email or password. Use demo@dental.com / Demo@123" });
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "refreshToken required" });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: string;
      email: string;
      role: AuthUser["role"];
      firstName: string;
      lastName: string;
    };
    const authUser: AuthUser = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName ?? "User",
      lastName: payload.lastName ?? "",
    };
    const accessToken = jwt.sign(
      { userId: authUser.id, email: authUser.email, role: authUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    const newRefreshToken = jwt.sign(
      { userId: authUser.id, email: authUser.email, role: authUser.role, firstName: authUser.firstName, lastName: authUser.lastName },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
    return res.json({ accessToken, refreshToken: newRefreshToken, expiresIn: 3600, user: authUser });
  } catch {
    return res.status(401).json({ code: "INVALID_TOKEN", message: "Invalid or expired refresh token" });
  }
});

router.get("/me", authenticate, (req: AuthRequest, res) => {
  const payload = req.user;
  if (!payload) return res.status(401).json({ code: "UNAUTHORIZED", message: "Not authenticated" });
  const demo = Object.values(DEMO_CREDENTIALS).find((d) => d.email === payload!.email);
  const names: Record<string, [string, string]> = {
    ADMIN: ["Demo", "Admin"],
    DOCTOR: ["Ahmed", "Hassan"],
    PATIENT: ["Patient", "User"],
    RECEPTION: ["Reception", "Staff"],
  };
  const [firstName, lastName] = demo ? names[demo.role] ?? ["User", ""] : ["User", ""];
  const user: AuthUser = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    firstName,
    lastName,
  };
  return res.json({ user });
});

export const authRoutes = router;
