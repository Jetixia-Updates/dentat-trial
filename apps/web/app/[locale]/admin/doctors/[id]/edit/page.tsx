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
  isActive: boolean;
}

interface Doctor {
  id: string;
  specialty: string;
  specialtyAr?: string | null;
  isActive: boolean;
  user: { firstName: string; lastName: string; phone?: string | null };
  branches: { branch: { id: string; name: string; address?: string } }[];
}

export default function EditDoctorPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api<Doctor>(`/api/doctors/${params.id}`),
      api<Branch[]>("/api/branches"),
    ])
      .then(([doc, br]) => {
        setDoctor(doc);
        setBranches(br);
      })
      .catch(() => router.push("/admin/doctors"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!doctor) return;
    setError("");
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const branchIds = form.querySelectorAll<HTMLInputElement>("input[name=\"branchIds\"]:checked");
    const selectedBranchIds = Array.from(branchIds).map((el) => el.value);
    try {
      await api(`/api/doctors/${doctor.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone") || undefined,
          specialty: data.get("specialty"),
          specialtyAr: data.get("specialtyAr") || undefined,
          isActive: data.get("isActive") === "true",
          branchIds: selectedBranchIds,
        }),
      });
      router.push(`/admin/doctors/${doctor.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !doctor) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  const selectedBranchIds = new Set(doctor.branches.map((b) => b.branch.id));

  return (
    <div>
      <Link href={`/admin/doctors/${doctor.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToDoctors")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("editDoctor")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("firstName")}</label>
            <input name="firstName" defaultValue={doctor.user.firstName} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("lastName")}</label>
            <input name="lastName" defaultValue={doctor.user.lastName} required className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
          <input name="phone" type="tel" defaultValue={doctor.user.phone ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("specialty")}</label>
          <input name="specialty" defaultValue={doctor.specialty} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("specialtyAr")}</label>
          <input name="specialtyAr" defaultValue={doctor.specialtyAr ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("status")}</label>
          <select name="isActive" className="input-field" defaultValue={doctor.isActive ? "true" : "false"}>
            <option value="true">{t("active")}</option>
            <option value="false">{t("inactive")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("selectBranches")}</label>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto">
            {branches.length === 0 ? (
              <p className="text-content-soft text-sm">{t("noBranches")}</p>
            ) : (
              branches.map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="branchIds"
                    value={b.id}
                    defaultChecked={selectedBranchIds.has(b.id)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-content">{b.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? t("saving") : t("saveChanges")}</Button>
      </form>
    </div>
  );
}
