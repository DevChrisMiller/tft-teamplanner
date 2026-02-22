import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Uses edge-safe config (no Prisma) for middleware.
export default NextAuth(authConfig).auth;

export const config = {
  // Match all paths except static assets and Next.js internals
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.avif|.*\\.webp|.*\\.svg).*)",
  ],
};
