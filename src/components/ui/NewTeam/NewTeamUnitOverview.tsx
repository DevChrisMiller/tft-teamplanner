import { UnitsArray } from "@/utils/units";
import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";
import { group } from "console";

interface Props {
  handleUpdateTeam: (x: Unit) => void;
}

export default function NewTeamUnitOverview({ handleUpdateTeam }: Props) {
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
    <div className="h-[75vh] md:h-[60vh] lg:h-[50vh] overflow-auto min-w-12 lg:w-fit lg:flex-shrink-0 no-scrollbar">
      {Object.keys(groupedByCost).map((key: string) => {
        return (
          <NewTeamUnitContainer
            units={groupedByCost[Number(key)]}
            handleUpdateTeam={handleUpdateTeam}
            key={key}
          />
        );
      })}
    </div>
  );
}
