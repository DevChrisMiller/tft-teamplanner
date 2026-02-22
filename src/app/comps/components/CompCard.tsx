import Image from "next/image";
import Link from "next/link";
import { getBorderColor } from "@/utils/getBorderColor";
import type { Unit } from "@/d";
import UpvoteButton from "./UpvoteButton";

interface TeamUnit {
  id: string;
  teamId: string;
  unitId: string;
  slotIndex: number;
}

interface TeamAuthor {
  name: string | null;
  image: string | null;
}

export interface CompTeam {
  id: string;
  name: string;
  slug: string | null;
  setId: string;
  upvoteCount: number;
  createdAt: Date | string;
  units: TeamUnit[];
  user: TeamAuthor;
  hasUpvoted: boolean;
}

interface Props {
  team: CompTeam;
  unitMap: Map<string, Unit>;
}

export default function CompCard({ team, unitMap }: Props) {
  const slots: (Unit | null)[] = Array(10).fill(null);
  team.units.forEach((slot) => {
    const unit = unitMap.get(slot.unitId);
    if (unit && slot.slotIndex >= 0 && slot.slotIndex <= 9) {
      slots[slot.slotIndex] = unit;
    }
  });

  const filledUnits = slots.filter((u): u is Unit => u !== null);

  return (
    <div className="bg-neutral-900 rounded-2xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {team.slug ? (
            <Link
              href={`/team/${team.slug}`}
              className="font-semibold truncate block hover:text-blue-400 transition-colors"
            >
              {team.name}
            </Link>
          ) : (
            <span className="font-semibold truncate block">{team.name}</span>
          )}
          <div className="flex items-center gap-1.5 mt-0.5">
            {team.user.image && (
              <Image
                src={team.user.image}
                alt={team.user.name ?? ""}
                width={16}
                height={16}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-neutral-500">
              {team.user.name ?? "Anonymous"}
            </span>
          </div>
        </div>
        <span className="text-xs text-neutral-500 shrink-0">{team.setId}</span>
      </div>

      {/* Unit icons */}
      <div className="flex flex-wrap gap-1">
        {filledUnits.map((unit, i) => (
          <div
            key={i}
            className={`w-9 h-9 relative rounded overflow-hidden border ${getBorderColor(unit.cost)}`}
          >
            <Image
              src={unit.imageUrl}
              alt={unit.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
        ))}
        {filledUnits.length === 0 && (
          <span className="text-neutral-500 text-sm">No units</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <UpvoteButton
          teamId={team.id}
          initialCount={team.upvoteCount}
          initialHasUpvoted={team.hasUpvoted}
        />
        {team.slug && (
          <Link
            href={`/team/${team.slug}`}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            View →
          </Link>
        )}
      </div>
    </div>
  );
}
