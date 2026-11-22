import { apiClient } from "./api-client";
import {
  Equipment,
  Booking,
  EquipmentFilterParams,
  PaginatedResponse,
  User,
  UserRole,
} from "@/types";

export const equipmentService = {
  getAll: (params?: EquipmentFilterParams) => {
    const query = params
      ? {
          ...params,
          available: params.availability === "available_now" ? true : undefined,
          sort: params.sortBy === "price_asc" ? "priceAsc" : params.sortBy === "price_desc" ? "priceDesc" : "newest",
          availability: undefined,
          sortBy: undefined,
        }
      : undefined;
    return apiClient<PaginatedResponse<Equipment>>("/api/equipment", {
      params: query as Record<string, string | number | boolean | undefined>,
      requiresAuth: false,
    });
  },

  getFeatured: () =>
    apiClient<Equipment[]>("/api/equipment/featured", { requiresAuth: false }),

  getById: (id: string) =>
    apiClient<Equipment>(`/api/equipment/${id}`, { requiresAuth: false }),

  create: (data: Partial<Equipment> & { images?: string[]; rentalPrice?: number; availableQuantity?: number; rentalTerms?: string }) =>
    apiClient<Equipment>("/api/equipment", { method: "POST", body: data }),

  update: (id: string, data: Partial<Equipment>) =>
    apiClient<Equipment>(`/api/equipment/${id}`, { method: "PATCH", body: data }),

  getByIdForOwner: (id: string) =>
    apiClient<Equipment>(`/api/equipment/${id}`),

  delete: (id: string) =>
    apiClient<{ deleted: boolean }>(`/api/equipment/${id}`, { method: "DELETE" }),
};

export const bookingService = {
  create: (data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    quantity: number;
    contactNumber: string;
    deliveryAddress: string;
    notes?: string;
    areaAcres?: number;
  }) => apiClient<Booking>("/api/bookings", { method: "POST", body: data }),

  getMyRentals: () => apiClient<Booking[]>("/api/bookings/my"),
  getOwnerRentals: () => apiClient<Booking[]>("/api/owner/bookings"),
  getAllRentalsAdmin: () => apiClient<Booking[]>("/api/admin/bookings"),
  getById: (id: string) => apiClient<Booking>(`/api/bookings/${id}`),
  updateOwnerStatus: (id: string, bookingStatus: Booking["bookingStatus"]) =>
    apiClient<Booking>(`/api/owner/bookings/${id}/status`, { method: "PATCH", body: { bookingStatus } }),
  updateAdminStatus: (id: string, bookingStatus: Booking["bookingStatus"]) =>
    apiClient<Booking>(`/api/admin/bookings/${id}/status`, { method: "PATCH", body: { bookingStatus } }),
};

export const paymentService = {
  createCheckoutSession: (bookingId: string) =>
    apiClient<{ checkoutUrl: string; sessionId: string }>("/api/payments/checkout-session", {
      method: "POST",
      body: { bookingId },
    }),

  verifySession: (sessionId: string) =>
    apiClient<{ paid: boolean; bookingId: string; amount: number }>(
      `/api/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`
    ),
};

export const favoritesService = {
  getAll: () => apiClient<Equipment[]>("/api/favorites"),
  add: (equipmentId: string) => apiClient<{ equipmentId: string }>(`/api/favorites/${equipmentId}`, { method: "POST" }),
  remove: (equipmentId: string) => apiClient<{ deleted: boolean }>(`/api/favorites/${equipmentId}`, { method: "DELETE" }),
};

export const profileService = {
  getMe: () => apiClient<User>("/api/users/me"),
  updateMe: (data: Partial<Pick<User, "name" | "phone" | "district" | "division" | "image">> & { address?: string }) =>
    apiClient<User>("/api/users/me", { method: "PATCH", body: data }),
};

export const ownerService = {
  getEquipment: () => apiClient<Equipment[]>("/api/owner/equipment"),
  getAnalytics: () => apiClient<{
    totalEquipment: number;
    approvedEquipment: number;
    pendingEquipment: number;
    totalRentals: number;
    completedRentals: number;
    totalEarnings: number;
    monthlyEarnings: { _id: string; earnings: number }[];
  }>("/api/owner/analytics"),
};

export const adminService = {
  getUsers: () => apiClient<User[]>("/api/admin/users"),
  updateUserRole: (userId: string, role: UserRole) =>
    apiClient<User>(`/api/admin/users/${encodeURIComponent(userId)}/role`, { method: "PATCH", body: { role } }),
  getEquipment: () => apiClient<Equipment[]>("/api/admin/equipment"),
  getBookings: () => apiClient<Booking[]>("/api/admin/bookings"),
  getStats: () =>
    apiClient<{
      totalUsers: number;
      totalEquipment: number;
      totalBookings: number;
      pendingApprovals: number;
      completedRentals: number;
      totalRevenue: number;
      monthlyBookings: { _id: string; bookings: number }[];
      categoryStatistics: { _id: string; count: number }[];
    }>("/api/admin/analytics"),
  approveEquipment: (id: string, status: "approved" | "rejected") =>
    apiClient<Equipment>(`/api/admin/equipment/${id}/status`, { method: "PATCH", body: { status } }),
  deleteEquipment: (id: string) =>
    apiClient<{ deleted: boolean }>(`/api/admin/equipment/${id}`, { method: "DELETE", body: { confirm: true } }),
};
