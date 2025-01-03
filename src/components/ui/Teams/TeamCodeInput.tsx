import { Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

export default function TeamCodeInput() {
  return (
    <Input
      type="text"
      placeholder="Paste Team Code"
      size="sm"
      radius="lg"
      color="default"
      className="w-64 mr-2"
      startContent={
        <FontAwesomeIcon icon={faClipboard} className="text-neutral-400 mx-1" />
      }
    />
  );
}
