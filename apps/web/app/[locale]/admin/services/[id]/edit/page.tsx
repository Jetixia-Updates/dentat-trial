"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

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

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Service>(`/api/services/${params.id}`)
      .then(setService)
      .catch(() => router.push("/admin/services"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!service) return;
    setError("");
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const priceVal = data.get("price");
    const durationVal = data.get("duration");
    try {
      await api(`/api/services/${service.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: data.get("name"),
          nameAr: data.get("nameAr") || undefined,
          department: data.get("department"),
          price: priceVal !== "" && priceVal != null ? Number(priceVal) : null,
          duration: durationVal !== "" && durationVal != null ? Number(durationVal) : null,
          isActive: data.get("isActive") === "true",
        }),
      });
      router.push(`/admin/services/${service.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  function departmentLabel(d: string) {
    const out = (t as (k: string) => string)(`department_${d}`);
    return out && !out.startsWith("department_") ? out : d.replace(/_/g, " ");
  }

  if (loading || !service) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <Link href={`/admin/services/${service.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToServices")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("editService")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("serviceName")} (EN)</label>
          <input name="name" defaultValue={service.name} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("serviceName")} (AR) / {t("nameAr")}</label>
          <input name="nameAr" defaultValue={service.nameAr ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("department")}</label>
          <select name="department" defaultValue={service.department} required className="input-field">
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{departmentLabel(d)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("price")} (EGP)</label>
          <input name="price" type="number" min="0" step="0.01" defaultValue={service.price ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("durationMin")}</label>
          <input name="duration" type="number" min="0" defaultValue={service.duration ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("status")}</label>
          <select name="isActive" className="input-field" defaultValue={service.isActive ? "true" : "false"}>
            <option value="true">{t("active")}</option>
            <option value="false">{t("inactive")}</option>
          </select>
        </div>
        <Button type="submit" disabled={saving}>{saving ? t("saving") : t("saveChanges")}</Button>
      </form>
    </div>
  );
}
