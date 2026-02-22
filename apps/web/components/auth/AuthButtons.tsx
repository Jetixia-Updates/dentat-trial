"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export function AuthButtons() {
  const t = useTranslations("nav");
  const [user, setUser] = useState<{ role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  function getDashboardHref() {
    if (!user?.role) return "/admin";
    switch (user.role) {
      case "ADMIN": return "/admin";
      case "DOCTOR": return "/doctor";
      case "RECEPTION": return "/reception";
      case "PATIENT": return "/patient";
      default: return "/admin";
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href={getDashboardHref()}>
          <Button variant="outline" size="sm" className="gap-1">
            <LayoutDashboard className="w-4 h-4" />
            {t("dashboard")}
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button size="sm">{t("login")}</Button>
    </Link>
  );
}
