"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ReceptionAppointmentsPage() {
  const [appointments, setAppointments] = useState<unknown[]>([]);

  useEffect(() => {
    api<unknown[]>("/api/appointments")
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Appointments</h1>
      <div className="glass rounded-2xl overflow-hidden">
        {Array.isArray(appointments) && appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No appointments</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Patient</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Time</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(appointments as { id: string; date: string; startTime: string; status: string; patient?: { firstName: string; lastName: string } }[]).map((a) => (
                <tr key={a.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4">{a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "—"}</td>
                  <td className="px-6 py-4">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{a.startTime}</td>
                  <td className="px-6 py-4">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
