"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Shield } from "lucide-react";

interface InsuranceCompany {
  id: string;
  nameEn: string;
  nameAr?: string | null;
  isActive: boolean;
}

export default function InsuranceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [company, setCompany] = useState<InsuranceCompany | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<InsuranceCompany>(`/api/insurance/${params.id}`)
      .then(setCompany)
      .catch(() => router.push("/admin/insurance"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading || !company) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link href="/admin/insurance" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t("backToInsurance")}
        </Link>
        <Link href={`/admin/insurance/${company.id}/edit`}>
          <Button variant="outline" size="sm">{t("edit")}</Button>
        </Link>
      </div>
      <div className="glass rounded-2xl p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content">{company.nameEn}</h1>
            {company.nameAr && <p className="text-content-soft mt-1">{company.nameAr}</p>}
          </div>
        </div>
        <dl className="space-y-3">
          <div>
            <dt className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("status")}</dt>
            <dd>
              <span className={`inline-block mt-1 px-2 py-1 rounded-lg text-xs font-medium ${company.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                {company.isActive ? t("active") : t("inactive")}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
