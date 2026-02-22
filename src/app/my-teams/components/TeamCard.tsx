"use client";

import Image from "next/image";
import { getBorderColor } from "@/utils/getBorderColor";
import type { Unit } from "@/d";
import DeleteTeamButton from "./DeleteTeamButton";
import ShareTeamButton from "./ShareTeamButton";

interface TeamUnit {
  id: string;
  teamId: string;
  unitId: string;
  slotIndex: number;
}

interface Team {
  id: string;
  name: string;
  isPublic: boolean;
  slug: string | null;
  setId: string;
  upvoteCount: number;
  createdAt: Date;
  updatedAt: Date;
  units: TeamUnit[];
}

interface Props {
  team: Team;
  unitMap: Map<string, Unit>;
}

export default function TeamCard({ team, unitMap }: Props) {
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
      <div className="flex items-center justify-between">
        <h2 className="font-semibold truncate">{team.name}</h2>
        <span className="text-xs text-neutral-500">{team.setId}</span>
      </div>

      {/* Unit icons */}
      <div className="flex flex-wrap gap-1">
        {filledUnits.map((unit, i) => (
          <div
            key={i}
            className={`w-10 h-10 relative rounded overflow-hidden border ${getBorderColor(unit.cost)}`}
          >
            <Image
              src={unit.imageUrl}
              alt={unit.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ))}
        {filledUnits.length === 0 && (
          <span className="text-neutral-500 text-sm">No units</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <ShareTeamButton teamId={team.id} currentSlug={team.slug} />
        <DeleteTeamButton teamId={team.id} />
      </div>
    </div>
  );
}
