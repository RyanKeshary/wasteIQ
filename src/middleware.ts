/**
 * WasteIQ — Route Protection Middleware
 * Uses next-auth's built-in auth() middleware helper.
 * For Prisma-dependent auth, we use a lightweight JWT check instead.
 *
 * Routes:
 *   /admin/* → requires ADMIN or SUPER_ADMIN role
 *   /driver/* → requires DRIVER role
 *   /citizen/* → requires CITIZEN role
 *
 * Currently: auth is disabled (middleware passes through)
 * because Prisma v7 requires Node.js runtime, not Edge.
 * Auth enforcement is handled at the page/API level instead.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // For now, all routes pass through.
  // Auth is enforced at the component level via getServerSession().
  // TODO: Once next-auth v5 stabilizes Edge-compatible JWT verification,
  // re-enable middleware-level route protection here.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/driver/:path*', '/citizen/:path*'],
};
