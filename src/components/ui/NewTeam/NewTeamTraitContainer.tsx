import Image from "next/image";
import { Unit, Trait } from "@/d";
import { useState, useEffect } from "react";

interface Props {
  currentTeam: (Unit | null)[];
}

export default function NewTeamTraitContainer({ currentTeam }: Props) {
  const [currentTraits, setCurrentTraits] = useState<
    Record<string, { count: number; trait: Trait }>
  >({});

  useEffect(() => {
    const newTraits: Record<string, { count: number; trait: Trait }> = {};

    currentTeam.forEach((unit) => {
      if (unit && unit.traits) {
        unit.traits.forEach((trait) => {
          const traitName = trait.name;
          if (!newTraits[traitName]) {
            newTraits[traitName] = { count: 0, trait };
          }
          newTraits[traitName].count += 1;
        });
      }
    });
    setCurrentTraits(newTraits);
  }, [currentTeam]);

  const getTraitLevel = (trait: Trait, count: number) => {
    const maxBreakpoint =
      trait.breakpoints.length > 0
        ? trait.breakpoints[trait.breakpoints.length - 1].count
        : 0;

    // Walk breakpoints in descending order to find the highest active tier
    const activeBreakpoint = [...trait.breakpoints]
      .reverse()
      .find((bp) => count >= bp.count);

    if (activeBreakpoint) {
      return {
        level: activeBreakpoint.level,
        nextBreakpoint: maxBreakpoint,
        bgImage: activeBreakpoint.bgImage,
      };
    }

    return {
      level: 0,
      nextBreakpoint: maxBreakpoint,
      bgImage: trait.defaultBg,
    };
  };

  const traitArray = Object.entries(currentTraits)
    .map(([name, { count, trait }]) => {
      const { level, nextBreakpoint, bgImage } = getTraitLevel(trait, count);
      return {
        name,
        count,
        level,
        nextBreakpoint,
        imageUrl: trait.imageUrl,
        bgImage,
      };
    })
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.count - a.count;
    });

  return (
    <>
      <div className="flex flex-col flex-shrink-0 min-w-32 h-full overflow-y-auto no-scrollbar">
        {currentTeam.some((u) => u !== null) && traitArray.length > 0
          ? traitArray.map((trait, i) => {
              return (
                <div key={i} className="flex items-center m-2">
                  <Image
                    className="mr-1"
                    src={`/traits/${trait.bgImage}`}
                    alt={trait.name}
                    height={32}
                    width={32}
                  />
                  <Image
                    src={trait.imageUrl}
                    alt={trait.name}
                    height={24}
                    width={24}
                    className={`-ml-8 ${trait.level > 0 ? "brightness-0" : ""}`}
                  />
                  <div className="flex flex-col text-xs ml-4 capitalize">
                    <span>{trait.name}</span>
                    <span className="text-neutral-400">
                      {trait.count}/{trait.nextBreakpoint || trait.count}
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
                    height={32}
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
