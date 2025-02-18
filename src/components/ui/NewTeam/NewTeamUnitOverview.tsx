import { UnitsArray } from "@/utils/units";
import NewTeamUnitContainer from "./NewTeamUnitContainer";
import { Unit } from "@/d";
import { group } from "console";
import { useState, useEffect } from "react";

interface Props {
  handleUpdateTeam: (unit: Unit, index: number) => void;
  currentTeam: (Unit | null)[];
}

export default function NewTeamUnitOverview({
  handleUpdateTeam,
  currentTeam,
}: Props) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch("/api/getUnits");
        if (!response.ok) {
          throw new Error("Failed to fetch units");
        }
        const data = await response.json();
        setUnits(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch units");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnits();
  }, []); // Empty dependency array since we only want to fetch once

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading units...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

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
