import type { UserRole } from "@/types";

export function getUserRole(user: unknown): UserRole | null {
  if (!user || typeof user !== "object" || !("role" in user)) {
    return null;
  }

  const role = user.role;
  return role === "customer" || role === "owner" || role === "admin"
    ? role
    : null;
}

export function dashboardPathForRole(role: UserRole): string {
  return role === "admin"
    ? "/dashboard/admin"
    : role === "owner"
      ? "/dashboard/owner"
      : "/dashboard/customer";
}
