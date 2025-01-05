import { UnitsArray } from "@/utils/units";
import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";
import { group } from "console";

export default function NewTeamUnitOverview() {
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
    <div className="h-[50vh] overflow-auto w-fit no-scrollbar">
      {Object.keys(groupedByCost).map((key: string) => {
        return (
          <NewTeamUnitContainer units={groupedByCost[Number(key)]} key={key} />
        );
      })}
    </div>
  );
}
