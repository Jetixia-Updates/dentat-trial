"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Calendar, Stethoscope, Users, MapPin, MessageCircle, LogIn, Sparkles, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ServicesSlider } from "@/components/home/ServicesSlider";

const quickLinks = [
  { href: "/book", icon: Calendar, labelKey: "bookAppointment" as const },
  { href: "/services", icon: Stethoscope, labelKey: "ourServices" as const },
  { href: "/doctors", icon: Users, labelKey: "ourDoctors" as const },
  { href: "/branches", icon: MapPin, labelKey: "ourBranches" as const },
  { href: "/contact", icon: MessageCircle, labelKey: "contactUs" as const },
];

const stats = [
  { value: "500+", labelKey: "statsPatients" as const },
  { value: "15+", labelKey: "statsYears" as const },
  { value: "4", labelKey: "statsBranches" as const },
  { value: "20+", labelKey: "statsDoctors" as const },
];

const whyItems = [
  { icon: Sparkles, titleKey: "whyModern" as const, descKey: "whyModernDesc" as const },
  { icon: Award, titleKey: "whyExpert" as const, descKey: "whyExpertDesc" as const },
  { icon: Heart, titleKey: "whyCare" as const, descKey: "whyCareDesc" as const },
];

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <main className="pt-6 pb-24">
      {/* Hero Slider - 3 dental images, elite 8K */}
      <div className="mb-16">
        <HeroSlider />
      </div>

      {/* Services slider - same design as /services */}
      <ServicesSlider />

      {/* Stats bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, labelKey }) => (
            <div
              key={labelKey}
              className="glass rounded-2xl p-6 text-center shadow-xl shadow-slate-200/50 border border-white/60"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{value}</p>
              <p className="mt-1 text-sm font-medium text-content-soft">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-20">
        <h2 className="text-2xl font-bold text-content text-center mb-10">{t("ourServices")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map(({ href, icon: Icon, labelKey }) => (
            <Link key={href} href={href}>
              <div className="glass rounded-2xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-4 group cursor-pointer border border-white/60 shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <span className="font-semibold text-content text-lg">{t(labelKey)}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link href="/login">
            <Button variant="outline" size="lg" className="gap-2">
              <LogIn className="w-5 h-5" />
              {tNav("login")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-content text-center">{t("whyChooseUs")}</h2>
          <p className="mt-3 text-content-soft text-center max-w-2xl mx-auto">{t("whySubtitle")}</p>
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {whyItems.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="glass rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 border border-white/60"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-content">{t(titleKey)}</h3>
                <p className="mt-3 text-content-soft leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 mt-20 mb-12">
        <div className="glass rounded-3xl p-12 md:p-16 text-center shadow-2xl border border-white/60">
          <h2 className="text-3xl md:text-4xl font-bold text-content">{t("ctaTitle")}</h2>
          <p className="mt-4 text-lg text-content-soft">{t("ctaSubtitle")}</p>
          <Link href="/book" className="inline-block mt-8">
            <Button size="lg" className="text-base px-10 shadow-xl shadow-primary/20">
              {t("ctaButton")}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
