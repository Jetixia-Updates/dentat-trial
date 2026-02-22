import { Router } from "express";
import { PrismaClient } from "database";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  const branches = await prisma.branch.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  res.json(branches);
});

export const branchesRoutes = router;
