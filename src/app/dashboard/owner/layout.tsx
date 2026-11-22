import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardRole("owner");
  return <DashboardShell role="owner">{children}</DashboardShell>;
}
