"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { api } from "@/lib/api";

interface Doctor {
  id: string;
  specialty: string;
  user: { firstName: string; lastName: string; avatar?: string | null };
}

export default function DoctorsPage() {
  const t = useTranslations("doctors");
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    api<Doctor[]>("/api/doctors")
      .then(setDoctors)
      .catch(() => setDoctors([]));
  }, []);

  return (
    <main className="pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-content text-center">{t("title")}</h1>
        <p className="mt-4 text-content-soft text-center">{t("subtitle")}</p>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length === 0 ? (
            <p className="col-span-full text-center text-content-muted py-12">{t("noDoctors")}</p>
          ) : (
            doctors.map((d) => (
              <div key={d.id} className="glass rounded-2xl p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">
                  Dr. {d.user.firstName} {d.user.lastName}
                </h3>
                <p className="text-primary text-sm mt-1">{d.specialty}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
