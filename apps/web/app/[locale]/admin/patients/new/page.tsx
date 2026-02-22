"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api("/api/patients", {
        method: "POST",
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          phone: data.get("phone"),
          email: data.get("email") || undefined,
          address: data.get("address") || undefined,
        }),
      });
      router.push("/admin/patients");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create patient");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link href="/admin/patients" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Add Patient</h1>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 max-w-xl space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input name="firstName" required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input name="lastName" required className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input name="phone" required type="tel" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input name="email" type="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input name="address" className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800" />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Patient"}</Button>
      </form>
    </div>
  );
}
