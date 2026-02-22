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

// Converts a CDragon asset path like "ASSETS/Characters/.../icon.png"
// into a full CDragon CDN URL (lowercase path required by CDragon).
function cdragAssetToUrl(path: string): string {
  if (!path) return "";
  return `${CDRAGON_BASE}/plugins/rcp-be-lol-game-data/global/default/${path.toLowerCase()}`;
}

// Maps CDragon trait effect style values to local medal hex background images.
// These local images (in /public/traits/) are set-agnostic and do not change between patches.
function styleToBgImage(style: number): string {
  if (style >= 7) return "unique_trait.avif";
  if (style >= 5) return "gold_trait.avif";
  if (style >= 3) return "silver_trait.avif";
  return "bronze_trait.avif";
}

function styleToLevel(style: number): number {
  if (style >= 7) return 4;
  if (style >= 5) return 3;
  if (style >= 3) return 2;
  return 1;
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

// Finds the set data entry for the requested set number.
// Falls back to the highest-numbered set with champions if the requested one isn't found.
function getSetData(tftData: CDragonTFTData, setNumber: number): CDragonSetData {
  const all = tftData.setData ?? [];

  const exact = all.find((s) => s.number === setNumber && s.champions?.length > 0);
  if (exact) return exact;

  // Fallback: use the highest-numbered set available
  const sorted = [...all]
    .filter((s) => s.champions?.length > 0)
    .sort((a, b) => b.number - a.number);

  if (sorted.length === 0) {
    throw new Error("No valid set data found in CDragon response");
  }
  return sorted[0];
}

function transformTrait(cdTrait: CDragonTrait): Trait {
  const breakpoints: TraitBreakpoint[] = (cdTrait.effects ?? []).map((effect) => ({
    count: effect.minUnits,
    level: styleToLevel(effect.style),
    bgImage: styleToBgImage(effect.style),
  }));

  return {
    id: cdTrait.apiName,
    name: cdTrait.name,
    imageUrl: cdragAssetToUrl(cdTrait.icon),
    defaultBg: "empty_trait.avif",
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

  // Prefer squareSplashPath for UnitLarge (more detailed), fall back to icon.
  const imageUrl = cdragAssetToUrl(
    cdChamp.squareSplashPath && cdChamp.squareSplashPath.length > 0
      ? cdChamp.squareSplashPath
      : cdChamp.icon
  );
  const iconUrl = cdragAssetToUrl(cdChamp.icon);

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

  // Filter to standard playable champions (cost 1-6, skip no-cost tutorial units etc.)
  const units = setData.champions
    .filter((c) => c.cost >= 1 && c.cost <= 6)
    .map((c) => transformChampion(c, traitMap));

  setCached(cacheKey, units, CACHE_TTL_MS);
  return units;
}
