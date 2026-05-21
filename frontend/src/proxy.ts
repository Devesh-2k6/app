import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * No login/signup gate — home page role buttons enter customer or shopkeeper flows directly.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/shop/:path*", "/profile/:path*", "/deals/:path*", "/map/:path*"],
};
