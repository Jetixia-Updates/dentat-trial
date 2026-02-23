"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  isActive: boolean;
}

export default function NewDoctorPage() {
  const router = useRouter();
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    api<Branch[]>("/api/branches")
      .then(setBranches)
      .catch(() => setBranches([]));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const branchIds = form.querySelectorAll<HTMLInputElement>("input[name=\"branchIds\"]:checked");
    const selectedBranchIds = Array.from(branchIds).map((el) => el.value);
    try {
      await api("/api/doctors", {
        method: "POST",
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
          specialty: data.get("specialty"),
          specialtyAr: data.get("specialtyAr") || undefined,
          branchIds: selectedBranchIds.length ? selectedBranchIds : undefined,
        }),
      });
      router.push("/admin/doctors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create doctor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/doctors" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToDoctors")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("addDoctor")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("firstName")}</label>
            <input name="firstName" required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("lastName")}</label>
            <input name="lastName" required className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("email")}</label>
          <input name="email" required type="email" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
          <input name="phone" type="tel" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("specialty")}</label>
          <input name="specialty" required className="input-field" placeholder="e.g. General Dentistry" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("specialtyAr")}</label>
          <input name="specialtyAr" className="input-field" placeholder="مثال: طب الأسنان العام" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("selectBranches")}</label>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto">
            {branches.length === 0 ? (
              <p className="text-content-soft text-sm">{t("noBranches")}</p>
            ) : (
              branches.map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="branchIds" value={b.id} className="rounded border-slate-300" />
                  <span className="text-content">{b.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
        <Button type="submit" disabled={loading}>{loading ? t("creating") : t("createDoctor")}</Button>
      </form>
    </div>
  );
}
