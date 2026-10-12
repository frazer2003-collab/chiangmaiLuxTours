import { NextResponse, type NextRequest } from "next/server";
import { getCanonicalRedirectUrl } from "@/lib/canonical-host";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const redirectUrl = getCanonicalRedirectUrl(
    request.url,
    request.headers.get("host"),
  );
  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/webhooks/stripe",
    "/((?!_next/static|_next/image|favicon.ico|apple-icon.png|icon.png|.*\\..*).*)",
  ],
};
