"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Settings, Clock, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const t = useTranslations("admin");
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-content mb-8">{t("settings")}</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }}
        className="space-y-8"
      >
        <section className="glass rounded-2xl p-6 md:p-8">
          <h2 className="font-semibold text-lg text-content mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {t("clinicSettings")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2 text-content">{t("clinicName")}</label>
              <input
                type="text"
                defaultValue="Dental Clinic"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-content">{t("phone")}</label>
              <input
                type="tel"
                defaultValue="+20 123 456 789"
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2 text-content">{t("email")}</label>
              <input
                type="email"
                defaultValue="info@dental.com"
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2 text-content">{t("address")}</label>
              <input
                type="text"
                defaultValue="123 Dental Street, Cairo, Egypt"
                className="input-field"
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-6 md:p-8">
          <h2 className="font-semibold text-lg text-content mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t("workingHours")}
          </h2>
          <p className="text-content-soft text-sm mb-4">{t("workingHoursDesc")}</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2 text-content">Weekdays</label>
              <input
                type="text"
                defaultValue="Sat–Thu: 9am–9pm"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-content">Friday</label>
              <input
                type="text"
                defaultValue="2pm–9pm"
                className="input-field"
              />
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-6 md:p-8">
          <h2 className="font-semibold text-lg text-content mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            {t("notifications")}
          </h2>
          <div className="space-y-4 max-w-2xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-content">{t("emailNotifications")}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-content">{t("smsReminders")}</span>
            </label>
          </div>
        </section>

        <Button type="submit" size="lg">
          {saved ? t("saved") : t("saveChanges")}
        </Button>
      </form>
    </div>
  );
}
