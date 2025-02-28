import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";

interface Props {
  handleUpdateTeam: (unit: Unit, index: number) => void;
  currentTeam: (Unit | null)[];
  units: Unit[];
}

export default function NewTeamUnitOverview({
  handleUpdateTeam,
  currentTeam,
  units,
}: Props) {
  const groupedByCost = units.reduce<Record<number, Unit[]>>((result, unit) => {
    const key = unit.Cost;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(unit);
    return result;
  }, {});

  return (
    <div className="overflow-y-auto min-w-12 lg:w-fit lg:flex-shrink-0 no-scrollbar h-full">
      {Object.keys(groupedByCost)
        .sort((a, b) => Number(a) - Number(b))
        .map((key: string) => {
          return (
            <NewTeamUnitContainer
              units={groupedByCost[Number(key)]}
              handleUpdateTeam={handleUpdateTeam}
              currentTeam={currentTeam}
              key={key}
            />
          );
        })}
    </div>
  );
}
