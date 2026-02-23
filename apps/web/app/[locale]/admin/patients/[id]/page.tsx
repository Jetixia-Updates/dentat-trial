"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Calendar, Edit, FileText, Stethoscope, Briefcase } from "lucide-react";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  status: string;
  branch?: { name: string };
}

interface Bill {
  id: string;
  total: number;
  status: string;
  createdAt: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  appointments?: Appointment[];
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Patient>(`/api/patients/${params.id}`)
      .then(setPatient)
      .catch(() => router.push("/admin/patients"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  useEffect(() => {
    if (!patient?.id) return;
    api<{ bills: Bill[] }>(`/api/billing?patientId=${patient.id}`)
      .then((r) => setBills(r.bills || []))
      .catch(() => setBills([]));
  }, [patient?.id]);

  if (loading || !patient) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  const appointments = patient.appointments || [];

  return (
    <div>
      <Link href="/admin/patients" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToPatients")}
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-content">
          {patient.firstName} {patient.lastName}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/admin/patients/${patient.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              {t("edit")}
            </Button>
          </Link>
          <Link href={`/admin/appointments/new?patientId=${patient.id}`}>
            <Button size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              {t("bookAppointmentForPatient")}
            </Button>
          </Link>
          <Link href={`/admin/billing/new?patientId=${patient.id}`}>
            <Button size="sm" variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              {t("newBillForPatient")}
            </Button>
          </Link>
        </div>
      </div>

      {/* ربط السيستم - انتقال مباشر للأقسام والمواعيد والفواتير والأطباء */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-lg text-content mb-4">{t("systemLinks")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href={`/admin/appointments?patientId=${patient.id}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary shrink-0" />
            <span className="font-medium text-content">{t("goToAppointments")}</span>
          </Link>
          <Link
            href={`/admin/billing?patientId=${patient.id}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <FileText className="w-6 h-6 text-primary shrink-0" />
            <span className="font-medium text-content">{t("goToBilling")}</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-primary shrink-0" />
            <span className="font-medium text-content">{t("goToPricing")}</span>
          </Link>
          <Link
            href="/admin/doctors"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Stethoscope className="w-6 h-6 text-primary shrink-0" />
            <span className="font-medium text-content">{t("goToDoctors")}</span>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("contactInfo")}</h2>
          <dl className="space-y-3 text-content-soft">
            <div>
              <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("phone")}</dt>
              <dd className="font-medium text-content">{patient.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("email")}</dt>
              <dd className="font-medium text-content">{patient.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("address")}</dt>
              <dd className="font-medium text-content">{patient.address || "—"}</dd>
            </div>
            {patient.dateOfBirth && (
              <div>
                <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("dateOfBirth")}</dt>
                <dd className="font-medium text-content">{new Date(patient.dateOfBirth).toLocaleDateString()}</dd>
              </div>
            )}
            {patient.gender && (
              <div>
                <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("gender")}</dt>
                <dd className="font-medium text-content">{patient.gender}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("patientAppointments")}</h2>
          {appointments.length === 0 ? (
            <p className="text-content-soft text-sm">{t("noAppointments")}</p>
          ) : (
            <ul className="space-y-2">
              {appointments.slice(0, 10).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <Link href={`/admin/appointments/${a.id}`} className="text-primary hover:underline font-medium">
                    {new Date(a.date).toLocaleDateString()} – {a.startTime}
                  </Link>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    a.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                    a.status === "CONFIRMED" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {appointments.length > 10 && (
            <p className="text-content-muted text-xs mt-2">{t("showingFirst20")}</p>
          )}
          <Link href={`/admin/appointments?patientId=${patient.id}`} className="mt-3 inline-block text-sm text-primary font-medium hover:underline">
            {t("goToAppointments")} →
          </Link>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4 flex items-center justify-between">
            <span>{t("patientBills")}</span>
            <Link href={`/admin/billing?patientId=${patient.id}`} className="text-sm font-normal text-primary hover:underline">{t("goToBilling")} →</Link>
          </h2>
          {bills.length === 0 ? (
            <p className="text-content-soft text-sm">{t("noBills")}</p>
          ) : (
            <ul className="space-y-2">
              {bills.slice(0, 10).map((b) => (
                <li key={b.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <Link href={`/admin/billing/${b.id}`} className="text-primary hover:underline font-medium">
                    EGP {b.total.toLocaleString()} – {new Date(b.createdAt).toLocaleDateString()}
                  </Link>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    b.status === "PAID" ? "bg-green-100 text-green-700" : b.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/admin/billing/new?patientId=${patient.id}`} className="mt-3 inline-block text-sm text-primary font-medium hover:underline">
            {t("newBillForPatient")}
          </Link>
        </div>
      </div>
    </div>
  );
}
