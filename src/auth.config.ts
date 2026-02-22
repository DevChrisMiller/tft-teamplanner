import type { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";

// Edge-safe config — no Prisma imports, used by middleware.ts.
export const authConfig: NextAuthConfig = {
  providers: [Discord],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/my-teams");
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      return true;
    },
  },
};
