"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Stethoscope, Smile, Baby, Activity, Scissors, Heart, Scan } from "lucide-react";

const serviceIds = ["general", "orthodontics", "cosmetic", "pediatric", "oral-surgery", "periodontics", "radiology"] as const;
const icons = [Stethoscope, Smile, Activity, Baby, Scissors, Heart, Scan];

const serviceImages: Record<string, string> = {
  general: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=85",
  orthodontics: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=85",
  cosmetic: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=85",
  pediatric: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=85",
  "oral-surgery": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=85",
  periodontics: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=85",
  radiology: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=85",
};

export default function ServicesPage() {
  const t = useTranslations("services");

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-content text-center">{t("title")}</h1>
        <p className="mt-4 text-content-soft text-center max-w-2xl mx-auto">{t("subtitle")}</p>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {serviceIds.map((id, i) => {
            const Icon = icons[i];
            const nameKey = id === "oral-surgery" ? "oralSurgery" : id === "general" ? "general" : id === "radiology" ? "radiology" : id;
            const imageUrl = serviceImages[id];
            return (
              <div key={id} className="group">
                <Link href={`/services/${id}`} className="block">
                  <div className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full">
                    <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-white drop-shadow-md">{t(nameKey)}</h3>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-content-muted text-sm">{t(`${nameKey}Ar`)}</p>
                      <p className="mt-3 text-content-soft flex-1 line-clamp-2">{t(`${nameKey}Desc`)}</p>
                      <span className="mt-4 inline-flex text-primary font-medium text-sm border border-current rounded-lg px-4 py-2 w-fit hover:bg-primary/10 transition-colors">
                        {t("learnMore")}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
