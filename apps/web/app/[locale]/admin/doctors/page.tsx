"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { UserPlus, Search } from "lucide-react";

interface Doctor {
  id: string;
  specialty: string;
  specialtyAr?: string | null;
  isActive: boolean;
  user: { firstName: string; lastName: string; avatar?: string | null };
  branches?: { branch: { name: string; address?: string } }[];
}

export default function AdminDoctorsPage() {
  const t = useTranslations("admin");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api<Doctor[]>("/api/doctors?all=true")
      .then(setDoctors)
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return doctors;
    const q = search.trim().toLowerCase();
    return doctors.filter(
      (d) =>
        d.user.firstName.toLowerCase().includes(q) ||
        d.user.lastName.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        (d.specialtyAr && d.specialtyAr.includes(q)) ||
        d.branches?.some((b) => b.branch.name.toLowerCase().includes(q))
    );
  }, [doctors, search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-content">{t("doctors")}</h1>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
            <input
              type="search"
              placeholder={t("searchDoctors")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-content placeholder:text-slate-500 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/doctors/new">
            <Button className="gap-2">
              <UserPlus className="w-5 h-5" />
              {t("addDoctor")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-content-soft">{t("loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-content-soft">{t("noDoctors")}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content">{t("doctorName")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("specialty")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("branches")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("status")}</th>
                <th className="text-right px-6 py-4 font-medium text-content">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-content">
                    Dr. {d.user.firstName} {d.user.lastName}
                  </td>
                  <td className="px-6 py-4 text-content-soft">{d.specialty}</td>
                  <td className="px-6 py-4 text-content-soft">
                    {d.branches?.map((b) => b.branch.name).join(", ") || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        d.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {d.isActive ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex gap-2 justify-end">
                      <Link href={`/admin/doctors/${d.id}/edit`}>
                        <Button variant="ghost" size="sm">{t("edit")}</Button>
                      </Link>
                      <Link href={`/admin/doctors/${d.id}`}>
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
      <p className="mt-4 text-sm text-content-muted">{t("totalDoctors")}: {filtered.length}</p>
    </div>
  );
}
