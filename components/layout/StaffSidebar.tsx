"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Search, Receipt, BarChart3,
  Calendar, Cog, LogOut, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";

interface NavGroup {
  label: string;
  id: string;
  icon: React.ElementType;
  children: { label: string; href: string; badge?: number }[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  kbd?: string;
}

const navGroups: NavGroup[] = [
  {
    label: "Customers", id: "cust", icon: Users,
    children: [
      { label: "Customer List",      href: ROUTES.STAFF_CUSTOMERS },
      { label: "Register Customer",  href: ROUTES.STAFF_CUSTOMERS + "?action=new" },
    ],
  },
  {
    label: "Sales", id: "sale", icon: Receipt,
    children: [
      { label: "New Sale",       href: ROUTES.STAFF_SALES_INVOICES + "?action=new" },
      { label: "Sales History",  href: ROUTES.STAFF_SALES_INVOICES },
      { label: "Create Invoice", href: ROUTES.STAFF_SALES_INVOICES + "?action=invoice" },
    ],
  },
  {
    label: "Customer Reports", id: "rep", icon: BarChart3,
    children: [
      { label: "Top Spenders",      href: ROUTES.STAFF_REPORTS + "?tab=top-spenders" },
      { label: "Regular Customers", href: ROUTES.STAFF_REPORTS + "?tab=regular" },
      { label: "Overdue Credits",   href: ROUTES.STAFF_REPORTS + "?tab=overdue", badge: 5 },
    ],
  },
];

const singleItems: NavItem[] = [
  { label: "Dashboard",     href: ROUTES.STAFF_DASHBOARD,    icon: LayoutDashboard },
  { label: "Quick Search",  href: ROUTES.STAFF_SEARCH,       icon: Search, kbd: "⌘K" },
  { label: "Appointments",  href: "/appointments",           icon: Calendar },
];

export default function StaffSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggle = (id: string) => setOpenGroup(prev => prev === id ? null : id);

  const isGroupActive = (group: NavGroup) =>
    group.children.some(c => pathname === c.href || pathname.startsWith(c.href.split("?")[0]));

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-zinc-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-100">
        <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center shadow-sm">
          <Cog className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-zinc-900 tracking-tight">Veltro</span>
        <span className="text-[9px] text-zinc-400 ml-auto font-medium bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">Staff</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-0">
        {/* Overview */}
        <p className="px-5 pt-1.5 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Overview</p>
        <NavLink href={singleItems[0].href} icon={singleItems[0].icon} label={singleItems[0].label} pathname={pathname} />

        {/* Customers */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Customers</p>
        <GroupItem group={navGroups[0]} open={openGroup === navGroups[0].id} active={isGroupActive(navGroups[0])} onToggle={() => toggle(navGroups[0].id)} pathname={pathname} />
        <NavLink href={singleItems[1].href} icon={singleItems[1].icon} label={singleItems[1].label} kbd={singleItems[1].kbd} pathname={pathname} />

        {/* Sales */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Sales</p>
        <GroupItem group={navGroups[1]} open={openGroup === navGroups[1].id} active={isGroupActive(navGroups[1])} onToggle={() => toggle(navGroups[1].id)} pathname={pathname} />

        {/* Reports */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Reports</p>
        <GroupItem group={navGroups[2]} open={openGroup === navGroups[2].id} active={isGroupActive(navGroups[2])} onToggle={() => toggle(navGroups[2].id)} pathname={pathname} />

        {/* Service */}
        <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Service</p>
        <NavLink href={singleItems[2].href} icon={singleItems[2].icon} label={singleItems[2].label} pathname={pathname} />
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-zinc-100">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-50 border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-colors group">
          <div className="w-8 h-8 rounded-md bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-zinc-800 truncate">{user?.name ?? "Staff"}</p>
            <p className="text-[9px] text-zinc-400 truncate">Staff — Sales</p>
          </div>
          <button onClick={logout} title="Sign out">
            <LogOut className="w-3 h-3 text-zinc-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavLink({ href, icon: Icon, label, badge, kbd, pathname }: {
  href: string; icon: React.ElementType; label: string; badge?: number; kbd?: string; pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(href.split("?")[0] + "/");
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
      {kbd && (
        <span className="text-[9px] text-zinc-300 bg-white border border-zinc-200 rounded px-1 py-0.5 font-mono">{kbd}</span>
      )}
      {badge != null && (
        <span className="min-w-[1.15rem] h-[1.15rem] px-1 bg-red-50 text-red-600 text-[9px] font-bold rounded-full flex items-center justify-center border border-red-100">
          {badge}
        </span>
      )}
    </Link>
  );
}

function GroupItem({ group, open, active, onToggle, pathname }: {
  group: NavGroup; open: boolean; active: boolean; onToggle: () => void; pathname: string;
}) {
  const Icon = group.icon;
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
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "200px" : "0px" }}
      >
        <div className="py-1">
          {group.children.map(child => {
            const childActive = pathname === child.href || pathname.startsWith(child.href.split("?")[0]);
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-2 mx-2 pl-10 pr-3 py-1.5 rounded-md text-[12px] transition-all",
                  childActive ? "text-orange-600 bg-orange-50" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", childActive ? "bg-orange-500" : "bg-zinc-200")} />
                <span className="flex-1">{child.label}</span>
                {child.badge != null && (
                  <span className="min-w-[1.15rem] h-[1.15rem] px-1 bg-red-50 text-red-600 text-[9px] font-bold rounded-full flex items-center justify-center border border-red-100">
                    {child.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
