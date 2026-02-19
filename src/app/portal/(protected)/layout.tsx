import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProtectedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/portal/login");
  }

  if (session.user.status !== "approved") {
    redirect("/portal/pending");
  }

  return <>{children}</>;
}
