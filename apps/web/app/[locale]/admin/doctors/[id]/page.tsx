"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin } from "lucide-react";

interface Doctor {
  id: string;
  specialty: string;
  specialtyAr?: string | null;
  isActive: boolean;
  user: { firstName: string; lastName: string; avatar?: string | null; phone?: string | null };
  branches: { branch: { id: string; name: string; address?: string } }[];
}

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Doctor>(`/api/doctors/${params.id}`)
      .then(setDoctor)
      .catch(() => router.push("/admin/doctors"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading || !doctor) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link href="/admin/doctors" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t("backToDoctors")}
        </Link>
        <Link href={`/admin/doctors/${doctor.id}/edit`}>
          <Button variant="outline" size="sm">{t("edit")}</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-content mb-2">
        Dr. {doctor.user.firstName} {doctor.user.lastName}
      </h1>
      <p className="text-content-soft mb-8">{doctor.specialty}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4">{t("doctorDetail")}</h2>
          <dl className="space-y-3 text-content-soft">
            <div>
              <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("specialty")}</dt>
              <dd className="font-medium text-content">{doctor.specialty}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("status")}</dt>
              <dd>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${doctor.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {doctor.isActive ? t("active") : t("inactive")}
                </span>
              </dd>
            </div>
            {doctor.user.phone && (
              <div>
                <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("phone")}</dt>
                <dd className="font-medium text-content">{doctor.user.phone}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-lg text-content mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t("branches")}
          </h2>
          {doctor.branches.length === 0 ? (
            <p className="text-content-soft text-sm">—</p>
          ) : (
            <ul className="space-y-2">
              {doctor.branches.map(({ branch }) => (
                <li key={branch.id} className="text-content">
                  <span className="font-medium">{branch.name}</span>
                  {branch.address && <p className="text-content-soft text-sm">{branch.address}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
