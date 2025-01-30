import { Unit } from "@/d";
import UnitSmallDetail from "../Units/UnitSmallDetail";
import Image from "next/image";
import { Button } from "@nextui-org/react";

interface Props {
  units: Unit[];
  handleUpdateTeam: (unit: Unit, index: number) => void;
  currentTeam: (Unit | null)[];
}
export default function NewTeamUnitContainer({
  units,
  handleUpdateTeam,
  currentTeam,
}: Props) {
  const cost: number = units[1].cost;
  const numUnits: number = units.length;

  const getBgColorClass = (cost: number): string => {
    const colorMap: Record<number, string> = {
      1: "bg-neutral-600",
      2: "bg-green-800",
      3: "bg-cyan-800",
      4: "bg-fuchsia-800",
      5: "bg-yellow-600",
      6: "bg-purple-900",
    };
    return colorMap[cost] || "bg-white";
  };

  return (
    <>
      <div
        className={`${getBgColorClass(
          cost
        )} min-w-32 max-w-96 rounded-xl h-fit bg-opacity-40 flex flex-col p-2 mb-3 mr-2`}
      >
        <div className="flex flex-row m-2 justify-between items-center">
          <div className="flex flex-row items-center">
            <Image
              className="mr-2"
              src="/general/gold-icon.webp"
              alt="gold icon"
              height={12}
              width={20}
            />
            <span>{cost}</span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-xs text-neutral-400 hidden lg:block">
              {numUnits} units
            </span>
            <Button
              className="bg-neutral-600 rounded-2xl text-white h-6 hidden md:block"
              size="sm"
              onClick={() => {
                console.log("adding all units...");
              }}
            >
              Add All
            </Button>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-start">
          {units.map((unit) => {
            return (
              <UnitSmallDetail
                handleUpdateTeam={(unit) => {
                  const existingIndex = currentTeam.findIndex(
                    (slot) => slot?.id === unit.id
                  );

                  if (existingIndex !== -1) {
                    handleUpdateTeam(unit, existingIndex);
                  } else {
                    const firstEmptyIndex = currentTeam.findIndex(
                      (slot) => slot === null
                    );
                    if (firstEmptyIndex !== -1) {
                      handleUpdateTeam(unit, firstEmptyIndex);
                    }
                  }
                }}
                unit={unit}
                color={getBgColorClass(cost)}
                key={unit.name}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
