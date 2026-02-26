"use client";

import TeamCard from "./TeamCard";
import type { Unit } from "@/d";

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
  teams: Team[];
  allUnits: Unit[];
  onMutated?: () => void;
  onEdit?: (teamId: string, name: string, units: (Unit | null)[]) => void;
}

export default function TeamGrid({ teams, allUnits, onMutated, onEdit }: Props) {
  const unitMap = new Map(allUnits.map((u) => [u.id, u]));

  return (
    <div className="flex flex-col gap-2 w-full">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} unitMap={unitMap} onMutated={onMutated} onEdit={onEdit} />
      ))}
    </div>
  );
}
