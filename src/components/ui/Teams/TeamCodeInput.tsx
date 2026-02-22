"use client";

import { Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { Unit } from "@/d";
import { decodeTeamCode } from "@/lib/teamCode";

interface Props {
  allUnits: Unit[];
  handleLoadTeam: (team: (Unit | null)[]) => void;
}

export default function TeamCodeInput({ allUnits, handleLoadTeam }: Props) {
  const handlePaste = (value: string) => {
    const decoded = decodeTeamCode(value.trim());
    if (!decoded) return;

    const unitMap = new Map(allUnits.map((u) => [u.id, u]));
    const team: (Unit | null)[] = Array(10).fill(null);

    decoded.slots.forEach(({ index, unitId }) => {
      const unit = unitMap.get(unitId);
      if (unit && index >= 0 && index <= 9) {
        team[index] = unit;
      }
    });

    handleLoadTeam(team);
  };

  return (
    <Input
      type="text"
      placeholder="Paste Team Code"
      size="sm"
      radius="lg"
      color="default"
      className="max-w-64 min-w-24 mr-2"
      startContent={
        <FontAwesomeIcon icon={faClipboard} className="text-neutral-400 mx-1" />
      }
      onValueChange={handlePaste}
    />
  );
}
