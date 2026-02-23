"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Stethoscope, Shield, UserCircle, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

const DEMO_CREDENTIALS = [
  { email: "demo@dental.com", password: "Demo@123", path: "/admin", icon: Shield },
  { email: "doctor@dental.com", password: "Demo@123", path: "/doctor", icon: UserCircle },
  { email: "patient@dental.com", password: "Demo@123", path: "/patient", icon: Users },
  { email: "reception@dental.com", password: "Demo@123", path: "/reception", icon: ClipboardList },
] as const;

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-xl border border-white/60">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-content">Dental Clinic</span>
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
                className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-4 py-3 placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="demo@dental.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-4 py-3 placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-cyan-100">
            <p className="text-sm font-medium text-content-soft mb-3">{t("quickAccess")}</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map(({ email: e, password: p, path, icon: Icon }) => (
                <Button
                  key={path}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center gap-2"
                  disabled={loading}
                  onClick={async () => {
                    setError("");
                    setLoading(true);
                    try {
                      const res = await api<{ accessToken: string; user: { role: string } }>("/api/auth/login", {
                        method: "POST",
                        body: JSON.stringify({ email: e, password: p }),
                      });
                      if (typeof window !== "undefined") {
                        localStorage.setItem("token", res.accessToken);
                        localStorage.setItem("user", JSON.stringify(res.user));
                      }
                      router.push(path);
                    } catch (err: unknown) {
                      setError(err instanceof Error ? err.message : "Login failed");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {path === "/admin" && t("adminPanel")}
                  {path === "/doctor" && t("doctorPanel")}
                  {path === "/patient" && t("patientPanel")}
                  {path === "/reception" && t("receptionPanel")}
                </Button>
              ))}
            </div>
          </div>
          <Link href="/" className="block mt-6 text-center text-primary hover:underline text-sm font-medium">
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
