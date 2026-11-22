/**
 * JontroHaat Core Domain Types
 */

export type UserRole = "customer" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  phone?: string;
  address?: string;
  district?: string;
  division?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export type EquipmentCategory =
  | "Power Tillers"
  | "Tractors"
  | "Harvesters"
  | "Rice Transplanters"
  | "Irrigation Pumps"
  | "Sprayers"
  | "Threshers"
  | "Reapers"
  | "Seed Drills"
  | "Rotavators";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type RentalType = "per_day" | "per_hour" | "per_acre";

export interface EquipmentLocation {
  division: string;
  district: string;
  upazila?: string;
  address?: string;
}

export interface EquipmentOwner {
  id: string;
  name: string;
  banglaName?: string;
  phone: string;
  email?: string;
  district: string;
  division: string;
  verified: boolean;
  memberSince: string;
  responseRate?: string;
  avatar?: string;
}

export interface Equipment {
  _id: string;
  title: string;
  banglaTitle?: string;
  description: string;
  category: EquipmentCategory;
  pricePerDay: number;
  priceIsEstimate?: boolean;
  rentalType?: RentalType;
  securityDeposit?: number;
  quantity: number;
  isAvailable?: boolean;
  condition?: string;
  brand?: string;
  model?: string;
  images: string[];
  location: EquipmentLocation;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  owner?: EquipmentOwner;
  terms?: string[];
  status: EquipmentStatus;
  isFeatured: boolean;
  specifications?: Record<string, string>;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type PaymentStatus = "pending" | "unpaid" | "paid" | "failed" | "refunded";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export interface Booking {
  _id: string;
  equipmentId: string;
  equipmentTitle: string;
  equipmentImage?: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  renterPhone: string;
  customerId?: string;
  ownerId: string;
  startDate: string | Date;
  endDate: string | Date;
  durationDays: number;
  rentalDuration?: number;
  quantity: number;
  dailyRate: number;
  totalPrice: number;
  totalAmount?: number;
  deliveryAddress: string;
  contactNumber: string;
  paymentStatus: PaymentStatus;
  stripeSessionId?: string;
  paymentIntentId?: string;
  bookingStatus: BookingStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CustomerReview {
  _id: string;
  equipmentId?: string;
  equipmentTitle?: string;
  renterId: string;
  renterName: string;
  renterAvatar?: string;
  renterLocation?: string;
  rating: number;
  comment: string;
  date: string;
  cropType?: string;
  isDemo?: boolean;
  createdAt: string | Date;
}

export interface EquipmentFilterParams {
  search?: string;
  category?: string;
  location?: string;
  division?: string;
  district?: string;
  rentalType?: string;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
