"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

interface Branch {
  id: string;
  name: string;
  address: string;
}

interface Doctor {
  id: string;
  specialty: string;
  user: { firstName: string; lastName: string };
}

export default function BookPage() {
  const t = useTranslations("book");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([
      api<Branch[]>("/api/branches"),
      api<Doctor[]>("/api/doctors"),
    ])
      .then(([b, d]) => {
        setBranches(b);
        setDoctors(d);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const branchId = data.get("branchId");
    const doctorId = data.get("doctorId");
    if (!branchId || !doctorId) {
      setLoading(false);
      return;
    }
    try {
      await api<{ success: boolean }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email") || undefined,
          branchId: String(branchId),
          doctorId: String(doctorId),
          date: data.get("date"),
        }),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="pt-24 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center glass rounded-2xl p-12 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-primary">{t("successTitle")}</h2>
          <p className="mt-4 text-content-soft">{t("successMsg")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-content text-center">{t("title")}</h1>
        <form onSubmit={handleSubmit} className="mt-12 glass rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t("name")}</label>
            <input
              name="name"
              required
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
              placeholder={t("name")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("phone")}</label>
            <input
              name="phone"
              required
              type="tel"
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
              placeholder="+20 123 456 789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("email")}</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("branch")}</label>
            <select
              name="branchId"
              required
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("selectBranch")}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} – {b.address}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("doctor")}</label>
            <select
              name="doctorId"
              required
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("selectDoctor")}</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.user.firstName} {d.user.lastName} – {d.specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("preferredDate")}</label>
            <input
              name="date"
              type="date"
              required
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("sending") : t("requestAppointment")}
          </Button>
        </form>
      </div>
    </main>
  );
}
