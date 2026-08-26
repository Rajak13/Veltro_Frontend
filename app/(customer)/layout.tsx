"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CustomerSidebar from "@/components/layout/CustomerSidebar";
import Spinner from "@/components/ui/Spinner";
import NotificationBell from "@/components/ui/NotificationBell";
import { ROLES } from "@/constants/roles";

import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Cog } from "lucide-react";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || role !== ROLES.CUSTOMER) router.replace("/login");
  }, [hydrated, isAuthenticated, role, router]);

  if (!hydrated || !isAuthenticated || role !== ROLES.CUSTOMER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <CustomerSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="h-14 min-h-14 bg-white border-b border-zinc-200 flex items-center px-4 sm:px-5 justify-between gap-3 z-30 flex-shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center shadow-sm">
              <Cog className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-900 tracking-tight">Veltro</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="w-7 h-7 rounded-md overflow-hidden border border-zinc-200 cursor-pointer bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
              {user?.name?.charAt(0).toUpperCase() ?? "C"}
            </div>
          </div>
        </header>

        {/* Scrollable content with dot grid */}
        <main
          className="flex-1 overflow-y-auto pb-20 md:pb-6"
          style={{
            backgroundImage: "radial-gradient(circle, #d4d4d8 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
