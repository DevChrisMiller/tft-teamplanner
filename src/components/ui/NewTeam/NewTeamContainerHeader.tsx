import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import TeamCodeInput from "../Teams/TeamCodeInput";
import { faChevronLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import NewTeamNameInput from "./NewTeamNameInput";
import { Unit } from "@/d";

interface Props {
  handleCreatingTeam: (x: boolean) => void;
  teamName: string;
  handleUpdateTeamName: (name: string) => void;
  handleSaveTeam: () => void;
  isSaving: boolean;
  currentTeam: (Unit | null)[];
  allUnits: Unit[];
  handleLoadTeam: (team: (Unit | null)[]) => void;
}

export default function NewTeamContainerHeader({
  handleCreatingTeam,
  teamName,
  handleUpdateTeamName,
  handleSaveTeam,
  isSaving,
  currentTeam,
  allUnits,
  handleLoadTeam,
}: Props) {
  const hasUnits = currentTeam.some((u) => u !== null);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button
          className="bg-neutral-800 h-8 rounded-2xl text-white shrink-0"
          onClick={() => handleCreatingTeam(false)}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" /> Back
        </Button>

        <NewTeamNameInput value={teamName} onChange={handleUpdateTeamName} />
      </div>

      <div className="flex items-center gap-2">
        <Button
          className="bg-blue-700 h-8 rounded-2xl text-white"
          onClick={handleSaveTeam}
          isLoading={isSaving}
          isDisabled={!hasUnits || !teamName.trim()}
        >
          <FontAwesomeIcon icon={faSave} className="h-3 w-3" /> Save
        </Button>

        <div className="flex ml-auto sm:ml-0 h-min">
          <TeamCodeInput allUnits={allUnits} handleLoadTeam={handleLoadTeam} />
        </div>
      </div>
    </div>
  );
}
