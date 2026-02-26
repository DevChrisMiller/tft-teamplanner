import Image from "next/image";
import { Unit, Trait } from "@/d";
import { useState, useEffect } from "react";

interface Props {
  currentTeam: (Unit | null)[];
}

function tierBg(level: number): string {
  if (level >= 5) return "bg-orange-500";  // unique/legendary
  if (level >= 4) return "bg-purple-700";  // prismatic
  if (level >= 3) return "bg-yellow-500";  // gold
  if (level >= 2) return "bg-slate-400";   // silver
  if (level >= 1) return "bg-amber-700";   // bronze
  return "bg-neutral-700";
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

    const activeBreakpoint = [...trait.breakpoints]
      .reverse()
      .find((bp) => count >= bp.count);

    if (activeBreakpoint) {
      return { level: activeBreakpoint.level, nextBreakpoint: maxBreakpoint };
    }

    return { level: 0, nextBreakpoint: maxBreakpoint };
  };

  const traitArray = Object.entries(currentTraits)
    .map(([name, { count, trait }]) => {
      const { level, nextBreakpoint } = getTraitLevel(trait, count);
      return { name, count, level, nextBreakpoint, imageUrl: trait.imageUrl };
    })
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.count - a.count;
    });

  return (
    <>
      <div className="flex flex-col flex-shrink-0 min-w-32 h-full overflow-y-auto no-scrollbar">
        {currentTeam.some((u) => u !== null) && traitArray.length > 0
          ? traitArray.map((trait, i) => (
              <div key={i} className="flex items-center m-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded shrink-0 ${tierBg(trait.level)}`}
                >
                  <Image
                    src={trait.imageUrl}
                    alt={trait.name}
                    height={20}
                    width={20}
                    className={trait.level > 0 ? "brightness-0" : "opacity-50"}
                  />
                </div>
                <div className="flex flex-col text-xs ml-2 capitalize">
                  <span>{trait.name}</span>
                  <span className="text-neutral-400">
                    {trait.count}/{trait.nextBreakpoint || trait.count}
                  </span>
                </div>
              </div>
            ))
          : currentTeam.map((_, i) => (
              <div className="flex flex-row m-2 gap-2" key={i}>
                <div className="w-8 h-8 rounded bg-neutral-700 shrink-0" />
                <div className="flex flex-col gap-1">
                  <div className="w-16 h-4 rounded-sm bg-neutral-800" />
                  <div className="w-8 h-4 rounded-sm bg-neutral-800" />
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
