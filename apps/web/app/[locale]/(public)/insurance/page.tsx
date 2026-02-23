"use client";

import { useTranslations, useLocale } from "next-intl";
import { Shield, Check } from "lucide-react";
import { ACCEPTED_INSURANCE } from "@/data/insurance";

export default function InsurancePage() {
  const t = useTranslations("insurance");
  const locale = useLocale();

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-content">{t("title")}</h1>
            <p className="text-content-soft mt-0.5">{t("subtitle")}</p>
          </div>
        </div>
        <p className="text-content-soft mb-2">{t("accepted")}</p>
        <p className="text-content-muted text-sm mb-8">{t("originalForm")}</p>
        <ul className="grid sm:grid-cols-2 gap-3">
          {ACCEPTED_INSURANCE.map((c) => (
            <li
              key={c.id}
              className="glass rounded-xl px-5 py-4 border border-white/60 flex items-center gap-3"
            >
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-content block">
                  {locale === "ar" ? c.nameAr : c.nameEn}
                </span>
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary">
                  <Check className="w-3.5 h-3.5" />
                  {t("acceptedLabel")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
