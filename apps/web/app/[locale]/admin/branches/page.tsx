"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Link } from "@/i18n/navigation";
import { MapPin, Phone, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Branch {
  id: string;
  name: string;
  nameAr?: string | null;
  address: string;
  addressAr?: string | null;
  city?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  isActive: boolean;
}

export default function AdminBranchesPage() {
  const t = useTranslations("admin");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api<Branch[]>("/api/branches?all=true")
      .then(setBranches)
      .catch(() => setBranches([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return branches;
    const q = search.trim().toLowerCase();
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.nameAr && b.nameAr.includes(q)) ||
        b.address.toLowerCase().includes(q) ||
        (b.city && b.city.toLowerCase().includes(q))
    );
  }, [branches, search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-content">{t("branches")}</h1>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted" />
            <input
              type="search"
              placeholder={t("searchBranches")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-content placeholder:text-slate-500 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Link href="/admin/branches/new">
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              {t("addBranch")}
            </Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="glass rounded-2xl p-12 text-center text-content-soft">{t("loading")}</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-content-soft">{t("noBranches")}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((b) => (
            <div key={b.id} className="glass rounded-2xl p-6 border border-white/60">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg text-content">{b.name}</h3>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    b.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {b.isActive ? t("active") : t("inactive")}
                </span>
              </div>
              <div className="space-y-2 text-content-soft text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {b.address}
                </p>
                {b.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0" />
                    {b.phone}
                  </p>
                )}
                {b.city && <p>{b.city}</p>}
                <span className="inline-flex gap-2 mt-3">
                  <Link href={`/admin/branches/${b.id}/edit`}>
                    <Button variant="ghost" size="sm">{t("edit")}</Button>
                  </Link>
                  <Link href={`/admin/branches/${b.id}`}>
                    <Button variant="ghost" size="sm">{t("view")}</Button>
                  </Link>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-content-muted">{t("totalBranches")}: {filtered.length}</p>
    </div>
  );
}
