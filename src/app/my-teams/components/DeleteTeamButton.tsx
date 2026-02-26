"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  teamId: string;
  onSuccess?: () => void;
}

export default function DeleteTeamButton({ teamId, onSuccess }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`/api/teams/${teamId}`, { method: "DELETE" });
      onClose();
      router.refresh();
      onSuccess?.();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        color="danger"
        onClick={onOpen}
        className="h-7"
      >
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader className="text-white">Delete team?</ModalHeader>
          <ModalBody>
            <p className="text-neutral-400 text-sm">
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose} className="h-8">
              Cancel
            </Button>
            <Button
              color="danger"
              variant="flat"
              isLoading={isDeleting}
              onPress={handleDelete}
              className="h-8"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
