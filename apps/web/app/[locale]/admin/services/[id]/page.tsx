"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Service {
  id: string;
  name: string;
  nameAr?: string | null;
  department: string;
  price?: number | null;
  duration?: number | null;
  isActive: boolean;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Service>(`/api/services/${params.id}`)
      .then(setService)
      .catch(() => router.push("/admin/services"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading || !service) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  const departmentLabel = (d: string) => {
    const out = (t as (k: string) => string)(`department_${d}`);
    return out && !out.startsWith("department_") ? out : d.replace(/_/g, " ");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t("backToServices")}
        </Link>
        <Link href={`/admin/services/${service.id}/edit`}>
          <Button variant="outline" size="sm">{t("edit")}</Button>
        </Link>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-content">{service.name}</h1>
          {service.nameAr && <p className="text-content-soft mt-1">{service.nameAr}</p>}
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${service.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
          {service.isActive ? t("active") : t("inactive")}
        </span>
      </div>

      <div className="glass rounded-2xl p-6 max-w-xl space-y-4">
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("department")}</span>
          <p className="font-medium text-content mt-1">{departmentLabel(service.department)}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("price")}</span>
          <p className="font-medium text-content mt-1">{service.price != null ? `EGP ${service.price}` : "—"}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("duration")}</span>
          <p className="font-medium text-content mt-1">{service.duration != null ? `${service.duration} min` : "—"}</p>
        </div>
      </div>
    </div>
  );
}
