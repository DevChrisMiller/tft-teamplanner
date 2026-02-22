export interface SetConfig {
  name: string;
  cdragVersion: string; // "latest" or a specific patch like "14.23"
  setNumber: number;    // matches CDragon setData[].number — used to find the right entry
}

// Add new entries here as new TFT sets release.
// "latest" always points to the current patch on CDragon.
export const SET_CONFIG: Record<string, SetConfig> = {
  TFT16: {
    name: "Set 16 — Arcane",
    cdragVersion: "latest",
    setNumber: 16,
  },
};

export const DEFAULT_SET_KEY = "TFT16";
