"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function LoginPage() {
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api<{ accessToken: string; user: { role: string } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      const role = res.user.role;
      if (role === "ADMIN") router.push("/admin");
      else if (role === "DOCTOR") router.push("/doctor");
      else if (role === "RECEPTION") router.push("/reception");
      else if (role === "PATIENT") router.push("/patient");
      else router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-soft p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-xl">Dental Clinic</span>
            </Link>
            <h1 className="text-2xl font-bold text-content">{t("title")}</h1>
            <p className="text-content-soft mt-1">{t("subtitle")}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="admin@dental.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-content-muted">{t("demo")}</p>
          <Link href="/" className="block mt-4 text-center text-primary hover:underline text-sm">
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
