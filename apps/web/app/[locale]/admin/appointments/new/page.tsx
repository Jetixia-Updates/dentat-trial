"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Branch {
  id: string;
  name: string;
}
interface Doctor {
  id: string;
  specialty: string;
  user: { firstName: string; lastName: string };
}
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    Promise.all([
      api<Branch[]>("/api/branches"),
      api<Doctor[]>("/api/doctors"),
      api<{ patients: Patient[] }>("/api/patients"),
    ])
      .then(([b, d, p]) => {
        setBranches(b);
        setDoctors(d);
        setPatients(p.patients || []);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          patientId: data.get("patientId"),
          doctorId: data.get("doctorId"),
          branchId: data.get("branchId"),
          date: data.get("date"),
          startTime: data.get("startTime") || "09:00",
          endTime: data.get("endTime") || "09:30",
          department: "GENERAL_DENTISTRY",
        }),
      });
      router.push("/admin/appointments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/appointments" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">New Appointment</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Patient</label>
          <select name="patientId" required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800">
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Doctor</label>
          <select name="doctorId" required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800">
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>Dr. {d.user.firstName} {d.user.lastName} – {d.specialty}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Branch</label>
          <select name="branchId" required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800">
            <option value="">Select branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input name="date" required type="date" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input name="startTime" type="time" defaultValue="09:00" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
          </div>
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Appointment"}</Button>
      </form>
    </div>
  );
}
