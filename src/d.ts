export interface TraitBreakpoint {
  count: number;  // minUnits from CDragon effects
  level: number;  // 1=bronze, 2=silver, 3=gold, 4=prismatic
}

export interface Trait {
  id: string;        // CDragon apiName e.g. "TFT16_Sorcerer"
  name: string;      // "Arcanist"
  imageUrl: string;  // CDragon CDN URL for the trait icon
  breakpoints: TraitBreakpoint[];
}

export interface Unit {
  id: string;       // CDragon apiName e.g. "TFT13_Annie"
  name: string;     // "Annie"
  cost: number;     // 1-6
  imageUrl: string; // CDragon CDN URL for the square portrait
  iconUrl: string;  // CDragon CDN URL for the smaller icon
  traits: Trait[];  // fully resolved Trait objects
}
