"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  teamId: string;
  currentSlug: string | null;
  onSuccess?: () => void;
}

export default function ShareTeamButton({ teamId, currentSlug, onSuccess }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/share`, { method: "POST" });
      if (!res.ok) return;
      const { slug } = await res.json();
      const url = `${window.location.origin}/team/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      router.refresh();
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!currentSlug) return;
    const url = `${window.location.origin}/team/${currentSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnshare = async () => {
    if (!confirm("Make this team private?")) return;
    setIsLoading(true);
    try {
      await fetch(`/api/teams/${teamId}/share`, { method: "DELETE" });
      router.refresh();
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  if (currentSlug) {
    return (
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="flat"
          color="success"
          isLoading={isLoading}
          onClick={handleCopyLink}
          className="h-7"
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="default"
          isLoading={isLoading}
          onClick={handleUnshare}
          className="h-7"
        >
          Unshare
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="flat"
      color="primary"
      isLoading={isLoading}
      onClick={handleShare}
      className="h-7"
    >
      {copied ? "Link Copied!" : "Share"}
    </Button>
  );
}
