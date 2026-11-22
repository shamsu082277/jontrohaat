import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types";
import { getAuth } from "@/lib/auth";
import { dashboardPathForRole, getUserRole } from "@/lib/roles";

export async function requireDashboardRole(requiredRole: UserRole) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(dashboardPathForRole(requiredRole))}`
    );
  }

  const role = getUserRole(session.user);
  if (!role) {
    redirect("/login");
  }

  if (role !== requiredRole) {
    redirect(dashboardPathForRole(role));
  }
}
