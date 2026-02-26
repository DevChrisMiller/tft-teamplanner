import { getCached, setCached } from "@/lib/cache";
import type {
  CDragonTFTData,
  CDragonSetData,
  CDragonChampion,
  CDragonTrait,
} from "@/types/cdragontypes";
import type { Unit, Trait, TraitBreakpoint } from "@/d";
import { SET_CONFIG, DEFAULT_SET_KEY } from "@/lib/setConfig";

const CDRAGON_BASE = "https://raw.communitydragon.org/latest";
const TFT_DATA_URL = `${CDRAGON_BASE}/cdragon/tft/en_us.json`;

const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

// Converts a CDragon asset path like "ASSETS/Characters/.../icon.tex"
// into a full CDragon CDN URL. CDragon requires lowercase paths
// and serves .tex files as .png.
function cdragAssetToUrl(path: string): string {
  if (!path) return "";
  const normalized = path.toLowerCase().replace(/\.tex$/, ".png");
  return `${CDRAGON_BASE}/plugins/rcp-be-lol-game-data/global/default/${normalized}`;
}

// Maps CDragon trait effect style values to tier levels.
// style 1 = bronze, 3 = silver, 4 = unique (solo legendary), 5 = gold, 7 = prismatic
function styleToLevel(style: number): number {
  if (style >= 7) return 4;  // prismatic
  if (style >= 5) return 3;  // gold
  if (style === 4) return 5; // unique/legendary (single-unit trait, e.g. Glutton, Emperor)
  if (style >= 3) return 2;  // silver
  return 1;                   // bronze
}

async function fetchTFTData(): Promise<CDragonTFTData> {
  const cached = getCached<CDragonTFTData>("tftData");
  if (cached) return cached;

  const res = await fetch(TFT_DATA_URL);
  if (!res.ok) {
    throw new Error(`CDragon fetch failed with status ${res.status}`);
  }

  const data = (await res.json()) as CDragonTFTData;
  setCached("tftData", data, CACHE_TTL_MS);
  return data;
}

// Finds the standard set data for the requested set number.
// Prefers the base mutator (TFTSet{N}) over special modes (PVEMODE, PAIRS, etc.).
function getSetData(tftData: CDragonTFTData, setNumber: number): CDragonSetData {
  const all = tftData.setData ?? [];
  const withChampions = all.filter((s) => s.champions?.length > 0);

  // Prefer standard mutator for the requested set number
  const standard = withChampions.find(
    (s) => s.number === setNumber && (!s.mutator || s.mutator === `TFTSet${setNumber}`)
  );
  if (standard) return standard;

  // Any entry for this set number
  const anyForSet = withChampions.find((s) => s.number === setNumber);
  if (anyForSet) return anyForSet;

  // Fallback: highest-numbered set available
  const sorted = [...withChampions].sort((a, b) => b.number - a.number);
  if (sorted.length === 0) throw new Error("No valid set data found in CDragon response");
  return sorted[0];
}

function transformTrait(cdTrait: CDragonTrait): Trait {
  const breakpoints: TraitBreakpoint[] = (cdTrait.effects ?? []).map((effect) => ({
    count: effect.minUnits,
    level: styleToLevel(effect.style),
  }));

  return {
    id: cdTrait.apiName,
    name: cdTrait.name,
    imageUrl: cdragAssetToUrl(cdTrait.icon),
    breakpoints,
  };
}

function transformChampion(
  cdChamp: CDragonChampion,
  traitMap: Map<string, Trait>
): Unit {
  const traits = cdChamp.traits
    .map((name) => traitMap.get(name))
    .filter((t): t is Trait => t !== undefined);

  // imageUrl → squareIcon for larger display contexts (UnitLarge grid cells)
  // iconUrl  → tileIcon for small display contexts (UnitSmallDetail 64px cards)
  const imageUrl = cdragAssetToUrl(cdChamp.squareIcon ?? cdChamp.tileIcon ?? cdChamp.icon);
  const iconUrl = cdragAssetToUrl(cdChamp.tileIcon ?? cdChamp.squareIcon ?? cdChamp.icon);

  return {
    id: cdChamp.apiName,
    name: cdChamp.name,
    cost: cdChamp.cost,
    imageUrl,
    iconUrl,
    traits,
  };
}

export async function fetchTraits(setKey = DEFAULT_SET_KEY): Promise<Trait[]> {
  const cacheKey = `traits:${setKey}`;
  const cached = getCached<Trait[]>(cacheKey);
  if (cached) return cached;

  const config = SET_CONFIG[setKey];
  if (!config) throw new Error(`Unknown set key: ${setKey}`);

  const tftData = await fetchTFTData();
  const setData = getSetData(tftData, config.setNumber);

  const traits = setData.traits.map(transformTrait);
  setCached(cacheKey, traits, CACHE_TTL_MS);
  return traits;
}

export async function fetchUnits(setKey = DEFAULT_SET_KEY): Promise<Unit[]> {
  const cacheKey = `units:${setKey}`;
  const cached = getCached<Unit[]>(cacheKey);
  if (cached) return cached;

  const config = SET_CONFIG[setKey];
  if (!config) throw new Error(`Unknown set key: ${setKey}`);

  const tftData = await fetchTFTData();
  const setData = getSetData(tftData, config.setNumber);

  // Build a name→Trait map so champions can reference traits by name
  const traitMap = new Map<string, Trait>(
    setData.traits.map((t) => [t.name, transformTrait(t)])
  );

  // Filter to standard playable champions: cost 1-6 and at least one trait.
  // Non-playable entries (Training Dummy, Golem, Elder Dragon, etc.) have an empty traits array.
  const units = setData.champions
    .filter((c) => c.cost >= 1 && c.cost <= 6 && c.traits.length > 0)
    .map((c) => transformChampion(c, traitMap));

  setCached(cacheKey, units, CACHE_TTL_MS);
  return units;
}
