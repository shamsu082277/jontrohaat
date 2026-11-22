import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardRole("admin");
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
