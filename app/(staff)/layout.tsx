"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import StaffSidebar from "@/components/layout/StaffSidebar";
import Spinner from "@/components/ui/Spinner";
import NotificationBell from "@/components/ui/NotificationBell";
import { ROLES } from "@/constants/roles";
import { Search } from "lucide-react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || role !== ROLES.STAFF) router.replace("/login");
  }, [hydrated, isAuthenticated, role, router]);

  if (!hydrated || !isAuthenticated || role !== ROLES.STAFF) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <StaffSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="h-14 min-h-14 bg-white border-b border-zinc-200 flex items-center px-5 gap-3 z-30 lg:px-5 pl-16 lg:pl-5">
          <div className="flex items-center gap-2 bg-zinc-100 border-[1.5px] border-transparent focus-within:bg-white focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_rgba(249,115,22,0.07)] rounded-lg px-2.5 py-1.5 transition-all flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, phone, vehicle no., or ID..."
              className="bg-transparent border-none outline-none text-[13px] text-zinc-800 placeholder:text-zinc-400 w-full"
            />
            <span className="text-[10px] text-zinc-300 bg-white border border-zinc-200 rounded px-1 py-0.5 font-mono hidden sm:block">⌘K</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <NotificationBell />
            <div className="w-7 h-7 rounded-md overflow-hidden border border-zinc-200 ml-1 cursor-pointer bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
              {user?.name?.charAt(0).toUpperCase() ?? "S"}
            </div>
          </div>
        </header>

        {/* Scrollable content with dot grid */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            backgroundImage: "radial-gradient(circle, #d4d4d8 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
