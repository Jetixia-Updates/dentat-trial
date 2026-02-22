import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") }); // monorepo root

import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.js";
import { patientsRoutes } from "./routes/patients.js";
import { appointmentsRoutes } from "./routes/appointments.js";
import { doctorsRoutes } from "./routes/doctors.js";
import { servicesRoutes } from "./routes/services.js";
import { branchesRoutes } from "./routes/branches.js";
import { bookingsRoutes } from "./routes/bookings.js";
import { contactRoutes } from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Health
app.get("/api/health", (_, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/contact", contactRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ code: "SERVER_ERROR", message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🦷 Dental Clinic API running at http://localhost:${PORT}`);
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL not set. Set it in .env at project root.");
  }
}).on("error", (err) => {
  console.error("Failed to start API:", err.message);
  process.exit(1);
});
