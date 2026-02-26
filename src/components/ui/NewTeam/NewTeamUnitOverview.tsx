import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";
import Image from "next/image";

interface Props {
  handleUpdateTeam: (unit: Unit, index: number) => void;
  currentTeam: (Unit | null)[];
  units: Unit[];
  sortByTrait: boolean;
}

export default function NewTeamUnitOverview({
  handleUpdateTeam,
  currentTeam,
  units,
  sortByTrait,
}: Props) {
  // Group units by cost (string keys keep the type uniform with groupedByTrait)
  const groupedByCost = units.reduce<Record<string, Unit[]>>((result, unit) => {
    const key = String(unit.cost);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(unit);
    return result;
  }, {});

  // Group units by trait
  const groupedByTrait = units.reduce<Record<string, Unit[]>>(
    (result, unit) => {
      if (unit.traits && unit.traits.length > 0) {
        unit.traits.forEach((trait) => {
          const key = trait.name;
          if (!result[key]) {
            result[key] = [];
          }
          result[key].push(unit);
        });
      }
      return result;
    },
    {}
  );

  // Sort by cost within trait group
  Object.keys(groupedByTrait).forEach((key) =>
    groupedByTrait[key].sort((a, b) => a.cost - b.cost)
  );

  const activeGrouping = sortByTrait ? groupedByTrait : groupedByCost;

  return (
    <div className="overflow-y-auto min-w-12 lg:w-96 lg:flex-shrink-0 no-scrollbar h-72 lg:h-full">
      {units.length ? (
        Object.keys(activeGrouping).map((key: string) => {
          return (
            <NewTeamUnitContainer
              units={activeGrouping[key]}
              handleUpdateTeam={handleUpdateTeam}
              currentTeam={currentTeam}
              groupKey={key}
              key={key}
              sortByTrait={sortByTrait}
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
