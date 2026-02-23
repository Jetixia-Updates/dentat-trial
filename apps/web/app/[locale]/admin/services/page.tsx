"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Plus, Search } from "lucide-react";

interface Service {
  id: string;
  name: string;
  nameAr?: string | null;
  department: string;
  price?: number | null;
  duration?: number | null;
  isActive: boolean;
}

const DEPARTMENTS = [
  "GENERAL_DENTISTRY",
  "ORTHODONTICS",
  "COSMETIC_DENTISTRY",
  "ORAL_SURGERY",
  "PEDIATRIC_DENTISTRY",
  "PERIODONTICS",
  "RADIOLOGY",
];

export default function AdminServicesPage() {
  const t = useTranslations("admin");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("all", "true");
    if (department) params.set("department", department);
    api<Service[]>(`/api/services?${params.toString()}`)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [department]);

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.trim().toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.nameAr && s.nameAr.includes(q))
    );
  }, [services, search]);

  function departmentLabel(d: string) {
    const out = (t as (k: string) => string)(`department_${d}`);
    return out && !out.startsWith("department_") ? out : d.replace(/_/g, " ");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-content">{t("pricing")} / {t("services")}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
            <input
              type="search"
              placeholder={t("searchServices")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-content placeholder:text-slate-500 focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-4 py-2 focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("allDepartments")}</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{departmentLabel(d)}</option>
            ))}
          </select>
          <Link href="/admin/services/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              {t("addService")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-content-soft">{t("loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-content-soft">{t("noServices")}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content">{t("serviceName")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("department")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("price")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("duration")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("status")}</th>
                <th className="text-right px-6 py-4 font-medium text-content">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-content">{s.name}</td>
                  <td className="px-6 py-4 text-content-soft">{departmentLabel(s.department)}</td>
                  <td className="px-6 py-4 text-content-soft">{s.price != null ? `EGP ${s.price}` : "—"}</td>
                  <td className="px-6 py-4 text-content-soft">{s.duration != null ? `${s.duration} min` : "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        s.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {s.isActive ? t("active") : t("inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex gap-2 justify-end">
                      <Link href={`/admin/services/${s.id}/edit`}>
                        <Button variant="ghost" size="sm">{t("edit")}</Button>
                      </Link>
                      <Link href={`/admin/services/${s.id}`}>
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
      <p className="mt-4 text-sm text-content-muted">{t("totalServices")}: {filtered.length}</p>
    </div>
  );
}
