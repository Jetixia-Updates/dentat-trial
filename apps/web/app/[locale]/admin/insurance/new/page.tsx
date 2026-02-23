"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NewInsurancePage() {
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
    try {
      await api("/api/insurance", {
        method: "POST",
        body: JSON.stringify({
          nameEn: data.get("nameEn"),
          nameAr: data.get("nameAr") || undefined,
          isActive: true,
        }),
      });
      router.push("/admin/insurance");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create insurance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/insurance" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToInsurance")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("addInsurance")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameEn")}</label>
          <input name="nameEn" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameAr")}</label>
          <input name="nameAr" className="input-field" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? t("creating") : t("createInsurance")}</Button>
      </form>
    </div>
  );
}
