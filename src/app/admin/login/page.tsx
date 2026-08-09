import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminShell";
import { getStaffSession } from "@/lib/auth/staff";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getStaffSession();
  if (session.user && session.isStaff) {
    redirect("/admin");
  }

  return <AdminLoginForm configured={isSupabaseConfigured()} />;
}
