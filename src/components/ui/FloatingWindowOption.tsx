import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function FloatingWindowOption() {
  return (
    <div className="flex flex-col gap-4 p-4 text-center justify-center text-neutral-400">
      <p>or</p>
      <Button className="w-56 mx-auto bg-neutral-800" radius="full">
        <FontAwesomeIcon icon={faUpRightFromSquare} className="h-4 w-4" />
        <span>Open in floating window</span>
      </Button>
      <p className="text-xs">Stays on top of your game</p>
    </div>
  );
}
