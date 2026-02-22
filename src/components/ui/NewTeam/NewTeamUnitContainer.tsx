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
  const cost: number = units[0]?.cost || 1;
  const numUnits: number = units.length;

  // When grouped by trait, show that trait's icon; otherwise show the gold coin icon.
  const traitIconUrl = sortByTrait
    ? units[0].traits.find((trait) => trait.name === groupKey)?.imageUrl
    : null;
  const groupingIconImg = traitIconUrl ?? "/general/gold-icon.webp";

  const handleAddAll = () => {
    // Collect all currently empty slot indices first, then fill them in order.
    const emptySlots = currentTeam
      .map((slot, i) => (slot === null ? i : -1))
      .filter((i) => i !== -1);

    // Skip units already in the team to avoid duplicates.
    const unitsToAdd = units.filter(
      (unit) => !currentTeam.some((slot) => slot?.id === unit.id)
    );

    unitsToAdd.forEach((unit, i) => {
      if (i < emptySlots.length) {
        handleUpdateTeam(unit, emptySlots[i]);
      }
    });
  };

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
              src={groupingIconImg}
              alt="grouping icon"
              height={12}
              width={20}
              unoptimized={groupingIconImg.startsWith("https")}
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
              onClick={handleAddAll}
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
                    // Unit is already in team — clicking it removes it
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
                key={unit.name}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
