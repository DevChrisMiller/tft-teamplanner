"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/react";

export default function MyTeamsError({
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
      <h2 className="text-lg font-semibold">Failed to load your teams</h2>
      <p className="text-neutral-400 text-sm">
        Something went wrong loading your saved teams.
      </p>
      <Button className="bg-neutral-800 text-white rounded-xl" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
