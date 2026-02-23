"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, MapPin, Phone } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  nameAr?: string | null;
  address: string;
  addressAr?: string | null;
  city?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  isActive: boolean;
}

export default function BranchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Branch>(`/api/branches/${params.id}`)
      .then(setBranch)
      .catch(() => router.push("/admin/branches"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading || !branch) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link href="/admin/branches" className="inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          {t("backToBranches")}
        </Link>
        <Link href={`/admin/branches/${branch.id}/edit`}>
          <Button variant="outline" size="sm">{t("edit")}</Button>
        </Link>
      </div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-content">{branch.name}</h1>
          {branch.nameAr && <p className="text-content-soft mt-1">{branch.nameAr}</p>}
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${branch.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
          {branch.isActive ? t("active") : t("inactive")}
        </span>
      </div>

      <div className="glass rounded-2xl p-6 max-w-xl space-y-4">
        <h2 className="font-semibold text-lg text-content mb-4">{t("branchDetail")}</h2>
        <p className="flex items-center gap-2 text-content">
          <MapPin className="w-5 h-5 text-primary shrink-0" />
          {branch.address}
        </p>
        {branch.phone && (
          <p className="flex items-center gap-2 text-content">
            <Phone className="w-5 h-5 text-primary shrink-0" />
            {branch.phone}
          </p>
        )}
        {branch.city && <p className="text-content-soft">{t("branchAddress")}: {branch.city}</p>}
        {branch.whatsapp && <p className="text-content-soft text-sm">WhatsApp: {branch.whatsapp}</p>}
      </div>
    </div>
  );
}
