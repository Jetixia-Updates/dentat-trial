"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string | null;
  notes?: string | null;
  patient: { id: string; firstName: string; lastName: string; phone?: string; email?: string | null };
  doctor: { id: string; user: { firstName: string; lastName: string } };
  branch: { id: string; name: string; address?: string };
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api<Appointment>(`/api/appointments/${params.id}`)
      .then((a) => {
        setAppointment(a);
        setStatus(a.status);
      })
      .catch(() => router.push("/admin/appointments"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleStatusChange() {
    if (!appointment || !status) return;
    setUpdating(true);
    try {
      await api(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setAppointment((prev) => prev ? { ...prev, status } : null);
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !appointment) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <Link href="/admin/appointments" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToAppointments")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("appointmentDetail")}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("patient")}</h2>
          <p className="font-medium text-content">
            <Link href={`/admin/patients/${appointment.patient.id}`} className="text-primary hover:underline">
              {appointment.patient.firstName} {appointment.patient.lastName}
            </Link>
          </p>
          {appointment.patient.phone && <p className="text-content-soft text-sm mt-1">{appointment.patient.phone}</p>}
          {appointment.patient.email && <p className="text-content-soft text-sm">{appointment.patient.email}</p>}
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("doctorName")}</h2>
          <p className="font-medium text-content">
            Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("date")} & {t("time")}</h2>
          <p className="text-content">{new Date(appointment.date).toLocaleDateString()}</p>
          <p className="text-content-soft text-sm">{appointment.startTime} – {appointment.endTime}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("branchDetail")}</h2>
          <p className="font-medium text-content">{appointment.branch.name}</p>
          {appointment.branch.address && <p className="text-content-soft text-sm mt-1">{appointment.branch.address}</p>}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 mt-6">
        <h2 className="font-semibold text-lg text-content mb-4">{t("changeStatus")}</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-4 py-2"
          >
            <option value="PENDING">{t("pending")}</option>
            <option value="CONFIRMED">{t("confirm")}</option>
            <option value="COMPLETED">{t("completed")}</option>
            <option value="CANCELLED">{t("cancelled")}</option>
          </select>
          <Button onClick={handleStatusChange} disabled={updating}>
            {updating ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </div>

      {(appointment.reason || appointment.notes) && (
        <div className="glass rounded-2xl p-6 mt-6">
          {appointment.reason && (
            <p className="text-content-soft"><span className="font-medium text-content">{t("reason")}:</span> {appointment.reason}</p>
          )}
          {appointment.notes && (
            <p className="text-content-soft mt-2"><span className="font-medium text-content">{t("notes")}:</span> {appointment.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
