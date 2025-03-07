import { Unit } from "@/d";
import UnitLarge from "../Units/UnitLarge";

interface Props {
  currentTeam: (Unit | null)[];
  handleUpdateTeam: (unit: Unit, index: number) => void;
}

export default function NewTeamContainer({
  currentTeam,
  handleUpdateTeam,
}: Props) {
  return (
    <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-3 gap-4 m-2 w-full h-full overflow-y-auto no-scrollbar">
      {currentTeam.map((unit, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-center w-26 h-40 rounded-large bg-neutral-800"
          >
            {unit ? (
              <UnitLarge
                unit={unit}
                handleUpdateTeam={handleUpdateTeam}
                index={i}
              />
            ) : (
              <span className="text-neutral-600">{i + 1}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
