import { Router } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth.js";
import { MOCK_BILLS, MOCK_PATIENTS, MOCK_APPOINTMENTS } from "../mockData.js";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN", "RECEPTION"));

router.get("/", async (req: AuthRequest, res) => {
  let list = MOCK_BILLS.map((b) => ({
    ...b,
    patient: MOCK_PATIENTS.find((p) => p.id === b.patientId),
    appointment: MOCK_APPOINTMENTS.find((a) => a.id === b.appointmentId),
  }));
  if (req.query.patientId) list = list.filter((b) => b.patientId === req.query.patientId);
  if (req.query.status) list = list.filter((b) => b.status === req.query.status);
  res.json({ bills: list });
});

router.get("/:id", async (req: AuthRequest, res) => {
  const bill = MOCK_BILLS.find((b) => b.id === req.params.id);
  if (!bill) return res.status(404).json({ code: "NOT_FOUND", message: "Bill not found" });
  res.json({
    ...bill,
    patient: MOCK_PATIENTS.find((p) => p.id === bill.patientId),
    appointment: MOCK_APPOINTMENTS.find((a) => a.id === bill.appointmentId),
  });
});

router.post("/", async (req: AuthRequest, res) => {
  const { patientId, appointmentId, total, items } = req.body;
  if (!patientId || total == null) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "patientId and total required" });
  }
  const mock = {
    id: `mock-bill-${Date.now()}`,
    patientId,
    appointmentId: appointmentId || null,
    total: Number(total),
    status: "PENDING",
    paidAt: null,
    createdAt: new Date().toISOString(),
    items: items || [],
  };
  res.status(201).json(mock);
});

router.patch("/:id/status", async (req: AuthRequest, res) => {
  const { status } = req.body;
  if (!status || !["PENDING", "PAID", "CANCELLED"].includes(status)) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "status must be PENDING, PAID or CANCELLED" });
  }
  const bill = MOCK_BILLS.find((b) => b.id === req.params.id);
  if (!bill) return res.status(404).json({ code: "NOT_FOUND", message: "Bill not found" });
  res.json({
    ...bill,
    status,
    paidAt: status === "PAID" ? new Date().toISOString() : bill.paidAt,
  });
});

export const billingRoutes = router;
