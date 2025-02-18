import Image from "next/image";
import { Unit } from "@/d";
import { TraitsArray } from "@/utils/traits";
import { useState, useEffect } from "react";

interface Props {
  currentTeam: (Unit | null)[];
}

const getTraitLevel = (traitName: string, count: number) => {
  const traitData = TraitsArray.find(
    (trait) => trait.name.toLowerCase() === traitName.toLowerCase()
  );

  if (!traitData) return { level: 0, nextBreakpoint: null };

  // Sort breakpoints by numUnits in descending order to check highest achieved level first
  const sortedBreakpoints = [...traitData.breakpoints].sort(
    (a, b) => b.numUnits - a.numUnits
  );

  // Find the highest achieved breakpoint
  const achievedBreakpoint = sortedBreakpoints.find(
    (breakpoint) => count >= breakpoint.numUnits
  );

  // Find the next breakpoint
  const nextBreakpoint = sortedBreakpoints
    .reverse()
    .find((breakpoint) => count <= breakpoint.numUnits);

  console.log(traitData, nextBreakpoint);
  return {
    level: achievedBreakpoint?.level || 0,
    nextBreakpoint: nextBreakpoint?.numUnits || null,
  };
};

const getTraitImage = (level: number) => {
  switch (level) {
    case 1:
      return "bronze_trait.avif";
    case 2:
      return "silver_trait.avif";
    case 3:
      return "gold_trait.avif";
    case 5:
      return "unique_trait.avif";
    default:
      return "empty_trait.avif";
  }
};

export default function NewTeamTraitContainer({ currentTeam }: Props) {
  // compare to trait breakpoints for background
  // put trait on top
  const [currentTraits, setCurrentTraits] = useState<Record<string, number>>(
    {}
  );

  // useEffect(() => {
  //   const newTraits: Record<string, number> = {};

  //   currentTeam.forEach((unit) => {
  //     if (unit && unit.traits) {
  //       unit.traits.forEach((trait) => {
  //         newTraits[trait] = (newTraits[trait] || 0) + 1;
  //       });
  //     }
  //   });
  //   setCurrentTraits(newTraits);
  // }, [currentTeam]);

  const traitArray = Object.entries(currentTraits)
    .map(([name, count]) => {
      const { level, nextBreakpoint } = getTraitLevel(name, count);
      return {
        name,
        count,
        level,
        nextBreakpoint,
      };
    })
    .sort((a, b) => b.level - a.level);

  console.log("traitarray", traitArray);
  return (
    <>
      <div className="flex flex-col flex-shrink-0 min-w-32 h-full overflow-y-auto no-scrollbar">
        {currentTeam.some((u) => u !== null)
          ? traitArray.map((trait, i) => {
              const traitImage = getTraitImage(trait.level);
              return (
                <div key={i} className="flex items-center m-2">
                  <Image
                    className="mr-1"
                    src={`/traits/${traitImage}`}
                    alt={trait.name}
                    height={12}
                    width={32}
                  />
                  <Image
                    src={`/traits/${trait.name.replaceAll(" ", "")}.png`}
                    alt={trait.name}
                    height={8}
                    width={24}
                    className={`-ml-8 ${trait.level > 0 ? "brightness-0" : ""}`}
                  />
                  <div className="flex flex-col text-xs ml-4 capitalize">
                    <span>{trait.name}</span>
                    <span className="text-neutral-400">
                      {trait.count}
                      {trait.nextBreakpoint
                        ? `/${trait.nextBreakpoint}`
                        : " (Max)"}
                    </span>
                  </div>
                </div>
              );
            })
          : currentTeam.map((u, i) => {
              return (
                <div className="flex flex-row m-2" key={i}>
                  <Image
                    className="mr-1"
                    src="/traits/empty_trait.avif"
                    alt="empty trait"
                    height={12}
                    width={32}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="w-16 h-4 rounded-sm bg-neutral-800"></div>
                    <div className="w-8 h-4 rounded-sm bg-neutral-800"></div>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}
