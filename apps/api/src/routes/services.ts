import { Router } from "express";
import { PrismaClient } from "database";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const { department } = req.query;
  const where = department ? { department: department as never } : { isActive: true };
  const services = await prisma.service.findMany({
    where,
    orderBy: { department: "asc" },
  });
  res.json(services);
});

export const servicesRoutes = router;
