"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { Plus, CreditCard } from "lucide-react";

interface Bill {
  id: string;
  patientId: string;
  appointmentId?: string | null;
  total: number;
  status: string;
  paidAt?: string | null;
  createdAt: string;
  patient?: { firstName: string; lastName: string; phone?: string };
  appointment?: unknown;
}

function AdminBillingContent() {
  const t = useTranslations("admin");
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "";
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (patientId) params.set("patientId", patientId);
    const q = params.toString() ? `?${params.toString()}` : "";
    api<{ bills: Bill[] }>(`/api/billing${q}`)
      .then((r) => setBills(r.bills))
      .catch(() => setBills([]))
      .finally(() => setLoading(false));
  }, [statusFilter, patientId]);

  async function updateStatus(id: string, status: string) {
    try {
      await api(`/api/billing/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setBills((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    } catch {
      // keep UI as is
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-content">{patientId ? t("goToBilling") : t("billing")}</h1>
        <div className="flex gap-3 items-center flex-wrap">
          {patientId ? (
            <Link href={`/admin/billing?patientId=${patientId}`} className="text-sm text-content-soft hover:underline">
              {t("view")} {t("billing")}
            </Link>
          ) : null}
          <Link href={patientId ? `/admin/billing/new?patientId=${patientId}` : "/admin/billing/new"}>
            <Button className="gap-2">
              <Plus className="w-5 h-5" />
              {patientId ? t("newBillForPatient") : t("newBill")}
            </Button>
          </Link>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white text-content px-4 py-2 focus:ring-2 focus:ring-primary"
          >
            <option value="">{t("allStatuses")}</option>
            <option value="PENDING">{t("pending")}</option>
            <option value="PAID">{t("paid")}</option>
            <option value="CANCELLED">{t("cancelled")}</option>
          </select>
        </div>
      </div>
      {patientId ? (
        <p className="mb-4 text-sm text-content-soft">
          {t("filterByPatient")}: <Link href={`/admin/patients/${patientId}`} className="text-primary font-medium hover:underline">{t("view")}</Link>
          {" · "}
          <Link href="/admin/billing" className="text-primary hover:underline">{t("billing")}</Link>
        </p>
      ) : null}
      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-content-soft">{t("loading")}</div>
        ) : bills.length === 0 ? (
          <div className="p-12 text-center text-content-soft flex flex-col items-center gap-4">
            <CreditCard className="w-12 h-12 text-content-muted" />
            <p>{t("noBills")}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content">{t("patient")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("total")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("status")}</th>
                <th className="text-left px-6 py-4 font-medium text-content">{t("date")}</th>
                <th className="text-right px-6 py-4 font-medium text-content">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-6 py-4 font-medium text-content">
                    {b.patient ? `${b.patient.firstName} ${b.patient.lastName}` : b.patientId}
                  </td>
                  <td className="px-6 py-4 text-content-soft">EGP {b.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        b.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : b.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-content-soft text-sm">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/billing/${b.id}`} className="mr-2 inline-block">
                      <Button variant="ghost" size="sm">{t("view")}</Button>
                    </Link>
                    {b.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(b.id, "PAID")}
                      >
                        {t("markPaid")}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminBillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-content-soft">Loading...</div>}>
      <AdminBillingContent />
    </Suspense>
  );
}
