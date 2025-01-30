import { UnitsArray } from "@/utils/units";
import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";
import { group } from "console";

interface Props {
  handleUpdateTeam: (unit: Unit, index: number) => void;
  currentTeam: (Unit | null)[];
}

export default function NewTeamUnitOverview({
  handleUpdateTeam,
  currentTeam,
}: Props) {
  const groupedByCost = UnitsArray.reduce<Record<number, Unit[]>>(
    (result, unit) => {
      const key = unit.cost;
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(unit);
      return result;
    },
    {}
  );

  return (
    <div className="overflow-y-auto min-w-12 lg:w-fit lg:flex-shrink-0 no-scrollbar h-full">
      {Object.keys(groupedByCost).map((key: string) => {
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
