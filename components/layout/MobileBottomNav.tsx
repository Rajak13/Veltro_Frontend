"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Search, CalendarCheck, Receipt,
  Users, Package, BarChart3, Calendar, Truck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { role } = useAuth();

  const customerNav = [
    { label: "Dash", href: ROUTES.CUSTOMER_DASHBOARD, icon: LayoutDashboard },
    { label: "Vehicle", href: ROUTES.CUSTOMER_PROFILE, icon: Car },
    { label: "Parts", href: ROUTES.CUSTOMER_PART_REQUESTS, icon: Search },
    { label: "Bookings", href: ROUTES.CUSTOMER_APPOINTMENTS, icon: CalendarCheck },
    { label: "History", href: ROUTES.CUSTOMER_HISTORY, icon: Receipt },
  ];

  const staffNav = [
    { label: "Dash", href: ROUTES.STAFF_DASHBOARD, icon: LayoutDashboard },
    { label: "Bookings", href: ROUTES.STAFF_APPOINTMENTS, icon: Calendar },
    { label: "Requests", href: ROUTES.STAFF_PART_REQUESTS, icon: Package },
    { label: "Sales", href: ROUTES.STAFF_SALES_INVOICES, icon: Receipt },
    { label: "Reports", href: ROUTES.STAFF_REPORTS, icon: BarChart3 },
  ];

  const adminNav = [
    { label: "Dash", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { label: "Parts", href: ROUTES.ADMIN_PARTS, icon: Package },
    { label: "Customers", href: ROUTES.ADMIN_CUSTOMERS, icon: Users },
    { label: "Purchases", href: ROUTES.ADMIN_PURCHASE_INVOICES, icon: Truck },
    { label: "Finance", href: ROUTES.ADMIN_FINANCIAL_REPORTS, icon: BarChart3 },
  ];

  const navItems =
    role === ROLES.CUSTOMER
      ? customerNav
      : role === ROLES.STAFF
      ? staffNav
      : role === ROLES.ADMIN
      ? adminNav
      : [];

  if (navItems.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden px-2 py-1.5 flex items-center justify-around safe-area-pb">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/dashboard" &&
            href !== "/customer/dashboard" &&
            href !== "/staff-dashboard" &&
            pathname.startsWith(href.split("?")[0]));

        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer select-none min-w-[54px] ${
              isActive
                ? "text-orange-600 font-bold"
                : "text-zinc-400 hover:text-zinc-700 font-medium"
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-transform ${
                isActive ? "bg-orange-50 scale-110" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-mono truncate max-w-[62px]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
