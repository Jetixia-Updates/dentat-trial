"use client";

import { useTranslations } from "next-intl";
import { FileText, AlertTriangle, Calendar } from "lucide-react";

export default function PatientMedicalPage() {
  const t = useTranslations("patient");

  return (
    <div>
      <h1 className="text-3xl font-bold text-content mb-8">{t("medicalHistory")}</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-semibold text-lg">Treatments</h2>
          </div>
          <p className="text-content-soft text-sm">Fillings, cleanings, root canals, and other procedures will appear here.</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="font-semibold text-lg">Allergies</h2>
          </div>
          <p className="text-content-soft text-sm">Record any allergies or medications. Update via reception.</p>
        </div>
      </div>
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="font-semibold text-lg">Recent Visits</h2>
        </div>
        <div className="rounded-xl border border-cyan-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-muted">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Date</th>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Doctor</th>
                <th className="text-left px-6 py-4 font-medium text-content-soft">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-content-muted">
                  No visits recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
