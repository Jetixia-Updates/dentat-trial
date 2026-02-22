import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerPatientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(10),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

export const createPatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  branchId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  department: z.enum([
    "GENERAL_DENTISTRY",
    "ORTHODONTICS",
    "COSMETIC_DENTISTRY",
    "ORAL_SURGERY",
    "PEDIATRIC_DENTISTRY",
    "PERIODONTICS",
  ]),
  reason: z.string().optional(),
  notes: z.string().optional(),
});
