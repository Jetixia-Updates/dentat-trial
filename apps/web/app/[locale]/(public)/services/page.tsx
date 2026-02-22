"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Stethoscope, Smile, Baby, Activity, Scissors, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

const serviceIds = ["general", "orthodontics", "cosmetic", "pediatric", "oral-surgery", "periodontics"] as const;
const icons = [Stethoscope, Smile, Activity, Baby, Scissors, Heart];

export default function ServicesPage() {
  const t = useTranslations("services");

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-content text-center">{t("title")}</h1>
        <p className="mt-4 text-content-soft text-center max-w-2xl mx-auto">{t("subtitle")}</p>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {serviceIds.map((id, i) => {
            const Icon = icons[i];
            const nameKey = id === "oral-surgery" ? "oralSurgery" : id === "general" ? "general" : id;
            return (
              <div
                key={id}
                className="glass rounded-2xl p-8 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t(nameKey)}</h3>
                <p className="text-content-muted mt-1">{t(`${nameKey}Ar`)}</p>
                <p className="mt-4 text-content-soft flex-1">{t(`${nameKey}Desc`)}</p>
                <Link href={`/services/${id}`} className="mt-4">
                  <Button variant="outline" size="sm">{t("learnMore")}</Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
