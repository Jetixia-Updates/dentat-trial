"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const navItems = [
  { href: "/", labelKey: "home" as const },
  { href: "/services", labelKey: "services" as const },
  { href: "/doctors", labelKey: "doctors" as const },
  { href: "/branches", labelKey: "branches" as const },
  { href: "/insurance", labelKey: "insurance" as const },
  { href: "/book", labelKey: "book" as const },
  { href: "/contact", labelKey: "contact" as const },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16 md:h-18">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-content hidden sm:inline">Dental Clinic</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-xl text-content-soft hover:bg-primary/5 hover:text-primary font-medium transition-colors"
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AuthButtons />
          <button
            type="button"
            className="md:hidden p-2 rounded-xl hover:bg-primary/10"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-cyan-100 p-4 space-y-1">
          {navItems.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className="block px-4 py-3 rounded-xl text-content-soft hover:bg-primary/5 font-medium"
              onClick={() => setOpen(false)}
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
