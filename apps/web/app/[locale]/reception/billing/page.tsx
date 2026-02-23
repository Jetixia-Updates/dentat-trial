"use client";

import { useTranslations } from "next-intl";
import { Receipt, CreditCard, Plus, FileText } from "lucide-react";

export default function ReceptionBillingPage() {
  const t = useTranslations("reception");

  return (
    <div>
      <h1 className="text-3xl font-bold text-content mb-8">{t("billing")}</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Pending Invoices", value: "0", icon: Receipt },
          { label: "Paid Today", value: "—", icon: CreditCard },
          { label: "Monthly Revenue", value: "—", icon: FileText },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-2xl p-6">
            <Icon className="w-10 h-10 text-primary/50 mb-4" />
            <p className="text-content-soft text-sm">{label}</p>
            <p className="text-2xl font-bold text-content mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Invoices
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
        <div className="rounded-xl border border-cyan-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Invoice #</th>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Patient</th>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Amount</th>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-content-muted">
                  No invoices yet. Create invoices from patient records.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
