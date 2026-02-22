"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Calendar, Users, Clock } from "lucide-react";

export default function DoctorDashboard() {
  const [today, setToday] = useState<unknown[]>([]);

  useEffect(() => {
    const d = new Date().toISOString().slice(0, 10);
    api<unknown[]>(`/api/appointments?date=${d}`)
      .then(setToday)
      .catch(() => setToday([]));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Doctor Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <Calendar className="w-10 h-10 text-primary/50 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Today&apos;s Appointments</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{today.length}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <Users className="w-10 h-10 text-primary/50 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">My Patients</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">—</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <Clock className="w-10 h-10 text-primary/50 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Next Appointment</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">—</p>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">Today&apos;s Schedule</h2>
        {today.length === 0 ? (
          <p className="text-slate-500">No appointments today</p>
        ) : (
          <div className="space-y-2">
            {(today as { startTime: string; patient?: { firstName: string; lastName: string } }[]).map((a, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <span>{a.startTime}</span>
                <span>{a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
