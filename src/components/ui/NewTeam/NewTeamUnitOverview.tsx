import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";
import Image from "next/image";

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
    <div className="overflow-y-auto min-w-12 lg:w-96 lg:flex-shrink-0 no-scrollbar h-full">
      {units.length ? (
        Object.keys(groupedByCost)
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
          })
      ) : (
        <div className="flex flex-col items-center justify-center h-full opacity-70 text-center">
          <Image src="/penguin-icon.png" alt="pengu" height={128} width={128} />
          <p className="sm:w-fit lg:w-56">
            No results. Try searching for something else.
          </p>
        </div>
      )}
    </div>
  );
}
