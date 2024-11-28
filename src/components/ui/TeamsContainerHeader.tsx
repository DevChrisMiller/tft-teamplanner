import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";

export default function TeamsContainerHeader() {
  return (
    <div className="flex">
      <h1 className="text-2xl font-bold w-full">My Teams</h1>
      <div className="flex w-full justify-end h-min">
        <Input
          type="text"
          placeholder="Paste Team Code"
          size="sm"
          radius="lg"
          color="default"
          className="w-64 mr-2"
          startContent={
            <FontAwesomeIcon
              icon={faClipboard}
              className="text-neutral-400 mx-1"
            />
          }
        />
        <Button className="bg-white h-8 rounded-2xl text-black">
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" /> New Team
        </Button>
      </div>
    </div>
  );
}
