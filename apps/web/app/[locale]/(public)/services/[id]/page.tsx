"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Stethoscope, Smile, Baby, Activity, Scissors, Heart, Scan, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

const serviceImages: Record<string, string> = {
  general: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=90",
  orthodontics: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=90",
  cosmetic: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=90",
  pediatric: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1200&q=90",
  "oral-surgery": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&q=90",
  periodontics: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=90",
  radiology: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=90",
};

const serviceConfig: Record<string, { nameKey: string; icon: typeof Stethoscope }> = {
  general: { nameKey: "general", icon: Stethoscope },
  orthodontics: { nameKey: "orthodontics", icon: Smile },
  cosmetic: { nameKey: "cosmetic", icon: Activity },
  pediatric: { nameKey: "pediatric", icon: Baby },
  "oral-surgery": { nameKey: "oralSurgery", icon: Scissors },
  periodontics: { nameKey: "periodontics", icon: Heart },
  radiology: { nameKey: "radiology", icon: Scan },
};

const RADIOLOGY_TYPES = ["panoramic", "periapical", "bitewing", "cbct", "cephalometric", "occlusal"] as const;

export default function ServiceDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const t = useTranslations("services");

  const config = serviceConfig[id];
  if (!config) {
    return (
      <main className="pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-content">Service not found</h1>
          <Link href="/services" className="mt-4 inline-block">
            <Button variant="outline">← Back to Services</Button>
          </Link>
        </div>
      </main>
    );
  }

  const { nameKey, icon: Icon } = config;

  const imageUrl = serviceImages[id] ?? serviceImages.general;

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t("backToServices")}
        </Link>
        <div className="glass rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full aspect-[21/9] min-h-[200px] bg-slate-100">
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/95 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{t(nameKey)}</h1>
                <p className="text-white/90 text-sm mt-0.5">{t(`${nameKey}Ar`)}</p>
              </div>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <p className="text-content-soft text-lg leading-relaxed">{t(`${nameKey}Desc`)}</p>
            {id === "radiology" && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-content mb-6">{t("radiologyAspectsTitle")}</h2>
                <p className="text-content-soft mb-6">{t("radiologyIntro")}</p>
                <ul className="space-y-5">
                  {RADIOLOGY_TYPES.map((type) => (
                    <li key={type} className="glass rounded-xl p-5 border border-white/60">
                      <h3 className="font-semibold text-content">{t(`radiologyType_${type}`)}</h3>
                      <p className="mt-2 text-content-soft text-sm leading-relaxed">{t(`radiologyType_${type}_Desc`)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/book" className="mt-8 inline-block">
              <Button>{t("bookAppointment")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
