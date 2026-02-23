"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Patient>(`/api/patients/${params.id}`)
      .then(setPatient)
      .catch(() => router.push("/admin/patients"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api(`/api/patients/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone"),
          email: data.get("email") || undefined,
          address: data.get("address") || undefined,
          dateOfBirth: data.get("dateOfBirth") || undefined,
          gender: data.get("gender") || undefined,
        }),
      });
      router.push(`/admin/patients/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !patient) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  const dateVal = patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().slice(0, 10) : "";

  return (
    <div>
      <Link href={`/admin/patients/${patient.id}`} className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToPatients")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("editPatient")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("firstName")}</label>
            <input name="firstName" defaultValue={patient.firstName} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("lastName")}</label>
            <input name="lastName" defaultValue={patient.lastName} required className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
          <input name="phone" type="tel" defaultValue={patient.phone} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("email")}</label>
          <input name="email" type="email" defaultValue={patient.email ?? ""} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("address")}</label>
          <input name="address" defaultValue={patient.address ?? ""} className="input-field" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("dateOfBirth")}</label>
            <input name="dateOfBirth" type="date" defaultValue={dateVal} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("gender")}</label>
            <select name="gender" defaultValue={patient.gender ?? ""} className="input-field">
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? t("saving") : t("saveChanges")}</Button>
      </form>
    </div>
  );
}
