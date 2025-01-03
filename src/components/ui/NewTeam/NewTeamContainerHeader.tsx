import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import TeamCodeInput from "../Teams/TeamCodeInput";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import NewTeamNameInput from "./NewTeamNameInput";

interface Props {
  handleCreatingTeam: (x: boolean) => void;
}
export default function NewTeamContainerHeader({ handleCreatingTeam }: Props) {
  return (
    <div className="flex">
      <Button
        className="bg-neutral-800 h-8 rounded-2xl text-white"
        onClick={() => handleCreatingTeam(false)}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" /> Back
      </Button>
      <NewTeamNameInput />
      <div className="flex w-full justify-end h-min">
        <TeamCodeInput />
      </div>
    </div>
  );
}
