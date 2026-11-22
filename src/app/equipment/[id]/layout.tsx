import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EquipmentDetailsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/equipment/${id}`)}`);
  }

  return children;
}
