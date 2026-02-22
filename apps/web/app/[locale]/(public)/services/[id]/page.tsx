"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Stethoscope, Smile, Baby, Activity, Scissors, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

const serviceMap: Record<string, { icon: React.ElementType; nameKey: string; itemsKey: string; descKey: string }> = {
  general: { icon: Stethoscope, nameKey: "general", itemsKey: "generalItems", descKey: "generalLongDesc" },
  orthodontics: { icon: Smile, nameKey: "orthodontics", itemsKey: "orthoItems", descKey: "orthoLongDesc" },
  cosmetic: { icon: Activity, nameKey: "cosmetic", itemsKey: "cosmeticItems", descKey: "cosmeticLongDesc" },
  pediatric: { icon: Baby, nameKey: "pediatric", itemsKey: "pediatricItems", descKey: "pediatricLongDesc" },
  "oral-surgery": { icon: Scissors, nameKey: "oralSurgery", itemsKey: "oralItems", descKey: "oralLongDesc" },
  periodontics: { icon: Heart, nameKey: "periodontics", itemsKey: "perioItems", descKey: "perioLongDesc" },
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations("services");
  const tHome = useTranslations("home");
  const { id } = use(params);
  const service = serviceMap[id];
  if (!service) notFound();

  const Icon = service.icon;
  const items = t(service.itemsKey).split(", ");

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass rounded-2xl p-8 lg:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-content">{t(service.nameKey)}</h1>
              <p className="text-primary font-medium">{t(`${service.nameKey}Ar`)}</p>
            </div>
          </div>
          <p className="text-lg text-content-soft mb-8">{t(service.descKey)}</p>
          <h2 className="font-semibold text-lg mb-4">{t("servicesIncluded")}</h2>
          <ul className="space-y-2 mb-8">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/book">
            <Button size="lg">{tHome("bookAppointment")}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
