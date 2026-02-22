"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>
      <div className="glass rounded-2xl p-8 max-w-xl">
        <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Clinic Settings
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Clinic Name</label>
            <input
              type="text"
              defaultValue="Dental Clinic"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+20 123 456 789"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue="info@dental.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-primary dark:bg-slate-800"
            />
          </div>
          <Button type="submit">{saved ? "Saved!" : "Save Changes"}</Button>
        </form>
      </div>
    </div>
  );
}
