import { Unit } from "@/d";
import UnitSmallDetail from "../Units/UnitSmallDetail";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { getBgColor } from "@/utils/getBgColor";

interface Props {
  units: Unit[];
  handleUpdateTeam: (unit: Unit, index: number) => void;
  currentTeam: (Unit | null)[];
  sortByTrait: boolean;
  groupKey: number | string;
}
export default function NewTeamUnitContainer({
  units,
  handleUpdateTeam,
  currentTeam,
  sortByTrait,
  groupKey,
}: Props) {
  const cost: number = units[0]?.Cost || 1;
  const numUnits: number = units.length;
  const groupingIconImg = sortByTrait
    ? "/traits/" +
      units[0].Traits?.find((trait) => trait.Name == groupKey)?.ImageSource
    : "/general/gold-icon.webp";

  return (
    <>
      <div
        className={`${
          sortByTrait ? "bg-neutral-600" : getBgColor(cost)
        } min-w-32 max-w-96 rounded-xl h-fit bg-opacity-40 flex flex-col p-0.5 mb-3 mr-2`}
      >
        <div className="flex flex-row m-2 justify-between items-center">
          <div className="flex flex-row items-center">
            <Image
              className="mr-2"
              src={`${groupingIconImg}`}
              alt="grouping icon"
              height={12}
              width={20}
            />
            <span>{groupKey}</span>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <span className="text-xs text-neutral-400 hidden lg:block">
              {numUnits} units
            </span>
            <Button
              className={`${
                sortByTrait ? "bg-neutral-600" : getBgColor(cost)
              } bg-opacity-75 rounded-2xl text-white h-6 hidden md:block`}
              size="sm"
              onClick={() => {
                console.log("adding all units...");
                units.forEach((unit, i) => {
                  const firstEmptyIndex = currentTeam.findIndex(
                    (slot) => slot === null
                  );
                  handleUpdateTeam(unit, firstEmptyIndex + i);
                });
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
                    (slot) => slot?.ID === unit.ID
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
                cost={cost}
                unit={unit}
                key={unit.Name}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
