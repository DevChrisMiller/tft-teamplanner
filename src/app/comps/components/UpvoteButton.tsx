"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  teamId: string;
  initialCount: number;
  initialHasUpvoted: boolean;
}

export default function UpvoteButton({
  teamId,
  initialCount,
  initialHasUpvoted,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Optimistic update
    const newHasUpvoted = !hasUpvoted;
    setHasUpvoted(newHasUpvoted);
    setCount((c) => c + (newHasUpvoted ? 1 : -1));

    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/upvote`, {
        method: newHasUpvoted ? "POST" : "DELETE",
      });
      if (!res.ok) {
        // Revert on failure
        setHasUpvoted(!newHasUpvoted);
        setCount((c) => c + (newHasUpvoted ? -1 : 1));
      }
    } catch {
      setHasUpvoted(!newHasUpvoted);
      setCount((c) => c + (newHasUpvoted ? -1 : 1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors
        ${
          hasUpvoted
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
        }
        disabled:opacity-50`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path d="M12 4l8 8H4l8-8z" />
      </svg>
      {count}
    </button>
  );
}
