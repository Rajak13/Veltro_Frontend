"use client";

// Customer Dashboard — Home
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/customer-dashboard
// API endpoints: GET /api/appointments/my, GET /api/invoices/sales/my

import { useAuth } from "@/hooks/useAuth";
import { useMyAppointments } from "@/hooks/useAppointments";
import { useMyPurchaseHistory } from "@/hooks/useInvoices";
import { useMyProfile } from "@/hooks/useCustomers";
import {
  TrendingUp, CalendarPlus, Search, Car, Gift,
  ShieldCheck, Disc, Droplets, Wind, BatteryMedium,
  CalendarCheck, Package, Check, Clock, ArrowRight,
  ShoppingCart, Star,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { data: appointments } = useMyAppointments();
  const { data: profile } = useMyProfile();
  const primaryVehicle = profile?.vehicles?.[0];
  const { data: purchaseHistory } = useMyPurchaseHistory();

  const invoices = purchaseHistory || [];
  const upcomingAppt = (appointments ?? []).find(a => a.status === "Pending" || a.status === "Confirmed");
  const lifetimeSpend = invoices.reduce((s, i) => s + (i.finalAmount ?? 0), 0);
  const totalDiscount = invoices.reduce((s, i) => s + ((i.totalAmount ?? 0) - (i.finalAmount ?? 0)), 0);

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div>
      {/* Greeting */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Hey, {user?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex gap-1.5">
          <Link href={ROUTES.CUSTOMER_APPOINTMENTS} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <CalendarPlus className="w-3 h-3 text-orange-500" />Book Service
          </Link>
          <Link href={ROUTES.CUSTOMER_PART_REQUESTS} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
            <Search className="w-3 h-3 text-orange-500" />Browse Parts
          </Link>
        </div>
      </div>

      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden mb-4 p-5" style={{ background: "#18181b", border: "1px solid #27272a" }}>
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-2/5 h-4/5 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.04) 0%, transparent 60%)" }} />
        <div className="relative z-10">
          <div className="mb-1">
            <p className="text-[10px] text-zinc-500 font-medium mb-1">Your Spending Overview</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-white tabular-nums">
                Rs. {lifetimeSpend.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-orange-400">lifetime</span>
            </div>
          </div>
          <svg className="w-full mt-3 mb-4" height="40" viewBox="0 0 600 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cust-sf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,32 C50,30 100,24 150,26 C200,28 250,18 300,20 C350,22 400,14 450,10 C500,8 550,12 600,6" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M0,32 C50,30 100,24 150,26 C200,28 250,18 300,20 C350,22 400,14 450,10 C500,8 550,12 600,6 L600,40 L0,40 Z" fill="url(#cust-sf)" />
          </svg>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "This Month",  value: `Rs. ${invoices.slice(0, 3).reduce((s, i) => s + (i.finalAmount ?? 0), 0).toLocaleString()}` },
              { label: "Purchases",   value: invoices.length },
              { label: "Services",    value: (appointments ?? []).filter(a => a.status === "Completed").length },
              { label: "You Saved",   value: `Rs. ${totalDiscount.toLocaleString()}`, orange: true },
            ].map(({ label, value, orange }) => (
              <div key={label} className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] text-zinc-500 mb-0.5">{label}</p>
                <p className={`text-sm font-semibold tabular-nums ${orange ? "text-orange-400" : "text-white"}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Health + Vehicle + Loyalty row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* AI Health Analysis */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm lg:col-span-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-orange-50 border border-orange-100 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">AI Health Analysis</h3>
                <p className="text-[10px] text-zinc-400">Based on your vehicle&apos;s condition &amp; usage</p>
              </div>
            </div>
            <span className="text-[10px] text-zinc-400">Updated today</span>
          </div>
          <div className="space-y-3">
            {/* Overall health */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-green-800">Overall Health Score</span>
                  <span className="text-sm font-bold text-green-700 tabular-nums">82/100</span>
                </div>
                <div className="h-[5px] rounded-full bg-green-100 overflow-hidden">
                  <div className="h-full rounded-full bg-green-500" style={{ width: "82%" }} />
                </div>
              </div>
            </div>
            {/* Part predictions */}
            {[
              { icon: Disc,         label: "Brake Pads",  note: "Replace in ~2,400 km", pct: 28,  color: "bg-orange-400", noteColor: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
              { icon: Droplets,     label: "Engine Oil",  note: "Change in ~800 km",    pct: 12,  color: "bg-yellow-500", noteColor: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
              { icon: Wind,         label: "Air Filter",  note: "Good — ~8,000 km remaining", pct: 68, color: "bg-zinc-300", noteColor: "text-zinc-400", bg: "bg-zinc-50 border-zinc-100" },
              { icon: BatteryMedium,label: "Battery",     note: "Healthy — 91% capacity", pct: 91, color: "bg-zinc-300", noteColor: "text-zinc-400", bg: "bg-zinc-50 border-zinc-100" },
            ].map(({ icon: Icon, label, note, pct, color, noteColor, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0 ${bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${noteColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-700">{label}</span>
                    <span className={`text-[10px] font-medium ${noteColor}`}>{note}</span>
                  </div>
                  <div className="h-[5px] rounded-full bg-zinc-100 mt-1 overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Vehicle + Loyalty */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Vehicle card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-zinc-900">My Vehicle</h3>
              <Link href={ROUTES.CUSTOMER_PROFILE} className="text-[10px] text-orange-600 hover:text-orange-700 font-medium transition-colors">Edit</Link>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <Car className="w-7 h-7 text-zinc-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">{primaryVehicle ? `${primaryVehicle.year} ${primaryVehicle.make} ${primaryVehicle.model}` : "My Vehicle"}</div>
                <div className="text-[10px] text-zinc-400">Registered vehicle</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Registration", value: primaryVehicle?.registrationNumber || "—" },
                { label: "Odometer",     value: primaryVehicle?.mileage ? `${primaryVehicle.mileage.toLocaleString()} km` : "—" },
                { label: "Last Service", value: (appointments ?? []).filter(a => a.status === "Completed").slice(-1)[0] ? new Date((appointments ?? []).filter(a => a.status === "Completed").slice(-1)[0].scheduledDate).toLocaleDateString() : "—" },
                { label: "Next Due",     value: upcomingAppt ? new Date(upcomingAppt.scheduledDate).toLocaleDateString() : "—", orange: !!upcomingAppt },
              ].map(({ label, value, orange }) => (
                <div key={label} className="p-2 rounded-md bg-zinc-50 border border-zinc-100">
                  <div className="text-[9px] text-zinc-400">{label}</div>
                  <div className={`text-[11px] font-semibold mt-0.5 ${orange ? "text-orange-600" : "text-zinc-800"}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Loyalty card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-zinc-900">Loyalty Status</h3>
              </div>
              <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">10% off</span>
            </div>
            <p className="text-[11px] text-zinc-500 mb-3">Spend Rs. 5,000+ in a single purchase to unlock 10% discount automatically.</p>
            {/* Progress bar */}
            <div className="relative mb-2">
              <div className="h-1.5 rounded-full bg-zinc-100 overflow-visible relative">
                <div className="h-full rounded-full bg-orange-500" style={{ width: "78%" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-orange-500 shadow-[0_0_0_2px_#fff7ed]" style={{ left: "78%" }} />
              </div>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-400 mb-3">
              <span>Rs. 0</span>
              <span className="text-orange-600 font-semibold">Rs. 5,000 threshold</span>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-orange-700 font-semibold">Best order this month</div>
                  <div className="text-[9px] text-orange-600/70">Rs. {invoices[0]?.finalAmount?.toLocaleString() ?? "0"} — {invoices[0] && (invoices[0].finalAmount ?? 0) >= 5000 ? "Discount applied!" : "Need Rs. 5,000 to unlock"}</div>
                </div>
                <Link href={ROUTES.CUSTOMER_PART_REQUESTS} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all">
                  <ShoppingCart className="w-2.5 h-2.5 text-orange-500" />Shop
                </Link>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400">Total discounts earned</span>
              <span className="text-xs font-bold text-zinc-900 tabular-nums">Rs. {totalDiscount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment + Part Requests row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Upcoming appointment */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-zinc-900">Upcoming Appointment</h3>
            {upcomingAppt ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Scheduled
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400">None scheduled</span>
            )}
          </div>
          {upcomingAppt ? (
            <>
              <div className="flex gap-3 mb-4">
                <div className="text-center flex-shrink-0 p-3 rounded-xl bg-zinc-50 border border-zinc-100" style={{ minWidth: "3.5rem" }}>
                  <div className="text-[9px] text-zinc-400 uppercase font-medium">{new Date(upcomingAppt.scheduledDate).toLocaleString("en-US", { month: "short" })}</div>
                  <div className="text-xl font-bold text-zinc-900 tabular-nums leading-none mt-0.5">{new Date(upcomingAppt.scheduledDate).getDate()}</div>
                  <div className="text-[9px] text-zinc-400 mt-0.5">{new Date(upcomingAppt.scheduledDate).toLocaleString("en-US", { weekday: "short" })}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-zinc-800 mb-0.5">Service Appointment</div>
                  <div className="text-[10px] text-zinc-400 mb-2">{upcomingAppt.notes || "Scheduled service"}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Clock className="w-3 h-3" />{new Date(upcomingAppt.scheduledDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={ROUTES.CUSTOMER_APPOINTMENTS} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all">
                  <CalendarCheck className="w-3 h-3" />Reschedule
                </Link>
                <Link href={ROUTES.CUSTOMER_APPOINTMENTS} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-red-100 bg-white text-red-500 hover:bg-red-50 transition-all">
                  Cancel
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <CalendarPlus className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-xs text-zinc-400">No upcoming appointments</p>
              <Link href={ROUTES.CUSTOMER_APPOINTMENTS} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all">
                <CalendarPlus className="w-3 h-3" />Book Now
              </Link>
            </div>
          )}
        </div>

        {/* Part requests */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Part Requests</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Parts you requested that weren&apos;t in stock</p>
            </div>
            <Link href={ROUTES.CUSTOMER_PART_REQUESTS} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all">
              <Package className="w-3 h-3 text-orange-500" />New Request
            </Link>
          </div>
          {/* TODO [Siddhartha Raj Thapa]: Replace with real part requests from API */}
          <div className="space-y-1">
            {[
              { name: "Front Wiper Blade — Bosch Aerotwin", date: "Requested Jul 20", status: "Sourced",   statusLabel: "Available now",          icon: Check,  iconBg: "bg-green-50 border-green-100",  iconColor: "text-green-600" },
              { name: "Cabin Air Filter — Honda OEM",       date: "Requested Jul 28", status: "Pending",   statusLabel: "Sourcing from vendor",    icon: Clock,  iconBg: "bg-orange-50 border-orange-100", iconColor: "text-orange-500" },
              { name: "Rear Brake Pad Set — aftermarket",   date: "Requested Jul 12", status: "Sourced",   statusLabel: "Available now",          icon: Check,  iconBg: "bg-green-50 border-green-100",  iconColor: "text-green-600" },
            ].map(({ name, date, status, statusLabel, icon: Icon, iconBg, iconColor }) => (
              <div key={name} className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className={`w-8 h-8 rounded-md border flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-zinc-700 truncate">{name}</div>
                  <div className="text-[9px] text-zinc-400">{date} • {statusLabel}</div>
                </div>
                {status === "Sourced" ? (
                  <Link href={ROUTES.CUSTOMER_PART_REQUESTS} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium border-[1.5px] border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 transition-all">
                    <ShoppingCart className="w-2.5 h-2.5 text-orange-500" />Order
                  </Link>
                ) : (
                  <span className="text-[10px] text-orange-600 font-medium">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purchase History table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm mb-4">
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Purchase History</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">All your parts purchases</p>
          </div>
          <Link href={ROUTES.CUSTOMER_HISTORY} className="text-[11px] text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 transition-colors">
            View All<ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Invoice", "Part", "Qty", "Amount", "Discount", "Total", "Date", "Status"].map(h => (
                  <th key={h} className="px-3.5 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-xs text-zinc-300">No purchases yet</td></tr>
              ) : (
                invoices.map(inv => {
                  const discount = (inv.totalAmount ?? 0) - (inv.finalAmount ?? 0);
                  const hasDiscount = discount > 0;
                  return (
                    <tr key={inv.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-3.5 py-2.5 text-[12px] font-medium text-zinc-700 tabular-nums border-b border-zinc-50">#{inv.id}</td>
                      <td className="px-3.5 py-2.5 text-[12px] text-zinc-600 border-b border-zinc-50">
                        {inv.items?.[0] ? `${(inv.items[0] as { part?: { name?: string } }).part?.name ?? "Part"}${inv.items.length > 1 ? ` +${inv.items.length - 1}` : ""}` : "—"}
                      </td>
                      <td className="px-3.5 py-2.5 text-[12px] text-zinc-400 tabular-nums border-b border-zinc-50">{inv.items?.reduce((s, i) => s + i.quantity, 0) ?? 0}</td>
                      <td className="px-3.5 py-2.5 text-[12px] tabular-nums border-b border-zinc-50">Rs. {(inv.totalAmount ?? 0).toLocaleString()}</td>
                      <td className="px-3.5 py-2.5 text-[12px] font-medium tabular-nums border-b border-zinc-50">
                        {hasDiscount ? <span className="text-green-600">-Rs. {discount.toLocaleString()}</span> : <span className="text-zinc-300">—</span>}
                      </td>
                      <td className="px-3.5 py-2.5 text-[12px] font-semibold text-zinc-900 tabular-nums border-b border-zinc-50">Rs. {(inv.finalAmount ?? 0).toLocaleString()}</td>
                      <td className="px-3.5 py-2.5 text-[12px] text-zinc-400 border-b border-zinc-50">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="px-3.5 py-2.5 border-b border-zinc-50">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${hasDiscount ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {hasDiscount ? "10% off ✓" : inv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service History table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm mb-4">
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Service History</h3>
            <p className="text-[10px] text-zinc-400 mt-0.5">Past service appointments</p>
          </div>
        </div>
        <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Date", "Service Type", "Details", "Status", "Rating"].map(h => (
                  <th key={h} className="px-3.5 py-2 text-left text-[10px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(appointments ?? []).length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-xs text-zinc-300">No service history yet</td></tr>
              ) : (
                (appointments ?? []).map(appt => (
                  <tr key={appt.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-3.5 py-2.5 text-[12px] text-zinc-400 tabular-nums border-b border-zinc-50">{new Date(appt.scheduledDate).toLocaleDateString()}</td>
                    <td className="px-3.5 py-2.5 text-[12px] font-medium text-zinc-700 border-b border-zinc-50">Service</td>
                    <td className="px-3.5 py-2.5 text-[12px] text-zinc-500 border-b border-zinc-50">{appt.notes ?? "—"}</td>
                    <td className="px-3.5 py-2.5 border-b border-zinc-50">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        appt.status === "Completed" ? "bg-zinc-100 text-zinc-600" :
                        appt.status === "Confirmed" ? "bg-green-50 text-green-700" :
                        appt.status === "Cancelled" ? "bg-red-50 text-red-600" :
                        "bg-orange-50 text-orange-600"
                      }`}>{appt.status}</span>
                    </td>
                    <td className="px-3.5 py-2.5 border-b border-zinc-50">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={`star-${appt.id}-${i}`} className={`w-3 h-3 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
