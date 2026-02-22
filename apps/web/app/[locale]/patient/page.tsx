import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Calendar, FileText } from "lucide-react";

export default function PatientDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Welcome</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/patient/appointments" className="glass rounded-2xl p-6 hover:shadow-xl transition-shadow block">
          <Calendar className="w-12 h-12 text-primary/50 mb-4" />
          <h3 className="font-semibold text-lg">My Appointments</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">View and manage your appointments</p>
        </Link>
        <Link href="/patient/medical" className="glass rounded-2xl p-6 hover:shadow-xl transition-shadow block">
          <FileText className="w-12 h-12 text-primary/50 mb-4" />
          <h3 className="font-semibold text-lg">Medical History</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">View your dental records</p>
        </Link>
      </div>
      <Link href="/book">
        <Button size="lg" className="gap-2">
          <Calendar className="w-5 h-5" />
          Book New Appointment
        </Button>
      </Link>
    </div>
  );
}
