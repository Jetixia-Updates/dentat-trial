"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}
interface Appointment {
  id: string;
  date: string;
  patient: { firstName: string; lastName: string };
}

export default function NewBillPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId") || "";
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api<{ patients: Patient[] }>("/api/patients").then((r) => {
      const list = r.patients || [];
      setPatients(list);
    }).catch(() => {});
    const q = patientIdFromUrl ? `?patientId=${patientIdFromUrl}` : "";
    api<Appointment[]>(`/api/appointments${q}`).then(setAppointments).catch(() => setAppointments([]));
  }, [patientIdFromUrl]);

  useEffect(() => {
    if (!patientIdFromUrl) return;
    api<Patient>(`/api/patients/${patientIdFromUrl}`)
      .then((p) => setPatients((prev) => (prev.some((x) => x.id === p.id) ? prev : [p, ...prev])))
      .catch(() => {});
  }, [patientIdFromUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api("/api/billing", {
        method: "POST",
        body: JSON.stringify({
          patientId: data.get("patientId"),
          appointmentId: data.get("appointmentId") || undefined,
          total: Number(data.get("total")),
        }),
      });
      router.push("/admin/billing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bill");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/billing" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToBilling")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("newBill")}</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 px-4 py-3">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("patient")}</label>
          <select name="patientId" required className="input-field" defaultValue={patientIdFromUrl}>
            <option value="">{t("selectPatient")}</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
          {patientIdFromUrl ? (
            <p className="mt-1 text-xs text-content-soft">
              <Link href={`/admin/patients/${patientIdFromUrl}`} className="text-primary hover:underline">{t("view")}</Link>
            </p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("selectAppointment")}</label>
          <select name="appointmentId" className="input-field">
            <option value="">—</option>
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                {new Date(a.date).toLocaleDateString()} – {a.patient.firstName} {a.patient.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-content">{t("amount")} (EGP)</label>
          <input name="total" type="number" min="0" step="0.01" required className="input-field" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? t("creating") : t("createBill")}</Button>
      </form>
    </div>
  );
}
