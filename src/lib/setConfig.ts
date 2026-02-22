export interface SetConfig {
  name: string;
  cdragVersion: string; // "latest" or a specific patch like "14.23"
  setNumber: number;    // matches CDragon setData[].number — used to find the right entry
}

// Add new entries here as new TFT sets release.
// "latest" always points to the current patch on CDragon.
export const SET_CONFIG: Record<string, SetConfig> = {
  TFT13: {
    name: "Set 13 — Into the Arcane",
    cdragVersion: "latest",
    setNumber: 13,
  },
};

export const DEFAULT_SET_KEY = "TFT13";
