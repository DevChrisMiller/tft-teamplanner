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
    <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4 m-1 lg:m-2 flex-1 min-w-0 lg:h-full overflow-y-auto no-scrollbar">
      {currentTeam.map((unit, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-center min-w-0 h-28 lg:h-40 rounded-large bg-neutral-800"
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
