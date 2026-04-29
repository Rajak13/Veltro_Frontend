"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, AlertTriangle, Receipt, Truck,
  Users, Contact, BarChart3, Box, Settings, Cog, LogOut,
  ChevronDown, X, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect } from "react";

interface NavGroup {
  label: string;
  id: string;
  icon: React.ElementType;
  badge?: number;
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
    label: "Inventory", id: "inv", icon: Package,
    children: [
      { label: "All Parts",    href: ROUTES.ADMIN_PARTS },
      { label: "Add New Part", href: ROUTES.ADMIN_PARTS + "?action=new" },
    ],
  },
  {
    label: "Sales", id: "sales", icon: Receipt,
    children: [
      { label: "Sales History",     href: "/sales-invoices" },
      { label: "Create Invoice",    href: "/sales-invoices?action=new" },
    ],
  },
  {
    label: "Purchases", id: "pur", icon: Truck,
    children: [
      { label: "Vendor List",       href: ROUTES.ADMIN_VENDORS },
      { label: "Add Vendor",        href: ROUTES.ADMIN_VENDORS + "?action=new" },
      { label: "Purchase Invoices", href: ROUTES.ADMIN_PURCHASE_INVOICES },
    ],
  },
  {
    label: "Staff", id: "staff", icon: Users,
    children: [
      { label: "Staff List", href: ROUTES.ADMIN_STAFF },
      { label: "Add Staff",  href: ROUTES.ADMIN_STAFF + "?action=new" },
    ],
  },
  {
    label: "Financial Reports", id: "fin", icon: BarChart3,
    children: [
      { label: "Daily Report",   href: "/reports/daily" },
      { label: "Monthly Report", href: "/reports/monthly" },
      { label: "Yearly Report",  href: "/reports/yearly" },
    ],
  },
];

const singleItems: NavItem[] = [
  { label: "Low Stock Alerts", href: "/parts?filter=low-stock", icon: AlertTriangle, badge: 3 },
  { label: "Customers",        href: ROUTES.ADMIN_CUSTOMERS,    icon: Contact },
  { label: "Inventory Report", href: "/reports/inventory",      icon: Box },
  { label: "Settings",         href: "/settings",               icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (id: string) => setOpenGroup(prev => prev === id ? null : id);

  const isGroupActive = (group: NavGroup) =>
    group.children.some(c => pathname === c.href || pathname.startsWith(c.href.split("?")[0]));

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg border border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-zinc-700" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "flex flex-col min-h-screen bg-white border-r border-zinc-200 transition-transform duration-300 ease-in-out",
        // Mobile: fixed drawer
        "fixed lg:static inset-y-0 left-0 z-50",
        "w-64 lg:w-64",
        // Mobile transform
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1.5 rounded-md hover:bg-zinc-100 transition-colors z-10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-zinc-500" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-100 pr-12 lg:pr-5">
          <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center shadow-sm">
            <Cog className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">Veltro</span>
          <span className="text-[9px] text-zinc-400 ml-auto font-medium bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-0 scrollbar-thin">
          {/* Overview */}
          <p className="px-5 pt-1.5 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Overview</p>
          <NavLink href={ROUTES.ADMIN_DASHBOARD} icon={LayoutDashboard} label="Dashboard" pathname={pathname} />

          {/* Operations */}
          <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Operations</p>
          {navGroups.slice(0, 3).map(group => (
            <GroupItem key={group.id} group={group} open={openGroup === group.id} active={isGroupActive(group)} onToggle={() => toggle(group.id)} pathname={pathname} />
          ))}
          <NavLink href={singleItems[0].href} icon={singleItems[0].icon} label={singleItems[0].label} badge={singleItems[0].badge} pathname={pathname} />

          {/* People */}
          <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">People</p>
          <GroupItem group={navGroups[3]} open={openGroup === navGroups[3].id} active={isGroupActive(navGroups[3])} onToggle={() => toggle(navGroups[3].id)} pathname={pathname} />
          <NavLink href={singleItems[1].href} icon={singleItems[1].icon} label={singleItems[1].label} pathname={pathname} />

          {/* Analytics */}
          <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">Analytics</p>
          <GroupItem group={navGroups[4]} open={openGroup === navGroups[4].id} active={isGroupActive(navGroups[4])} onToggle={() => toggle(navGroups[4].id)} pathname={pathname} />
          <NavLink href={singleItems[2].href} icon={singleItems[2].icon} label={singleItems[2].label} pathname={pathname} />

          {/* System */}
          <p className="px-5 pt-3 pb-0.5 text-[10px] font-semibold text-zinc-300 uppercase tracking-widest">System</p>
          <NavLink href={singleItems[3].href} icon={singleItems[3].icon} label={singleItems[3].label} pathname={pathname} />
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-zinc-100">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 border border-zinc-100 cursor-pointer hover:bg-zinc-100 transition-colors group">
            <div className="w-8 h-8 rounded-md bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-zinc-800 truncate leading-tight">{user?.name ?? "Admin"}</p>
              <p className="text-[9px] text-zinc-400 truncate leading-tight mt-0.5">{user?.email ?? "Super Admin"}</p>
            </div>
            <button onClick={logout} title="Sign out" className="flex-shrink-0 p-1 hover:bg-zinc-200 rounded transition-colors">
              <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavLink({ href, icon: Icon, label, badge, pathname }: {
  href: string; icon: React.ElementType; label: string; badge?: number; pathname: string;
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
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
