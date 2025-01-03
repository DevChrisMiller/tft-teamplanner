import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@nextui-org/react";
import { useState } from "react";

export default function NewTeamOptions() {
  const [isTraitFilter, setIsTraitFilter] = useState(false);

  return (
    <div className="flex gap-4">
      <Input
        type="text"
        placeholder="Search..."
        size="sm"
        radius="lg"
        color="default"
        className="w-96 mr-2"
        onChange={() => {
          console.log("searching...");
        }}
        startContent={
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-neutral-400 mx-1"
          />
        }
      />
      <Switch
        color="default"
        size="lg"
        isSelected={isTraitFilter}
        onValueChange={setIsTraitFilter}
        thumbIcon={({ isSelected }) =>
          isSelected ? (
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
          ) : (
            <Image
              src="/general/gold-icon.webp"
              alt="gold icon"
              height={20}
              width={20}
            />
          )
        }
      />
      <Button
        className="bg-neutral-800 h-8 rounded-2xl text-white"
        onClick={() => {
          console.log("copying team code...");
        }}
      >
        <FontAwesomeIcon icon={faCopy} className="h-3 w-3" /> Copy Team Code
      </Button>

      <Button
        className="bg-neutral-800 h-8 rounded-2xl text-white hover:bg-red-900"
        onClick={() => {
          console.log("clearing team...");
        }}
      >
        <FontAwesomeIcon icon={faX} className="h-3 w-3" /> Clear
      </Button>
    </div>
  );
}
