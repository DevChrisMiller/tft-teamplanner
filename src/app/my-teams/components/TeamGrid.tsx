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
  createdAt: Date;
  updatedAt: Date;
  units: TeamUnit[];
}

interface Props {
  teams: Team[];
  allUnits: Unit[];
}

export default function TeamGrid({ teams, allUnits }: Props) {
  const unitMap = new Map(allUnits.map((u) => [u.id, u]));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} unitMap={unitMap} />
      ))}
    </div>
  );
}
