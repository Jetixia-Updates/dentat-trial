"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Calendar, Users } from "lucide-react";

export default function ReceptionDashboard() {
  const [today, setToday] = useState(0);
  const [patients, setPatients] = useState(0);

  useEffect(() => {
    const d = new Date().toISOString().slice(0, 10);
    Promise.all([
      api<unknown[]>(`/api/appointments?date=${d}`),
      api<{ total: number }>("/api/patients?limit=1"),
    ])
      .then(([apts, p]) => {
        setToday(Array.isArray(apts) ? apts.length : 0);
        setPatients(p?.total ?? 0);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Reception Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <Calendar className="w-10 h-10 text-primary/50 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Appointments Today</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{today}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <Users className="w-10 h-10 text-primary/50 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Total Patients</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{patients}</p>
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
        <p className="text-slate-600 dark:text-slate-400">Register patient, book appointment, manage billing from the sidebar.</p>
      </div>
    </div>
  );
}
