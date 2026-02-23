"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=90",
    titleKey: "slide1Title" as const,
    subtitleKey: "slide1Subtitle" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=90",
    titleKey: "slide2Title" as const,
    subtitleKey: "slide2Subtitle" as const,
  },
  {
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920&q=90",
    titleKey: "slide3Title" as const,
    subtitleKey: "slide3Subtitle" as const,
  },
];

const AUTOPLAY_MS = 5500;

export function HeroSlider() {
  const t = useTranslations("home");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  function goPrev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function goNext() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <section
      className="relative w-full overflow-hidden
        h-[60vh] min-h-[320px] max-h-[500px]
        sm:h-[70vh] sm:min-h-[400px] sm:max-h-[600px]
        md:h-[78vh] md:min-h-[450px] md:max-h-[720px]
        lg:h-[85vh] lg:min-h-[520px] lg:max-h-[900px]
        rounded-none sm:rounded-2xl md:rounded-3xl
        mx-0 sm:mx-4 md:mx-6 lg:mx-auto lg:max-w-7xl
        shadow-2xl ring-1 ring-black/5"
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/88 via-slate-900/55 to-slate-900/20 sm:to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 py-8 sm:px-8 md:px-12 lg:px-20">
            <p className="text-white font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm mb-2 sm:mb-4 drop-shadow-lg [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
              {t("tagline")}
            </p>
            <h2 className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] tracking-tight max-w-2xl drop-shadow-lg [text-shadow:0_2px_12px_rgba(0,0,0,0.6),0_4px_24px_rgba(0,0,0,0.4)]">
              {t(slide.titleKey)}
            </h2>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg md:text-xl text-white/95 max-w-xl line-clamp-3 sm:line-clamp-none drop-shadow-md [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
              {t(slide.subtitleKey)}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link href="/book" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-h-[44px] bg-white text-slate-900 hover:bg-slate-100 shadow-xl text-sm sm:text-base px-6 sm:px-8">
                  {t("bookAppointment")}
                </Button>
              </Link>
              <Link href="/services" className="inline-block w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px] border-2 border-white text-white hover:bg-white/10 text-sm sm:text-base px-6 sm:px-8">
                  {t("ourServices")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all touch-manipulation"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all touch-manipulation"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`rounded-full transition-all touch-manipulation min-w-[10px] min-h-[10px] ${
              i === index ? "bg-white w-6 sm:w-8 h-2.5" : "bg-white/50 hover:bg-white/70 w-2.5 h-2.5"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
