import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardRole("customer");
  return <DashboardShell role="customer">{children}</DashboardShell>;
}
