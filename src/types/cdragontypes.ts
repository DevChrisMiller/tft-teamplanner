export interface CDragonChampion {
  apiName: string;
  characterName?: string;
  cost: number;
  icon: string;
  name: string;
  traits: string[];          // trait names e.g. ["Rebel", "Invoker"]
  squareSplashPath?: string; // higher-res portrait, may be empty string
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
