"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NewBranchPage() {
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
      await api("/api/branches", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          nameAr: data.get("nameAr") || undefined,
          address: data.get("address"),
          addressAr: data.get("addressAr") || undefined,
          city: data.get("city") || undefined,
          phone: data.get("phone") || undefined,
          whatsapp: data.get("whatsapp") || undefined,
          isActive: true,
        }),
      });
      router.push("/admin/branches");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create branch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/branches" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToBranches")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("addBranch")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameEn")}</label>
          <input name="name" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameAr")}</label>
          <input name="nameAr" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("address")}</label>
          <input name="address" required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("addressAr")}</label>
          <input name="addressAr" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("city")}</label>
          <input name="city" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
          <input name="phone" type="tel" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("whatsapp")}</label>
          <input name="whatsapp" type="tel" className="input-field" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? t("creating") : t("createBranch")}</Button>
      </form>
    </div>
  );
}
