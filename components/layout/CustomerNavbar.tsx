"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, Bell, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { label: "Home",         href: ROUTES.CUSTOMER_DASHBOARD },
  { label: "Appointments", href: ROUTES.CUSTOMER_APPOINTMENTS },
  { label: "Part Requests",href: ROUTES.CUSTOMER_PART_REQUESTS },
  { label: "History",      href: ROUTES.CUSTOMER_HISTORY },
  { label: "Reviews",      href: ROUTES.CUSTOMER_REVIEWS },
];

export default function CustomerNavbar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={ROUTES.CUSTOMER_DASHBOARD} className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
            <Cog className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">Veltro</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-orange-50 text-orange-600"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.CUSTOMER_PROFILE}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            <User className="w-4 h-4" />
            {user?.name?.split(" ")[0]}
          </Link>
          <button
            onClick={logout}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-orange-50 text-orange-600"
                  : "text-zinc-600 hover:bg-zinc-50"
              )}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 mt-1"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
