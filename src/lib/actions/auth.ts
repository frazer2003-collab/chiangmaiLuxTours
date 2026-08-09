"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { hasStaffRole } from "@/lib/auth/staff-check";

export async function confirmStaffAccess(): Promise<{
  ok: boolean;
  reason?: "not_signed_in" | "not_staff";
}> {
  if (!isSupabaseConfigured()) {
    return { ok: false, reason: "not_staff" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, reason: "not_signed_in" };

  if (hasStaffRole(user)) return { ok: true };

  const { data: row } = await supabase
    .from("staff_emails")
    .select("email")
    .eq("email", user.email!.toLowerCase())
    .maybeSingle();

  if (row) return { ok: true };

  return { ok: false, reason: "not_staff" };
}
