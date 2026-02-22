"use client";

import { useRouter } from "@/i18n/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ children }: { children?: React.ReactNode }) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-content-soft hover:bg-surface-muted w-full text-left"
    >
      <LogOut className="w-5 h-5" />
      {children || "Logout"}
    </button>
  );
}
