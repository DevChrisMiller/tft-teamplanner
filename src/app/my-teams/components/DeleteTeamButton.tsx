"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  teamId: string;
  onSuccess?: () => void;
}

export default function DeleteTeamButton({ teamId, onSuccess }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this team?")) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/teams/${teamId}`, { method: "DELETE" });
      router.refresh();
      onSuccess?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="flat"
      color="danger"
      isLoading={isDeleting}
      onClick={handleDelete}
      className="h-7"
    >
      Delete
    </Button>
  );
}
