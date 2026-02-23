"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Stethoscope, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-content text-white mt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-8 h-8 text-cyan-300" />
              <span className="font-bold text-xl">Dental Clinic</span>
            </Link>
            <p className="text-cyan-100/90 text-sm">{t("tagline")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-cyan-100/90 text-sm">
              <li><Link href="/services" className="hover:text-white transition-colors">{t("services")}</Link></li>
              <li><Link href="/doctors" className="hover:text-white transition-colors">{t("doctors")}</Link></li>
              <li><Link href="/branches" className="hover:text-white transition-colors">{t("branches")}</Link></li>
              <li><Link href="/insurance" className="hover:text-white transition-colors">{t("insurance")}</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">{t("book")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-3 text-cyan-100/90 text-sm">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +20 123 456 7890</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@dentalclinic.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t("address")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("workingHours")}</h4>
            <p className="text-cyan-100/90 text-sm">{t("hours")}</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-cyan-500/30 text-center text-cyan-100/80 text-sm">
          © {new Date().getFullYear()} Dental Clinic. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
