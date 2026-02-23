"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NewPatientPage() {
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
      await api("/api/patients", {
        method: "POST",
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
      router.push("/admin/patients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create patient");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/patients" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToPatients")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("addPatient")}</h1>
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
          <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
          <input name="phone" required type="tel" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("email")}</label>
          <input name="email" type="email" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("address")}</label>
          <input name="address" className="input-field" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("dateOfBirth")}</label>
            <input name="dateOfBirth" type="date" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-content">{t("gender")}</label>
            <select name="gender" className="input-field">
              <option value="">—</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={loading}>{loading ? t("creating") : t("createPatient")}</Button>
      </form>
    </div>
  );
}





