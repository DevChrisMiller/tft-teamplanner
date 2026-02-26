"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function TeamError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <h2 className="text-lg font-semibold">Failed to load team</h2>
      <p className="text-neutral-400 text-sm">
        This team could not be loaded. It may have been removed or made private.
      </p>
      <div className="flex gap-2">
        <Button className="bg-neutral-800 text-white rounded-xl" onClick={reset}>
          Try again
        </Button>
        <Link href="/comps">
          <Button className="bg-neutral-800 text-white rounded-xl">
            Browse comps
          </Button>
        </Link>
      </div>
    </div>
  );
}
