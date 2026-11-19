import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="owner">{children}</DashboardShell>;
}
