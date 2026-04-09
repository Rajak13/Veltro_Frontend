"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CustomerSidebar from "@/components/layout/CustomerSidebar";
import Spinner from "@/components/ui/Spinner";
import { ROLES } from "@/constants/roles";
import { Bell } from "lucide-react";

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
        <header className="h-14 min-h-14 bg-white border-b border-zinc-200 flex items-center px-5 gap-3 z-30">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-md border-[1.5px] border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:border-zinc-300 transition-all relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full border-[1.5px] border-white" />
            </button>
            <div className="w-7 h-7 rounded-md overflow-hidden border border-zinc-200 cursor-pointer bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
              {user?.name?.charAt(0).toUpperCase() ?? "C"}
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
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
