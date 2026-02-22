"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { UserPlus, Search } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    api<{ patients: Patient[]; total: number }>(`/api/patients${q}`)
      .then((r) => {
        setPatients(r.patients);
        setTotal(r.total);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patients</h1>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/patients/new">
            <Button className="gap-2">
              <UserPlus className="w-5 h-5" />
              Add Patient
            </Button>
          </Link>
        </div>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No patients found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Name</th>
                <th className="text-left px-6 py-4 font-medium">Phone</th>
                <th className="text-left px-6 py-4 font-medium">Email</th>
                <th className="text-right px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{p.phone}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{p.email || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/patients/${p.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500">Total: {total} patients</p>
    </div>
  );
}
