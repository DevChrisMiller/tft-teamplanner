"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTeamButton({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this team?")) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/teams/${teamId}`, { method: "DELETE" });
      router.refresh();
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
