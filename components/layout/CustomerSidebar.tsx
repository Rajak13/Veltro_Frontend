"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Wrench, Search, ShoppingBag, PackagePlus,
  CalendarPlus, CalendarCheck, Star, User, Gift, Bell, Cog, LogOut, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";

interface NavGroup {
  label: string;
  id: string;
  icon: React.ElementType;
  children: { label: string; href: string }[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navGroups: NavGroup[] = [
  {
    label: "Service History", id: "svc", icon: Wrench,
    children: [
      { label: "Completed Services", href: ROUTES.CUSTOMER_HISTORY + "?tab=services" },
      { label: "Service Reports",    href: ROUTES.CUSTOMER_HISTORY + "?tab=services" },
    ],
  },
];

const singleItems: NavItem[] = [
  { label: "Dashboard",              href: ROUTES.CUSTOMER_DASHBOARD,    icon: LayoutDashboard },
  { label: "Vehicle Details",        href: ROUTES.CUSTOMER_PROFILE,      icon: Car },
  { label: "Browse Parts",           href: ROUTES.CUSTOMER_PART_REQUESTS, icon: Search },
  { label: "Purchase History",       href: ROUTES.CUSTOMER_HISTORY,      icon: ShoppingBag },
  { label: "Request Unavailable Part", href: ROUTES.CUSTOMER_PART_REQUESTS, icon: PackagePlus },
  { label: "Book Appointment",       href: ROUTES.CUSTOMER_APPOINTMENTS, icon: CalendarPlus },
  { label: "My Appointments",        href: ROUTES.CUSTOMER_APPOINTMENTS, icon: CalendarCheck, badge: 1 },
  { label: "Submit Review",          href: ROUTES.CUSTOMER_REVIEWS,      icon: Star },
  { label: "My Profile",             href: ROUTES.CUSTOMER_PROFILE,      icon: User },
  { label: "Loyalty Rewards",        href: ROUTES.CUSTOMER_PROFILE,      icon: Gift },
  { label: "Notifications",          href: "#",                          icon: Bell, badge: 2 },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggle = (id: string) => setOpenGroup(prev => prev === id ? null : id);

  const isActive = (href: string) =>
    pathname === href || (href !== "#" && pathname.startsWith(href.split("?")[0] + "/"));

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-zinc-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-100">
        <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center shadow-sm">
          <Cog className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-900 tracking-tight">Veltro</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Home */}
        <p className="px-5 pt-1.5 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Home</p>
        <NavLink item={singleItems[0]} pathname={pathname} />

        {/* My Vehicle */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">My Vehicle</p>
        <NavLink item={singleItems[1]} pathname={pathname} />
        <GroupItem group={navGroups[0]} open={openGroup === navGroups[0].id} onToggle={() => toggle(navGroups[0].id)} pathname={pathname} />

        {/* Shop */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Shop</p>
        <NavLink item={singleItems[2]} pathname={pathname} />
        <NavLink item={singleItems[3]} pathname={pathname} />
        <NavLink item={singleItems[4]} pathname={pathname} />

        {/* Service */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Service</p>
        <NavLink item={singleItems[5]} pathname={pathname} />
        <NavLink item={singleItems[6]} pathname={pathname} />
        <NavLink item={singleItems[7]} pathname={pathname} />

        {/* Account */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Account</p>
        <NavLink item={singleItems[8]} pathname={pathname} />
        <NavLink item={singleItems[9]} pathname={pathname} />
        <NavLink item={singleItems[10]} pathname={pathname} />
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-zinc-100">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-50 border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-colors group">
          <div className="w-8 h-8 rounded-md bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-zinc-800 truncate">{user?.name ?? "Customer"}</p>
            <p className="text-[9px] text-zinc-400 truncate">{user?.email ?? "customer"}</p>
          </div>
          <button onClick={logout} title="Sign out">
            <LogOut className="w-3 h-3 text-zinc-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const { href, icon: Icon, label, badge } = item;
  const active = pathname === href || (href !== "#" && pathname.startsWith(href.split("?")[0] + "/"));
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-[13px] font-[450] transition-all border-[1.5px]",
        active
          ? "bg-orange-50 text-orange-700 border-orange-200"
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 border-transparent"
      )}
    >
      <Icon className={cn("w-[1.1rem] h-[1.1rem] flex-shrink-0", active ? "text-orange-500" : "text-zinc-400")} />
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="min-w-[1.15rem] h-[1.15rem] px-1 bg-orange-50 text-orange-600 text-[9px] font-bold rounded-full flex items-center justify-center border border-orange-100">
          {badge}
        </span>
      )}
    </Link>
  );
}

function GroupItem({ group, open, onToggle, pathname }: {
  group: NavGroup; open: boolean; onToggle: () => void; pathname: string;
}) {
  const Icon = group.icon;
  const active = group.children.some(c => pathname === c.href || pathname.startsWith(c.href.split("?")[0]));
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2.5 w-full mx-2 px-3 py-2 rounded-lg text-[13px] font-[450] transition-all border-[1.5px]",
          active
            ? "bg-orange-50 text-orange-700 border-orange-200"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 border-transparent"
        )}
        style={{ width: "calc(100% - 1rem)" }}
      >
        <Icon className={cn("w-[1.1rem] h-[1.1rem] flex-shrink-0", active ? "text-orange-500" : "text-zinc-400")} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200", open ? "rotate-180 text-orange-400" : "text-zinc-300")} />
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? "200px" : "0px" }}>
        <div className="py-1">
          {group.children.map(child => {
            const childActive = pathname === child.href || pathname.startsWith(child.href.split("?")[0]);
            return (
              <Link
                key={child.label}
                href={child.href}
                className={cn(
                  "flex items-center gap-2 mx-2 pl-10 pr-3 py-1.5 rounded-md text-[12px] transition-all",
                  childActive ? "text-orange-600 bg-orange-50" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", childActive ? "bg-orange-500" : "bg-zinc-200")} />
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
