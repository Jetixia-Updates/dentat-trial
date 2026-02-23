import { Router } from "express";
import { contactSchema } from "shared";

const router = Router();

router.post("/", (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ code: "VALIDATION_ERROR", errors: parsed.error.flatten() });
  }
  // In production: send email / save to DB
  res.json({ success: true, message: "Message sent. We will contact you soon." });
});

export const contactRoutes = router;
