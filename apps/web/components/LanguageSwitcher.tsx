"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale() {
    const next = locale === "en" ? "ar" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-content-soft hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
      title={locale === "en" ? "العربية" : "English"}
    >
      <Languages className="w-4 h-4" />
      <span>{locale === "en" ? "العربية" : "English"}</span>
    </button>
  );
}
