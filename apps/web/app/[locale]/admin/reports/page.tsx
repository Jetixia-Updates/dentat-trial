import { BarChart3, DollarSign, Users } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Reports</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Daily Revenue", value: "—", icon: DollarSign },
          { label: "Monthly Patients", value: "—", icon: Users },
          { label: "Appointments", value: "—", icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-2xl p-6">
            <Icon className="w-10 h-10 text-primary/50 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-sm">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-8">
        <h2 className="font-semibold text-lg mb-4">Reports</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Reports will show revenue, patient count, and doctor performance. Connect to database for live data.
        </p>
      </div>
    </div>
  );
}
