"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Plus, Search } from "lucide-react";

interface InsuranceCompany {
  id: string;
  nameEn: string;
  nameAr?: string | null;
  isActive?: boolean;
}

export default function AdminInsurancePage() {
  const t = useTranslations("admin");
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api<{ companies: InsuranceCompany[] }>("/api/insurance?all=true")
      .then((r) => setCompanies(r.companies))
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.trim().toLowerCase();
    return companies.filter(
      (c) =>
        c.nameEn.toLowerCase().includes(q) ||
        (c.nameAr && c.nameAr.includes(q))
    );
  }, [companies, search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-content">{t("insurance")}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
            <input
              type="search"
              placeholder={t("searchInsurance")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-content placeholder:text-slate-500 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/insurance/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              {t("addInsurance")}
            </Button>
          </Link>
          <Link
            href="/insurance"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            {t("viewPublicPage")}
          </Link>
        </div>
      </div>
      <p className="text-content-soft mb-6">{t("insuranceDesc")}</p>
      {loading ? (
        <div className="glass rounded-2xl p-12 text-center text-content-soft">{t("loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-content-soft">{t("noInsurance")}</div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content">#</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("nameEn")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("nameAr")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("status")}</th>
                <th className="text-right px-6 py-4 font-medium text-content">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 text-content-muted">{i + 1}</td>
                  <td className="px-6 py-4 font-medium text-content">{c.nameEn}</td>
                  <td className="px-6 py-4 text-content-soft">{c.nameAr ?? "—"}</td>
                  <td className="px-6 py-4">
                    {c.isActive !== false ? (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">{t("active")}</span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">{t("inactive")}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex gap-2 justify-end">
                      <Link href={`/admin/insurance/${c.id}/edit`}>
                        <Button variant="ghost" size="sm">{t("edit")}</Button>
                      </Link>
                      <Link href={`/admin/insurance/${c.id}`}>
                        <Button variant="ghost" size="sm">{t("view")}</Button>
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-sm text-content-muted">{t("totalInsurance")}: {filtered.length}</p>
    </div>
  );
}
