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
    <div className="flex items-center gap-2">
      <Button
        className="bg-neutral-800 h-8 rounded-2xl text-white"
        onClick={() => handleCreatingTeam(false)}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" /> Back
      </Button>

      <NewTeamNameInput value={teamName} onChange={handleUpdateTeamName} />

      {hasUnits && (
        <Button
          className="bg-blue-700 h-8 rounded-2xl text-white"
          onClick={handleSaveTeam}
          isLoading={isSaving}
          isDisabled={!teamName.trim()}
        >
          <FontAwesomeIcon icon={faSave} className="h-3 w-3" /> Save
        </Button>
      )}

      <div className="flex w-full justify-end h-min">
        <TeamCodeInput allUnits={allUnits} handleLoadTeam={handleLoadTeam} />
      </div>
    </div>
  );
}
