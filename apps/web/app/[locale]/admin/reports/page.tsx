"use client";

import { useEffect, useState } from "react";
import { BarChart3, DollarSign, Users, Calendar, TrendingUp, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";

interface Stats {
  totalPatients: number;
  appointmentsToday: number;
  revenue: number;
  activeDoctors: number;
}

interface RevenueReport {
  revenue: number;
  completedAppointments: number;
  from: string;
}

interface PatientsSummary {
  total: number;
  newLast30Days: number;
}

interface ReportAppointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  patient?: { firstName: string; lastName: string };
  doctor?: { user: { firstName: string; lastName: string } };
  branch?: { name: string };
}

export default function AdminReportsPage() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [patientsSummary, setPatientsSummary] = useState<PatientsSummary | null>(null);
  const [appointments, setAppointments] = useState<ReportAppointment[]>([]);
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    api<Stats>("/api/admin/stats").then(setStats).catch(() => setStats(null));
  }, []);
  useEffect(() => {
    api<RevenueReport>("/api/reports/revenue").then(setRevenue).catch(() => setRevenue(null));
  }, []);
  useEffect(() => {
    api<PatientsSummary>("/api/reports/patients-summary").then(setPatientsSummary).catch(() => setPatientsSummary(null));
  }, []);
  useEffect(() => {
    api<{ appointments: ReportAppointment[] }>(`/api/reports/appointments?from=${from}&to=${to}`)
      .then((r) => setAppointments(r.appointments || []))
      .catch(() => setAppointments([]));
  }, [from, to]);

  const cards = [
    { labelKey: "revenue", value: stats ? `EGP ${stats.revenue.toLocaleString()}` : "—", icon: DollarSign, color: "text-green-600" },
    { labelKey: "statTotalPatients", value: stats?.totalPatients ?? "—", icon: Users, color: "text-primary" },
    { labelKey: "appointmentsToday", value: stats?.appointmentsToday ?? "—", icon: Calendar, color: "text-blue-600" },
    { labelKey: "activeDoctors", value: stats?.activeDoctors ?? "—", icon: BarChart3, color: "text-amber-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-content mb-8">{t("reports")}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(({ labelKey, value, icon: Icon, color }) => (
          <div key={labelKey} className="glass rounded-2xl p-6">
            <Icon className={`w-10 h-10 mb-4 ${color}`} />
            <p className="text-content-soft text-sm">{t(labelKey)}</p>
            <p className="text-2xl font-bold text-content mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            {t("revenueThisMonth")}
          </h2>
          <p className="text-2xl font-bold text-content">
            {revenue ? `EGP ${revenue.revenue.toLocaleString()}` : "—"}
          </p>
          <p className="text-sm text-content-muted mt-1">
            {revenue?.completedAppointments ?? 0} {t("completedAppointments")}
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t("patientsSummary")}
          </h2>
          <p className="text-2xl font-bold text-content">{patientsSummary?.total ?? "—"} {t("total")}</p>
          <p className="text-sm text-content-muted mt-1">
            +{patientsSummary?.newLast30Days ?? 0} {t("newLast30Days")}
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 md:p-8">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          {t("appointmentsByDateRange")}
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-content-muted mb-1">{t("from")}</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white text-content px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-content-muted mb-1">{t("to")}</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white text-content px-3 py-2"
            />
          </div>
        </div>
        {appointments.length === 0 ? (
          <p className="text-content-soft">{t("noAppointmentsInRange")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-content">{t("patient")}</th>
                  <th className="text-left px-4 py-3 font-medium text-content">{t("doctorName")}</th>
                  <th className="text-left px-4 py-3 font-medium text-content">{t("date")}</th>
                  <th className="text-left px-4 py-3 font-medium text-content">{t("time")}</th>
                  <th className="text-left px-4 py-3 font-medium text-content">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 20).map((a) => (
                  <tr key={a.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-content">
                      {a.patient ? `${a.patient.firstName} ${a.patient.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-content-soft">
                      {a.doctor ? `Dr. ${a.doctor.user.firstName} ${a.doctor.user.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-content-soft">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-content-soft">{a.startTime}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${a.status === "COMPLETED" ? "bg-green-100 text-green-700" : a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length > 20 && (
              <p className="text-content-muted text-sm mt-2">{t("showingFirst20")} ({appointments.length} {t("total")})</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
