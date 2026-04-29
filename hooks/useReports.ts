import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  monthlySales: { month: string; revenue: number; expenses: number }[];
  topSellingParts: { partName: string; quantity: number; revenue: number }[];
}

export interface TopSpender {
  customerId: string;
  name: string;
  totalSpent: number;
}

export interface RegularCustomer {
  customerId: string;
  name: string;
  purchaseCount: number;
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
  });

/**
 * Top spending customers
 * GET /api/reports/customers/top-spenders?top=10
 */
export const useTopSpenders = (top = 10) =>
  useQuery({
    queryKey: ["reports", "customers", "top-spenders", top],
    queryFn: async () => {
      const res = await api.get<ApiResponse<TopSpender[]>>(
        "/reports/customers/top-spenders",
        { params: { top } }
      );
      return res.data.data;
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
      return res.data.data;
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
      const res = await api.get<ApiResponse<OverdueCredit[]>>(
        "/reports/customers/overdue-credits"
      );
      return res.data.data;
    },
  });

// ─── Legacy alias kept for backward compatibility with reports/page.tsx ───────
/** @deprecated Use useTopSpenders + useRegularCustomers instead */
export const useCustomerReport = () =>
  useQuery({
    queryKey: ["reports", "customers", "combined"],
    queryFn: async () => {
      const [topRes, regRes] = await Promise.all([
        api.get<ApiResponse<TopSpender[]>>("/reports/customers/top-spenders", { params: { top: 10 } }),
        api.get<ApiResponse<RegularCustomer[]>>("/reports/customers/regulars"),
      ]);
      return {
        topCustomers: topRes.data.data ?? [],
        regularCustomers: regRes.data.data ?? [],
        totalCustomers: undefined as number | undefined,
        newCustomersThisMonth: undefined as number | undefined,
      };
    },
  });
