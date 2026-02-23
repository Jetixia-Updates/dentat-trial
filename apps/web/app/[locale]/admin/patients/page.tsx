"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("admin");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", String(limit));
    api<{ patients: Patient[]; total: number }>(`/api/patients?${params.toString()}`)
      .then((r) => {
        setPatients(r.patients);
        setTotal(r.total);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [search, page, limit]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-content">{t("patients")}</h1>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
            <input
              type="search"
              placeholder={t("searchPatients")}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-content placeholder:text-slate-500 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/patients/new">
            <Button className="gap-2">
              <UserPlus className="w-5 h-5" />
              {t("addPatient")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-content-soft">{t("loading")}</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-content-soft">{t("noPatientsFound")}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content">{t("name")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("phone")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("email")}</th>
                <th className="text-right px-6 py-4 font-medium text-content">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-content">
                    {p.firstName} {p.lastName}
                  </td>
                  <td className="px-6 py-4 text-content-soft">{p.phone}</td>
                  <td className="px-6 py-4 text-content-soft">{p.email || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex gap-2 justify-end">
                      <Link href={`/admin/patients/${p.id}/edit`}>
                        <Button variant="ghost" size="sm">{t("edit")}</Button>
                      </Link>
                      <Link href={`/admin/patients/${p.id}`}>
                        <Button variant="ghost" size="sm">{t("view")}</Button>
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-content-muted">{t("totalPatients")}: {total}</p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-content disabled:opacity-50 hover:bg-slate-50"
            >
              ←
            </button>
            <span className="text-sm text-content-soft">
              {t("page")} {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-content disabled:opacity-50 hover:bg-slate-50"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
