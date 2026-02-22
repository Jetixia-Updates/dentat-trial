import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: "Name, email and message required" });
  }
  // In production: send email / save to DB
  res.json({ success: true, message: "Message sent. We will contact you soon." });
});

export const contactRoutes = router;
