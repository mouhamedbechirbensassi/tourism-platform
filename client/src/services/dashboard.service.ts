import { apiFetch } from "./api";

export interface DashboardResponse {
  totalHotels: number;
  totalClients: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: { month: number; revenue: number }[];
  year: number;
}

export function getDashboard(year: number) {
  return apiFetch<DashboardResponse>(`/dashboard?year=${year}`);
}