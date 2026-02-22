"use client";

import { useTranslations } from "next-intl";
import { Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-content">{t("title")}</h1>
        <p className="mt-6 text-lg text-content-soft">{t("subtitle")}</p>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Target, titleKey: "mission", descKey: "missionDesc" },
            { icon: Eye, titleKey: "vision", descKey: "visionDesc" },
            { icon: Heart, titleKey: "values", descKey: "valuesDesc" },
          ].map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="glass rounded-2xl p-6">
              <Icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold text-lg">{t(titleKey)}</h3>
              <p className="text-content-soft mt-2">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
