"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  patient: { firstName: string; lastName: string };
  doctor: { user: { firstName: string; lastName: string } };
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Appointment[]>("/api/appointments")
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Appointments</h1>
        <Link href="/admin/appointments/new">
          <Button variant="default" className="gap-2">
            <Calendar className="w-5 h-5" />
            New Appointment
          </Button>
        </Link>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No appointments</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Patient</th>
                <th className="text-left px-6 py-4 font-medium">Doctor</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Time</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4">{a.patient.firstName} {a.patient.lastName}</td>
                  <td className="px-6 py-4">Dr. {a.doctor.user.firstName} {a.doctor.user.lastName}</td>
                  <td className="px-6 py-4">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{a.startTime}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      a.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                      a.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
