export interface CDragonChampion {
  apiName: string;
  cost: number;
  icon: string;         // centered splash art (large)
  squareIcon?: string;  // square splash crop (medium)
  tileIcon?: string;    // HUD square portrait — best for unit cards
  name: string;
  traits: string[];     // trait names e.g. ["Rebel", "Invoker"]
  ability?: unknown;
}

export interface CDragonTraitEffect {
  maxUnits: number;
  minUnits: number;
  style: number; // 1=bronze, 3=silver, 5=gold, 7=prismatic
  variables: Record<string, number>;
}

export interface CDragonTrait {
  apiName: string;
  desc?: string;
  effects: CDragonTraitEffect[];
  icon: string;
  name: string;
}

export interface CDragonSetData {
  number: number;
  name?: string;
  mutator?: string;
  champions: CDragonChampion[];
  traits: CDragonTrait[];
}

export interface CDragonTFTData {
  setData: CDragonSetData[];
  sets?: Record<string, unknown>;
}
