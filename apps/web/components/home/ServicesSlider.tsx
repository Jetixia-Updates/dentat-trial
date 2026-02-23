"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Stethoscope, Smile, Baby, Activity, Scissors, Heart, Scan, ChevronLeft, ChevronRight } from "lucide-react";

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

export function ServicesSlider() {
  const t = useTranslations("services");
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-service-card]")?.getBoundingClientRect().width ?? 0;
    const gap = 24;
    const step = (cardWidth + gap) * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: step, behavior: "smooth" });
  }

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 mb-20">
      <h2 className="text-3xl font-bold text-content text-center">{t("title")}</h2>
      <p className="mt-3 text-content-soft text-center max-w-2xl mx-auto">{t("subtitle")}</p>

      <div className="relative mt-10">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-1 md:translate-x-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 shadow-xl border border-slate-200/80 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all touch-manipulation"
          aria-label="Previous services"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-1 md:-translate-x-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 shadow-xl border border-slate-200/80 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all touch-manipulation"
          aria-label="Next services"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-12 scrollbar-hide"
        >
          {serviceIds.map((id, i) => {
            const Icon = icons[i];
            const nameKey = id === "oral-surgery" ? "oralSurgery" : id === "general" ? "general" : id;
            const imageUrl = serviceImages[id];
            return (
              <div
                key={id}
                data-service-card
                className="flex-[0_0_min(85vw,340px)] sm:flex-[0_0_min(380px,45vw)] lg:flex-[0_0_360px] snap-center shrink-0"
              >
                <Link href={`/services/${id}`} className="block group">
                  <div className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full border border-white/60">
                    <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 360px"
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

      <div className="mt-6 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          {t("viewAll")}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
