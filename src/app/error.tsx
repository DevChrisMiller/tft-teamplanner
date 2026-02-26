"use client";

import { useEffect } from "react";
import { Button } from "@nextui-org/react";

export default function GlobalError({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-neutral-400 text-sm max-w-sm">
        An unexpected error occurred. Try again or refresh the page.
      </p>
      <Button className="bg-neutral-800 text-white rounded-xl" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
