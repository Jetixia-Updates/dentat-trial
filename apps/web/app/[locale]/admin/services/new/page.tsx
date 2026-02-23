"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

const DEPARTMENTS = [
  "GENERAL_DENTISTRY",
  "ORTHODONTICS",
  "COSMETIC_DENTISTRY",
  "ORAL_SURGERY",
  "PEDIATRIC_DENTISTRY",
  "PERIODONTICS",
  "RADIOLOGY",
];

export default function NewServicePage() {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const priceVal = data.get("price");
    const durationVal = data.get("duration");
    try {
      await api("/api/services", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          nameAr: data.get("nameAr") || undefined,
          department: data.get("department"),
          price: priceVal !== "" && priceVal != null ? Number(priceVal) : undefined,
          duration: durationVal !== "" && durationVal != null ? Number(durationVal) : undefined,
          isActive: true,
        }),
      });
      router.push("/admin/services");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setLoading(false);
    }
  }

  function departmentLabel(d: string) {
    const out = (t as (k: string) => string)(`department_${d}`);
    return out && !out.startsWith("department_") ? out : d.replace(/_/g, " ");
  }

  return (
    <div>
      <Link href="/admin/services" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToServices")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("addService")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("serviceName")} (EN)</label>
          <input name="name" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("serviceName")} (AR) / {t("nameAr")}</label>
          <input name="nameAr" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("department")}</label>
          <select name="department" required className="input-field">
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{departmentLabel(d)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("price")} (EGP)</label>
          <input name="price" type="number" min="0" step="0.01" className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("durationMin")}</label>
          <input name="duration" type="number" min="0" className="input-field" placeholder="0" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? t("creating") : t("createService")}</Button>
      </form>
    </div>
  );
}
