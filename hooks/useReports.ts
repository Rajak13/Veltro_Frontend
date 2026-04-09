import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface FinancialReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  monthlySales: { month: string; revenue: number; expenses: number }[];
  topSellingParts: { partName: string; quantity: number; revenue: number }[];
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: { customerId: number; name: string; totalSpent: number }[];
}

export const useFinancialReport = (year?: number) =>
  useQuery({
    queryKey: ["reports", "financial", year],
    queryFn: async () => {
      const res = await api.get<ApiResponse<FinancialReport>>("/reports/financial", {
        params: { year },
      });
      return res.data.data;
    },
  });

export const useCustomerReport = () =>
  useQuery({
    queryKey: ["reports", "customers"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CustomerReport>>("/reports/customers");
      return res.data.data;
    },
  });
