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
  createdAt: Date | string;
  updatedAt: Date | string;
  units: TeamUnit[];
}

interface Props {
  team: Team;
  unitMap: Map<string, Unit>;
  onMutated?: () => void;
  onEdit?: (teamId: string, name: string, units: (Unit | null)[]) => void;
}

export default function TeamCard({ team, unitMap, onMutated, onEdit }: Props) {
  const slots: (Unit | null)[] = Array(10).fill(null);
  team.units.forEach((slot) => {
    const unit = unitMap.get(slot.unitId);
    if (unit && slot.slotIndex >= 0 && slot.slotIndex <= 9) {
      slots[slot.slotIndex] = unit;
    }
  });

  const filledUnits = slots.filter((u): u is Unit => u !== null);

  return (
    <div className="bg-neutral-800 rounded-2xl px-4 py-3 flex items-center gap-4 w-full">
      {/* Clickable name + units area */}
      <button
        className="flex items-center gap-4 flex-1 min-w-0 text-left group"
        onClick={() => onEdit?.(team.id, team.name, slots)}
      >
        <div className="w-40 shrink-0">
          <p className="font-semibold truncate group-hover:text-blue-400 transition-colors">
            {team.name}
          </p>
          <p className="text-xs text-neutral-500">{team.setId}</p>
        </div>

        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {filledUnits.map((unit, i) => (
            <div
              key={i}
              className={`w-10 h-10 relative rounded overflow-hidden border shrink-0 ${getBorderColor(unit.cost)}`}
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
      </button>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <ShareTeamButton teamId={team.id} currentSlug={team.slug} onSuccess={onMutated} />
        <DeleteTeamButton teamId={team.id} onSuccess={onMutated} />
      </div>
    </div>
  );
}
