"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Users, Calendar, DollarSign, Activity, UserPlus, CalendarPlus, ArrowRight, Stethoscope, MapPin, Briefcase, CreditCard, FileText } from "lucide-react";
import { api } from "@/lib/api";

interface Stats {
  totalPatients: number;
  appointmentsToday: number;
  revenue: number;
  activeDoctors: number;
}

const statKeys = [
  { key: "totalPatients" as const, labelKey: "statTotalPatients", icon: Users },
  { key: "appointmentsToday" as const, labelKey: "appointmentsToday", icon: Calendar },
  { key: "revenue" as const, labelKey: "revenue", icon: DollarSign },
  { key: "activeDoctors" as const, labelKey: "activeDoctors", icon: Activity },
] as const;

const quickActions = [
  { href: "/admin/patients", labelKey: "viewPatients", icon: Users },
  { href: "/admin/patients/new", labelKey: "addPatient", icon: UserPlus },
  { href: "/admin/appointments", labelKey: "viewAppointments", icon: Calendar },
  { href: "/admin/appointments/new", labelKey: "newAppointment", icon: CalendarPlus },
  { href: "/admin/doctors", labelKey: "doctors", icon: Stethoscope },
  { href: "/admin/branches", labelKey: "branches", icon: MapPin },
  { href: "/admin/services", labelKey: "services", icon: Briefcase },
  { href: "/admin/billing", labelKey: "billing", icon: CreditCard },
  { href: "/admin/reports", labelKey: "reports", icon: FileText },
] as const;

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Stats>("/api/admin/stats")
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-content mb-8">{t("dashboard")}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statKeys.map(({ key, labelKey, icon: Icon }) => (
          <div key={key} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-content-soft text-sm">{t(labelKey)}</span>
              <Icon className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-2xl font-bold text-content">
              {loading ? "—" : key === "revenue" ? `EGP ${stats?.[key]?.toLocaleString() ?? 0}` : stats?.[key] ?? 0}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">{t("quickActions")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ href, labelKey, icon: Icon }) => (
            <Link key={href} href={href}>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-cyan-100 hover:bg-surface-muted transition-colors group">
                <Icon className="w-6 h-6 text-primary" />
                <span className="flex-1 font-medium">{t(labelKey)}</span>
                <ArrowRight className="w-4 h-4 text-content-muted group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
