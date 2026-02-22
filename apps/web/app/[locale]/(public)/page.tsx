"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  Stethoscope,
  Calendar,
  Star,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-surface-soft via-cyan-50/40 to-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-semibold mb-4">{t("tagline")}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-content leading-tight">
                {t("title")}
              </h1>
              <p className="mt-6 text-lg text-content-soft max-w-xl">
                {t("subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/book">
                  <Button size="lg" className="gap-2">
                    <Calendar className="w-5 h-5" />
                    {t("bookAppointment")}
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg">
                    {t("viewServices")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-lg mx-auto rounded-3xl glass p-8 flex items-center justify-center">
                <Stethoscope className="w-48 h-48 text-primary/30" />
                <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 shadow-xl rtl:right-auto rtl:left-[-1rem]">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm font-medium mt-1">{t("happyPatients")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-content">{t("whyChooseUs")}</h2>
            <p className="mt-4 text-content-soft max-w-2xl mx-auto">
              {t("whySubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, titleKey: "experiencedTeam", descKey: "experiencedDesc" },
              { icon: Sparkles, titleKey: "modernTech", descKey: "modernTechDesc" },
              { icon: Users, titleKey: "familyCare", descKey: "familyCareDesc" },
            ].map(({ icon: Icon, titleKey, descKey }) => (
              <div key={titleKey} className="glass rounded-2xl p-8 hover:shadow-8k-xl transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-content">{t(titleKey)}</h3>
                <p className="mt-2 text-content-soft">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">{t("ctaTitle")}</h2>
          <p className="mt-4 text-cyan-100">{t("ctaSubtitle")}</p>
          <Link href="/book" className="inline-block mt-8">
            <Button variant="secondary" size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              {t("bookNow")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-content text-cyan-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-8 h-8 text-primary-light" />
                <span className="font-bold text-white">{t("clinicName")}</span>
              </div>
              <p className="text-sm text-cyan-100/90">{t("clinicDesc")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">{t("quickLinks")}</h4>
              <ul className="space-y-2">
                <li><Link href="/services" className="hover:text-white transition-colors">{tNav("services")}</Link></li>
                <li><Link href="/doctors" className="hover:text-white transition-colors">{tNav("doctors")}</Link></li>
                <li><Link href="/book" className="hover:text-white transition-colors">{tNav("book")}</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">{tNav("contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contact</h4>
              <p>+20 123 456 789</p>
              <a href="https://wa.me/20123456789" className="text-green-300 hover:text-white transition-colors">WhatsApp</a>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">{t("emergency")}</h4>
              <a href="tel:+20123456789" className="text-primary-light hover:text-white font-medium transition-colors">{t("callNow")}</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-cyan-200/30 text-center text-sm text-cyan-100/80">
            © {new Date().getFullYear()} {t("clinicName")}. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
