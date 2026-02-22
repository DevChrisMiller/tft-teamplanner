import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TeamCodeInput from "./TeamCodeInput";
import type { Unit } from "@/d";

interface Props {
  handleCreatingTeam: (x: boolean) => void;
  allUnits: Unit[];
  handleLoadTeam: (team: (Unit | null)[]) => void;
}
export default function TeamsContainerHeader({ handleCreatingTeam, allUnits, handleLoadTeam }: Props) {
  return (
    <div className="flex flex-wrap gap-2 w-full justify-between">
      <h1 className="hidden md:block text-2xl font-bold w-fit">My Teams</h1>
      <div className="flex w-fit h-min">
        <TeamCodeInput allUnits={allUnits} handleLoadTeam={handleLoadTeam} />
        <Button
          className="bg-white h-8 rounded-2xl text-black"
          onClick={() => handleCreatingTeam(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" /> New Team
        </Button>
      </div>
    </div>
  );
}
