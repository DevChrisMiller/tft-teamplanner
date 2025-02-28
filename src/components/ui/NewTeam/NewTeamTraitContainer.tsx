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
      if (unit && unit.Traits) {
        unit.Traits.forEach((trait) => {
          const traitName = trait.Name;
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
    // Find the maximum breakpoint for this trait
    const maxBreakpoint =
      trait.BreakPoint4Count ||
      trait.BreakPoint3Count ||
      trait.BreakPoint2Count ||
      trait.BreakPoint1Count ||
      0;

    // Check each breakpoint level in descending order
    if (trait.BreakPoint4Count && count >= trait.BreakPoint4Count) {
      return {
        level: trait.BreakPoint4Level,
        nextBreakpoint: maxBreakpoint,
        bgImage: trait.BreakPoint4LevelBG,
      };
    } else if (trait.BreakPoint3Count && count >= trait.BreakPoint3Count) {
      return {
        level: trait.BreakPoint3Level,
        nextBreakpoint: maxBreakpoint,
        bgImage: trait.BreakPoint3LevelBG,
      };
    } else if (trait.BreakPoint2Count && count >= trait.BreakPoint2Count) {
      return {
        level: trait.BreakPoint2Level,
        nextBreakpoint: maxBreakpoint,
        bgImage: trait.BreakPoint2LevelBG,
      };
    } else if (trait.BreakPoint1Count && count >= trait.BreakPoint1Count) {
      return {
        level: trait.BreakPoint1Level,
        nextBreakpoint: maxBreakpoint,
        bgImage: trait.BreakPoint1LevelBG,
      };
    } else {
      return {
        level: 0,
        nextBreakpoint: maxBreakpoint,
        bgImage: trait.DefaultBG,
      };
    }
  };

  const traitArray = Object.entries(currentTraits)
    .map(([name, { count, trait }]) => {
      const { level, nextBreakpoint, bgImage } = getTraitLevel(trait, count);
      return {
        name,
        count,
        level,
        nextBreakpoint,
        imageSource: trait.ImageSource,
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
                    height={12}
                    width={32}
                  />
                  <Image
                    src={`/traits/${trait.imageSource}`}
                    alt={trait.name}
                    height={8}
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
