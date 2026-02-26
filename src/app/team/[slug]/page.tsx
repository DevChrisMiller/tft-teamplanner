import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { fetchUnits } from "@/lib/datadragon";
import Image from "next/image";
import { getBgColor } from "@/utils/getBgColor";
import { getBorderColor } from "@/utils/getBorderColor";
import type { Metadata } from "next";
import type { Unit, Trait } from "@/d";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await prisma.team.findUnique({ where: { slug, isPublic: true } });
  if (!team) return { title: "Team Not Found" };
  return {
    title: `${team.name} — TFT Team`,
    description: team.description ?? `View this TFT team composition: ${team.name}`,
  };
}

export default async function PublicTeamPage({ params }: PageProps) {
  const { slug } = await params;

  const team = await prisma.team.findUnique({
    where: { slug, isPublic: true },
    include: {
      units: { orderBy: { slotIndex: "asc" } },
      user: { select: { name: true, image: true } },
    },
  });

  if (!team) notFound();

  // Resolve unit details from CDragon
  const allUnits = await fetchUnits();
  const unitMap = new Map(allUnits.map((u) => [u.id, u]));

  const teamSlots: (Unit | null)[] = Array(10).fill(null);
  team.units.forEach((slot: { unitId: string; slotIndex: number }) => {
    const unit = unitMap.get(slot.unitId);
    if (unit && slot.slotIndex >= 0 && slot.slotIndex <= 9) {
      teamSlots[slot.slotIndex] = unit;
    }
  });

  const filledUnits = teamSlots.filter((u): u is Unit => u !== null);

  return (
    <main className="bg-neutral-900 rounded-3xl w-full p-6 mt-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {team.user?.image && (
          <Image
            src={team.user.image}
            alt={team.user.name ?? ""}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          {team.user?.name && (
            <p className="text-neutral-400 text-sm">by {team.user.name}</p>
          )}
        </div>
        <span className="ml-auto text-sm text-neutral-500">{team.setId}</span>
      </div>

      {/* Notes / description */}
      {team.description && (
        <div className="bg-neutral-800 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">
            Notes
          </p>
          <p className="text-sm text-neutral-200 whitespace-pre-wrap">{team.description}</p>
        </div>
      )}

      {/* Team grid */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {teamSlots.map((unit, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-lg bg-neutral-800 aspect-square"
          >
            {unit ? (
              <div
                className={`w-full h-full relative rounded-lg overflow-hidden border-medium ${getBorderColor(unit.cost)}`}
              >
                <Image
                  src={unit.imageUrl}
                  alt={unit.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <div
                  className={`absolute bottom-0 left-0 right-0 ${getBgColor(unit.cost)} bg-opacity-80 py-0.5`}
                >
                  <p className="text-xs text-center text-white truncate px-0.5">
                    {unit.name}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-neutral-600 text-sm">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      {/* Traits summary */}
      {filledUnits.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-neutral-400 mb-2 uppercase tracking-wide">
            Traits
          </h2>
          <TraitList units={filledUnits} />
        </div>
      )}
    </main>
  );
}

function getTraitLevel(trait: Trait, count: number) {
  const maxBreakpoint =
    trait.breakpoints.length > 0
      ? trait.breakpoints[trait.breakpoints.length - 1].count
      : 0;

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

  return { level: 0, nextBreakpoint: maxBreakpoint, bgImage: trait.defaultBg };
}

function TraitList({ units }: { units: Unit[] }) {
  const traitMap: Record<string, { count: number; trait: Trait }> = {};
  units.flatMap((u) => u.traits).forEach((trait) => {
    if (!traitMap[trait.name]) traitMap[trait.name] = { count: 0, trait };
    traitMap[trait.name].count += 1;
  });

  const traitArray = Object.entries(traitMap)
    .map(([name, { count, trait }]) => {
      const { level, nextBreakpoint, bgImage } = getTraitLevel(trait, count);
      return { name, count, level, nextBreakpoint, imageUrl: trait.imageUrl, bgImage };
    })
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.count - a.count;
    });

  return (
    <div className="flex flex-wrap gap-3">
      {traitArray.map((trait) => (
        <div key={trait.name} className="flex items-center gap-1">
          <Image
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
      ))}
    </div>
  );
}
