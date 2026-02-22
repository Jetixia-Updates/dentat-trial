"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await api("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      setSent(true);
      (form as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-content text-center">{t("title")}</h1>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("address")}</h3>
                <p>{t("addressValue")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("phone")}</h3>
                <a href="tel:+20123456789" className="text-primary hover:underline">
                  +20 123 456 789
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t("email")}</h3>
                <a href="mailto:info@dental.com" className="text-primary hover:underline">
                  info@dental.com
                </a>
              </div>
            </div>
            <a
              href="https://wa.me/20123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="font-semibold text-lg mb-4">{t("sendMessage")}</h3>
            {sent ? (
              <div className="rounded-xl bg-green-50 text-green-700 px-4 py-3">{t("sent")}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
                )}
                <input
                  name="name"
                  required
                  type="text"
                  placeholder={t("yourName")}
                  className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
                />
                <input
                  name="email"
                  required
                  type="email"
                  placeholder={t("email")}
                  className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
                />
                <textarea
                  name="message"
                  required
                  placeholder={t("message")}
                  rows={4}
                  className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-3 focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("sending") : t("send")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
