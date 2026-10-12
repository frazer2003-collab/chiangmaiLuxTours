import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Only the admin area has a Supabase session to refresh. Keeping the public
// marketing pages out of the matcher means a slow or paused Supabase project
// cannot time out the middleware and take the whole site down.
export const config = {
  matcher: ["/admin/:path*"],
};
