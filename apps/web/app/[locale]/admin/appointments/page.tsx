"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";

interface Doctor {
  id: string;
  user: { firstName: string; lastName: string };
}

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { id: string; user: { firstName: string; lastName: string } };
  branch?: { name: string };
}

function AdminAppointmentsContent() {
  const t = useTranslations("admin");
  const searchParams = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId") || "";
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [patientId, setPatientId] = useState(patientIdFromUrl);

  useEffect(() => {
    setPatientId(patientIdFromUrl);
  }, [patientIdFromUrl]);

  useEffect(() => {
    api<Doctor[]>("/api/doctors").then(setDoctors).catch(() => setDoctors([]));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (doctorId) query.set("doctorId", doctorId);
    if (patientId) query.set("patientId", patientId);
    if (dateFrom) query.set("from", dateFrom);
    if (dateTo) query.set("to", dateTo);
    const q = query.toString() ? `?${query.toString()}` : "";
    api<Appointment[]>(`/api/appointments${q}`)
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [status, doctorId, patientId, dateFrom, dateTo]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-content">{t("appointments")}</h1>
        <div className="flex gap-2">
          {patientId ? (
            <Link href="/admin/appointments">
              <Button variant="outline" size="sm">{t("viewAllAppointments")}</Button>
            </Link>
          ) : null}
          <Link href={patientId ? `/admin/appointments/new?patientId=${patientId}` : "/admin/appointments/new"}>
            <Button className="gap-2">
              <Calendar className="w-5 h-5" />
              {t("newAppointment")}
            </Button>
          </Link>
        </div>
      </div>
      {patientId ? (
        <p className="mb-4 text-sm text-content-soft">
          {t("filterByPatient")}: <Link href={`/admin/patients/${patientId}`} className="text-primary font-medium hover:underline">{t("view")}</Link>
          {" · "}
          <Link href="/admin/appointments" className="text-primary hover:underline">{t("viewAllAppointments")}</Link>
        </p>
      ) : null}

      <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-content-muted mb-1">{t("filterByStatus")}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-3 py-2 min-w-[120px]"
          >
            <option value="">{t("allStatuses")}</option>
            <option value="PENDING">{t("pending")}</option>
            <option value="CONFIRMED">{t("confirm")}</option>
            <option value="COMPLETED">{t("completed")}</option>
            <option value="CANCELLED">{t("cancelled")}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-content-muted mb-1">{t("filterByDoctor")}</label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-3 py-2 min-w-[160px]"
          >
            <option value="">—</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>Dr. {d.user.firstName} {d.user.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-content-muted mb-1">{t("dateFrom")}</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-content-muted mb-1">{t("dateTo")}</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-3 py-2"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-content-soft">{t("loading")}</div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-content-soft">{t("noAppointments")}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content">{t("patient")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("doctorName")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("date")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("time")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("status")}</th>
                <th className="text-right px-6 py-4 font-medium text-content">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-content">
                    <Link href={`/admin/patients/${a.patient.id}`} className="text-primary hover:underline">
                      {a.patient.firstName} {a.patient.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-content-soft">Dr. {a.doctor.user.firstName} {a.doctor.user.lastName}</td>
                  <td className="px-6 py-4 text-content-soft">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-content-soft">{a.startTime}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      a.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                      a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" :
                      a.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/appointments/${a.id}`}>
                      <Button variant="ghost" size="sm">{t("view")}</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminAppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-content-soft">Loading...</div>}>
      <AdminAppointmentsContent />
    </Suspense>
  );
}
