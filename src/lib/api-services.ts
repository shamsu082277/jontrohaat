import { apiClient } from "./api-client";
import {
  Equipment,
  Booking,
  CustomerReview,
  EquipmentFilterParams,
  PaginatedResponse,
  ApiResponse,
  User,
} from "@/types";

export const equipmentService = {
  getAll: (params?: EquipmentFilterParams) =>
    apiClient<PaginatedResponse<Equipment>>("/api/equipment", {
      params: params as Record<string, string | number | boolean | undefined>,
      requiresAuth: false,
    }),

  getById: (id: string) =>
    apiClient<Equipment>(`/api/equipment/${id}`, { requiresAuth: false }),

  create: (data: Partial<Equipment>) =>
    apiClient<Equipment>("/api/equipment", { method: "POST", body: data }),

  update: (id: string, data: Partial<Equipment>) =>
    apiClient<Equipment>(`/api/equipment/${id}`, { method: "PATCH", body: data }),

  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/api/equipment/${id}`, { method: "DELETE" }),
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
  }) => apiClient<Booking>("/api/bookings", { method: "POST", body: data }),

  getMyRentals: () =>
    apiClient<Booking[]>("/api/bookings/my-rentals"),

  getOwnerRentals: () =>
    apiClient<Booking[]>("/api/bookings/owner-rentals"),

  getAllRentalsAdmin: () =>
    apiClient<Booking[]>("/api/admin/rentals"),

  getById: (id: string) =>
    apiClient<Booking>(`/api/bookings/${id}`),
};

export const paymentService = {
  createCheckoutSession: (bookingId: string) =>
    apiClient<{ checkoutUrl: string; sessionId: string }>(
      "/api/payments/create-checkout-session",
      { method: "POST", body: { bookingId } }
    ),

  verifySession: (sessionId: string) =>
    apiClient<{ paid: boolean; bookingId: string; amount: number }>(
      `/api/payments/verify-session?sessionId=${sessionId}`
    ),
};

export const adminService = {
  getUsers: () => apiClient<User[]>("/api/admin/users"),
  updateUserRole: (userId: string, role: string) =>
    apiClient<User>(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      body: { role },
    }),
  getStats: () =>
    apiClient<{
      totalUsers: number;
      totalEquipment: number;
      totalBookings: number;
      pendingApprovals: number;
      completedRentals: number;
      totalRevenue: number;
    }>("/api/admin/stats"),
  approveEquipment: (id: string, status: "approved" | "rejected") =>
    apiClient<Equipment>(`/api/admin/equipment/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
};

export const imageUploadService = {
  upload: async (file: File): Promise<ApiResponse<{ url: string; display_url: string }>> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient<{ url: string; display_url: string }>("/api/upload/image", {
      method: "POST",
      body: formData,
    });
  },
};
