"use client";

import { useTranslations } from "next-intl";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";

const statKeys = [
  { labelKey: "statTotalPatients", icon: Users },
  { labelKey: "appointmentsToday", icon: Calendar },
  { labelKey: "revenue", icon: DollarSign },
  { labelKey: "activeDoctors", icon: Activity },
] as const;

export default function AdminDashboard() {
  const t = useTranslations("admin");

  return (
    <div>
      <h1 className="text-3xl font-bold text-content mb-8">{t("dashboard")}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statKeys.map(({ labelKey, icon: Icon }) => (
          <div key={labelKey} className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-content-soft text-sm">{t(labelKey)}</span>
              <Icon className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-2xl font-bold text-content">—</p>
          </div>
        ))}
      </div>
      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">{t("quickActions")}</h2>
        <p className="text-content-soft">{t("quickActionsDesc")}</p>
      </div>
    </div>
  );
}
