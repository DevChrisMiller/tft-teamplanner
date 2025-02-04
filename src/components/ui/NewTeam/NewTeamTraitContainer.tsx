import Image from "next/image";
import { Unit } from "@/d";
import { useState, useEffect } from "react";

interface Props {
  currentTeam: (Unit | null)[];
}

export default function NewTeamTraitContainer({ currentTeam }: Props) {
  // compare to trait breakpoints for background
  // put trait on top
  const [currentTraits, setCurrentTraits] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    const newTraits: Record<string, number> = {};

    currentTeam.forEach((unit) => {
      if (unit && unit.traits) {
        unit.traits.forEach((trait) => {
          newTraits[trait] = (newTraits[trait] || 0) + 1;
        });
      }
    });

    setCurrentTraits(newTraits);
  }, [currentTeam]);

  console.log("traits: ", currentTraits);

  const traitArray = Object.entries(currentTraits).map(([name, count]) => ({
    name,
    count,
  }));

  console.log("traitarray", traitArray);
  return (
    <>
      <div className="flex flex-col flex-shrink-0 min-w-32 h-full overflow-y-auto no-scrollbar">
        {currentTeam.some((u) => u !== null)
          ? traitArray.map((trait, i) => {
              return (
                <div key={i} className="flex items-center m-2">
                  <Image
                    className="mr-1"
                    src={`/traits/bronze_trait.avif`}
                    alt={trait.name}
                    height={12}
                    width={32}
                  />
                  <Image
                    src={`/traits/${trait.name.replaceAll(" ", "")}.png`}
                    alt={trait.name}
                    height={8}
                    width={24}
                    className="-ml-8 brightness-0"
                  />
                  <div className="flex flex-col text-xs ml-4 capitalize">
                    <span>{trait.name}</span>
                    <span className="text-neutral-400">{trait.count}/</span>
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
