"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Menu, Phone, MessageCircle, Stethoscope } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/cn";

const navPaths = [
  { href: "/", labelKey: "home" },
  { href: "/about", labelKey: "about" },
  { href: "/services", labelKey: "services" },
  { href: "/doctors", labelKey: "doctors" },
  { href: "/book", labelKey: "book" },
  { href: "/contact", labelKey: "contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-content">
              Dental Clinic
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navPaths.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === href || (href !== "/" && pathname.startsWith(href))
                    ? "text-primary"
                    : "text-content-soft"
                )}
              >
                {t(labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="tel:+20123456789"
              className="hidden sm:flex items-center gap-2 text-sm text-content-soft hover:text-primary"
            >
              <Phone className="w-4 h-4" />
              <span>+20 123 456 789</span>
            </a>
            <a
              href="https://wa.me/20123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
}
