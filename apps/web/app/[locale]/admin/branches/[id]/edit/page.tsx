"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

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

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Branch>(`/api/branches/${params.id}`)
      .then(setBranch)
      .catch(() => router.push("/admin/branches"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!branch) return;
    setError("");
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api(`/api/branches/${branch.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: data.get("name"),
          nameAr: data.get("nameAr") || undefined,
          address: data.get("address"),
          addressAr: data.get("addressAr") || undefined,
          city: data.get("city") || undefined,
          phone: data.get("phone") || undefined,
          whatsapp: data.get("whatsapp") || undefined,
          isActive: data.get("isActive") === "true",
        }),
      });
      router.push(`/admin/branches/${branch.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !branch) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <Link href={`/admin/branches/${branch.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToBranches")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("editBranch")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameEn")}</label>
          <input name="name" defaultValue={branch.name} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("nameAr")}</label>
          <input name="nameAr" defaultValue={branch.nameAr ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("address")}</label>
          <input name="address" defaultValue={branch.address} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("addressAr")}</label>
          <input name="addressAr" defaultValue={branch.addressAr ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("city")}</label>
          <input name="city" defaultValue={branch.city ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
          <input name="phone" type="tel" defaultValue={branch.phone ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("whatsapp")}</label>
          <input name="whatsapp" type="tel" defaultValue={branch.whatsapp ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("status")}</label>
          <select name="isActive" className="input-field" defaultValue={branch.isActive ? "true" : "false"}>
            <option value="true">{t("active")}</option>
            <option value="false">{t("inactive")}</option>
          </select>
        </div>
        <Button type="submit" disabled={saving}>{saving ? t("saving") : t("saveChanges")}</Button>
      </form>
    </div>
  );
}
