"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<{ id: string; firstName: string; lastName: string }[]>([]);

  useEffect(() => {
    api<{ patients: { id: string; firstName: string; lastName: string }[] }>("/api/patients")
      .then((r) => setPatients(r.patients || []))
      .catch(() => setPatients([]));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Patients</h1>
      <div className="glass rounded-2xl overflow-hidden">
        {patients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No patients</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Name</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4">{p.firstName} {p.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
