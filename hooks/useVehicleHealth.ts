import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export interface ComponentHealth {
  name: string;
  healthPercent: number;
  kmRemaining: number | null;
  statusNote: string;
  urgency: "good" | "warning" | "critical";
}

export interface VehicleHealth {
  vehicleId: string;
  vehicleName: string;
  mileage: number;
  overallScore: number;
  brakePads: ComponentHealth;
  engineOil: ComponentHealth;
  airFilter: ComponentHealth;
  battery: ComponentHealth;
  generatedAt: string;
}

/**
 * Fetches the AI-computed health report for a specific vehicle.
 * GET /api/customers/vehicles/{vehicleId}/health
 */
export const useVehicleHealth = (vehicleId: string | undefined) =>
  useQuery({
    queryKey: ["vehicle-health", vehicleId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<VehicleHealth>>(
        `/customers/vehicles/${vehicleId}/health`
      );
      return res.data.data;
    },
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes — health doesn't change per-request
    retry: false,
  });
