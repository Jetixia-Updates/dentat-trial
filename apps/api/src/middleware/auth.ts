import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "database";
import type { Role } from "shared";

const prisma = new PrismaClient();

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Token required" });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
}

export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ code: "UNAUTHORIZED", message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ code: "FORBIDDEN", message: "Insufficient permissions" });
    }
    next();
  };
}
