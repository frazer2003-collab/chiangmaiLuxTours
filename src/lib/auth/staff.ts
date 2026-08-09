import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { hasStaffRole } from "@/lib/auth/staff-check";

export async function getStaffSession() {
  if (!isSupabaseConfigured()) {
    return { supabase: null, user: null, isStaff: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isStaff: false };

  if (hasStaffRole(user)) {
    return { supabase, user, isStaff: true };
  }

  const { data: row } = await supabase
    .from("staff_emails")
    .select("email")
    .eq("email", user.email!.toLowerCase())
    .maybeSingle();

  return {
    supabase,
    user,
    isStaff: Boolean(row),
  };
}

export async function requireStaff() {
  const session = await getStaffSession();
  if (!session.user || !session.isStaff) {
    throw new Error("Unauthorized");
  }
  return session;
}
