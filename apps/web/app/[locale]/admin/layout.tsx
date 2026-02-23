"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  Stethoscope,
  MapPin,
  Briefcase,
  CreditCard,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navPaths = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/patients", labelKey: "patients", icon: Users },
  { href: "/admin/appointments", labelKey: "appointments", icon: Calendar },
  { href: "/admin/doctors", labelKey: "doctors", icon: Stethoscope },
  { href: "/admin/branches", labelKey: "branches", icon: MapPin },
  { href: "/admin/services", labelKey: "pricing", icon: Briefcase },
  { href: "/admin/billing", labelKey: "billing", icon: CreditCard },
  { href: "/admin/reports", labelKey: "reports", icon: FileText },
  { href: "/admin/insurance", labelKey: "insurance", icon: Shield },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("admin");

  return (
    <div className="min-h-screen flex bg-surface-soft">
      <aside className="w-64 glass border-r border-cyan-100 flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="font-bold text-xl text-primary">{t("title")}</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navPaths.map(({ href, labelKey, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
                pathname === href || (href !== "/admin" && pathname.startsWith(href))
                  ? "bg-primary text-white"
                  : "text-content-soft hover:bg-surface-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              {t(labelKey)}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
