import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopSellingPart {
  partId: string;
  partName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface FinancialReport {
  period: string;
  totalSales: number;
  totalPurchases: number;
  netProfit: number;
  monthlySales: { month: string; revenue: number; expenses: number }[];
  topSellingParts: TopSellingPart[];
}

export interface TopSpender {
  customerId: string;
  name: string;
  totalSpent: number;
  invoiceCount?: number;
  lastPurchaseDate?: string;
}

export interface RegularCustomer {
  customerId: string;
  name?: string;
  customerName?: string;
  purchaseCount?: number;
  invoiceCount?: number;
  totalSpent?: number;
}

export interface OverdueCredit {
  customerId: string;
  name: string;
  creditBalance: number;
  lastPurchaseDate: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Financial report — backend accepts period: "daily" | "monthly" | "yearly"
 * GET /api/reports/financial?period=monthly
 */
export const useFinancialReport = (period: "daily" | "monthly" | "yearly" = "monthly") =>
  useQuery({
    queryKey: ["reports", "financial", period],
    queryFn: async () => {
      const res = await api.get<ApiResponse<FinancialReport>>("/reports/financial", {
        params: { period },
      });
      return res.data.data;
    },
    retry: false,
  });

/**
 * Top spending customers
 * GET /api/reports/customers/top-spenders?top=10
 */
type TopSpenderApi = {
  customerId: string;
  customerName?: string;
  name?: string;
  totalSpent: number;
};

type CustomerReportApi = TopSpenderApi & {
  invoiceCount?: number;
  creditBalance?: number;
  lastPurchaseDate?: string;
};

const mapTopSpender = (c: CustomerReportApi): TopSpender & {
  invoiceCount?: number;
  lastPurchaseDate?: string;
} => ({
  customerId: c.customerId,
  name: c.customerName ?? c.name ?? "Unknown",
  totalSpent: c.totalSpent,
  invoiceCount: c.invoiceCount,
  lastPurchaseDate: c.lastPurchaseDate,
});

export const useTopSpenders = (top = 10) =>
  useQuery({
    queryKey: ["reports", "customers", "top-spenders", top],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CustomerReportApi[]>>(
        "/reports/customers/top-spenders",
        { params: { top } }
      );
      return (res.data.data ?? []).map(mapTopSpender);
    },
  });

/**
 * Regular customers (3+ purchases)
 * GET /api/reports/customers/regulars?minPurchases=3
 */
export const useRegularCustomers = (minPurchases = 3) =>
  useQuery({
    queryKey: ["reports", "customers", "regulars", minPurchases],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RegularCustomer[]>>(
        "/reports/customers/regulars",
        { params: { minPurchases } }
      );
      return (res.data.data ?? []).map((c) => ({
        customerId: c.customerId,
        name: c.customerName ?? c.name ?? "Customer",
        purchaseCount: c.invoiceCount ?? c.purchaseCount ?? 0,
        invoiceCount: c.invoiceCount,
        totalSpent: c.totalSpent,
      }));
    },
  });

/**
 * Customers with overdue credit balances
 * GET /api/reports/customers/overdue-credits
 */
export const useOverdueCredits = () =>
  useQuery({
    queryKey: ["reports", "customers", "overdue-credits"],
    queryFn: async () => {
      const res = await api.get<
        ApiResponse<(OverdueCredit & { customerName?: string })[]>
      >("/reports/customers/overdue-credits");
      return (res.data.data ?? []).map((c) => ({
        customerId: c.customerId,
        name: c.customerName ?? c.name ?? "Customer",
        creditBalance: c.creditBalance,
        lastPurchaseDate: c.lastPurchaseDate,
      }));
    },
  });

// ─── Legacy alias kept for backward compatibility with reports/page.tsx ───────
/** @deprecated Use useTopSpenders + useRegularCustomers instead */
export const useCustomerReport = () =>
  useQuery({
    queryKey: ["reports", "customers", "combined"],
    queryFn: async () => {
      // Run all three in parallel; stats may fail on first deploy (endpoint just added)
      const [topRes, regRes, statsRes] = await Promise.allSettled([
        api.get<ApiResponse<TopSpenderApi[]>>("/reports/customers/top-spenders", { params: { top: 10 } }),
        api.get<ApiResponse<RegularCustomer[]>>("/reports/customers/regulars"),
        api.get<ApiResponse<{ total: number; newThisMonth: number }>>("/reports/customers/stats"),
      ]);

      const topData = topRes.status === "fulfilled" ? (topRes.value.data.data ?? []) : [];
      const regData = regRes.status === "fulfilled" ? (regRes.value.data.data ?? []) : [];
      const statsData = statsRes.status === "fulfilled" ? statsRes.value.data.data : null;

      console.log("[useCustomerReport] topSpenders:", topData.length, "regulars:", regData.length, "stats:", statsData);
      if (topRes.status === "rejected") console.error("[useCustomerReport] top-spenders failed:", topRes.reason);
      if (regRes.status === "rejected") console.error("[useCustomerReport] regulars failed:", regRes.reason);
      if (statsRes.status === "rejected") console.error("[useCustomerReport] stats failed:", statsRes.reason);

      return {
        topCustomers: topData.map(mapTopSpender),
        regularCustomers: regData.map((c) => ({
          customerId: c.customerId,
          name: c.customerName ?? c.name ?? "Customer",
          purchaseCount: c.invoiceCount ?? c.purchaseCount ?? 0,
          totalSpent: c.totalSpent,
        })),
        totalCustomers: statsData?.total ?? undefined as number | undefined,
        newCustomersThisMonth: statsData?.newThisMonth ?? undefined as number | undefined,
      };
    },
  });
