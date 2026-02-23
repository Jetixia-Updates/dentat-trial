"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Bill {
  id: string;
  patientId: string;
  appointmentId?: string | null;
  total: number;
  status: string;
  paidAt?: string | null;
  createdAt: string;
  patient?: { firstName: string; lastName: string; phone?: string };
}

export default function BillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("admin");
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api<Bill>(`/api/billing/${params.id}`)
      .then(setBill)
      .catch(() => router.push("/admin/billing"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function updateStatus(status: string) {
    if (!bill) return;
    setUpdating(true);
    try {
      await api(`/api/billing/${bill.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setBill((prev) => prev ? { ...prev, status, paidAt: status === "PAID" ? new Date().toISOString() : null } : null);
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !bill) {
    return <div className="p-8 text-content-soft">{t("loading")}</div>;
  }

  return (
    <div>
      <Link href="/admin/billing" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        {t("backToBilling")}
      </Link>
      <h1 className="text-3xl font-bold text-content mb-8">{t("billDetail")}</h1>

      <div className="glass rounded-2xl p-6 max-w-xl space-y-4">
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("patient")}</span>
          <p className="font-medium text-content mt-1">
            {bill.patient ? `${bill.patient.firstName} ${bill.patient.lastName}` : bill.patientId}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("amount")}</span>
          <p className="font-medium text-content mt-1">EGP {bill.total.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("status")}</span>
          <p className="mt-1">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
              bill.status === "PAID" ? "bg-green-100 text-green-700" :
              bill.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
            }`}>
              {bill.status}
            </span>
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("createdAt")}</span>
          <p className="text-content-soft text-sm mt-1">{new Date(bill.createdAt).toLocaleString()}</p>
        </div>
        {bill.paidAt && (
          <div>
            <span className="text-xs font-medium text-content-muted uppercase tracking-wide">{t("paidAt")}</span>
            <p className="text-content-soft text-sm mt-1">{new Date(bill.paidAt).toLocaleString()}</p>
          </div>
        )}

        {bill.status === "PENDING" && (
          <div className="pt-4 flex gap-2">
            <Button onClick={() => updateStatus("PAID")} disabled={updating}>{t("markPaid")}</Button>
            <Button variant="outline" onClick={() => updateStatus("CANCELLED")} disabled={updating}>{t("cancelled")}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
