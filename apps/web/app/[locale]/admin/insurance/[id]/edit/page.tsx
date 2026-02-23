"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface InsuranceCompany {
  id: string;
  nameEn: string;
  nameAr?: string | null;
  isActive: boolean;
}

export default function EditInsurancePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [company, setCompany] = useState<InsuranceCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<InsuranceCompany>(`/api/insurance/${params.id}`)
      .then(setCompany)
      .catch(() => router.push("/admin/insurance"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company) return;
    setError("");
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api(`/api/insurance/${company.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          nameEn: data.get("nameEn"),
          nameAr: data.get("nameAr") || undefined,
          isActive: data.get("isActive") === "true",
        }),
      });
      router.push(`/admin/insurance/${company.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !company) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <Link href={`/admin/insurance/${company.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToInsurance")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("editInsurance")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameEn")}</label>
          <input name="nameEn" defaultValue={company.nameEn} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameAr")}</label>
          <input name="nameAr" defaultValue={company.nameAr ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("status")}</label>
          <select name="isActive" className="input-field" defaultValue={company.isActive ? "true" : "false"}>
            <option value="true">{t("active")}</option>
            <option value="false">{t("inactive")}</option>
          </select>
        </div>
        <Button type="submit" disabled={saving}>{saving ? t("saving") : t("saveChanges")}</Button>
      </form>
    </div>
  );
}
