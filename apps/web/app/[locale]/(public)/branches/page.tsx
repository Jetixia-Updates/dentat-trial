"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { api } from "@/lib/api";

interface Branch {
  id: string;
  name: string;
  nameAr?: string | null;
  address: string;
  city: string;
  phone: string;
}

export default function BranchesPage() {
  const t = useTranslations("branches");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Branch[]>("/api/branches")
      .then(setBranches)
      .catch(() => setBranches([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-content text-center">{t("title")}</h1>
        <p className="mt-4 text-content-soft text-center">{t("subtitle")}</p>
        {loading ? (
          <p className="text-center text-content-muted py-12">{t("loading")}</p>
        ) : branches.length === 0 ? (
          <p className="text-center text-content-muted py-12">{t("noBranches")}</p>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {branches.map((b) => (
              <div key={b.id} className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{b.name}</h3>
                    {b.nameAr && <p className="text-content-muted text-sm">{b.nameAr}</p>}
                    <p className="text-content-soft mt-2">{b.address}</p>
                    <p className="text-content-soft mt-1">{b.city}</p>
                    <a href={`tel:${b.phone}`} className="text-primary mt-2 inline-block hover:underline">
                      {b.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
