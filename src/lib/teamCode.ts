import type { Unit } from "@/d";

// Team code format: "SETID:slotIndex:unitId,slotIndex:unitId,..."
// Example: "TFT13:0:TFT13_Annie,1:TFT13_Jinx,3:TFT13_Vi"

export function encodeTeamCode(team: (Unit | null)[], setId: string): string {
  const slots = team
    .map((unit, index) => (unit ? `${index}:${unit.id}` : null))
    .filter((s): s is string => s !== null);

  if (slots.length === 0) return "";
  return `${setId}:${slots.join(",")}`;
}

export interface DecodedTeam {
  setId: string;
  slots: { index: number; unitId: string }[];
}

export function decodeTeamCode(code: string): DecodedTeam | null {
  if (!code.trim()) return null;

  // Find the first colon that separates setId from the rest
  const firstColon = code.indexOf(":");
  if (firstColon === -1) return null;

  const setId = code.slice(0, firstColon);
  const rest = code.slice(firstColon + 1);

  const slots: { index: number; unitId: string }[] = [];

  for (const entry of rest.split(",")) {
    const colonIdx = entry.indexOf(":");
    if (colonIdx === -1) continue;

    const slotStr = entry.slice(0, colonIdx);
    const unitId = entry.slice(colonIdx + 1);

    const slotIndex = parseInt(slotStr, 10);
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex > 9) continue;
    if (!unitId) continue;

    slots.push({ index: slotIndex, unitId });
  }

  if (slots.length === 0) return null;
  return { setId, slots };
}
