"use client";

import { Chip, Button, Avatar } from "@nextui-org/react";
import TFTPlannerLogo from "./TFTPlannerLogo";
import TwitterLink from "./TwitterLink";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex w-full justify-between max-w-7xl px-8 py-2 mx-auto">
      <div className="flex items-center gap-2">
        <TFTPlannerLogo />
        <h1 className="font-bold text-xl">tftuler</h1>
        <Chip variant="flat" size="sm" className="bg-blue-600/20 text-blue-500">
          Alpha
        </Chip>
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Link
              href="/my-teams"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              My Teams
            </Link>
            <Link
              href="/comps"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Community
            </Link>
            <Avatar
              src={session.user?.image ?? undefined}
              name={session.user?.name ?? ""}
              size="sm"
              className="cursor-pointer"
            />
            <Button
              size="sm"
              variant="flat"
              className="text-neutral-300"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <TwitterLink />
            <Button
              size="sm"
              className="bg-[#5865F2] text-white"
              onClick={() => signIn("discord")}
            >
              Sign in
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
