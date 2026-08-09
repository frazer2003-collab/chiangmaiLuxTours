import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function getStaffSession() {
  if (!isSupabaseConfigured()) {
    return { supabase: null, user: null, isStaff: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, isStaff: false };

  const role = user.app_metadata?.role;
  return {
    supabase,
    user,
    isStaff: role === "staff",
  };
}

export async function requireStaff() {
  const session = await getStaffSession();
  if (!session.user || !session.isStaff) {
    throw new Error("Unauthorized");
  }
  return session;
}
