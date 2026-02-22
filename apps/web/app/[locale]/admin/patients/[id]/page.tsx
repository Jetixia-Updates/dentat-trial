"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Patient>(`/api/patients/${params.id}`)
      .then(setPatient)
      .catch(() => router.push("/admin/patients"))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading || !patient) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div>
      <Link href="/admin/patients" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        {patient.firstName} {patient.lastName}
      </h1>
      <div className="glass rounded-2xl p-8 max-w-xl space-y-4">
        <div>
          <span className="text-slate-500 text-sm">Phone</span>
          <p className="font-medium">{patient.phone}</p>
        </div>
        <div>
          <span className="text-slate-500 text-sm">Email</span>
          <p className="font-medium">{patient.email || "—"}</p>
        </div>
        <div>
          <span className="text-slate-500 text-sm">Address</span>
          <p className="font-medium">{patient.address || "—"}</p>
        </div>
        <Link href={`/admin/appointments/new?patientId=${patient.id}`}>
          <Button variant="outline">Book Appointment</Button>
        </Link>
      </div>
    </div>
  );
}
