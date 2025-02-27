export interface Unit {
  ID: number;
  Name: string;
  Cost: number;
  ImageSource1: string;
  ImageSource2: string;
  Trait1ID: number;
  Trait2ID: number;
  Trait3ID: number;
  Traits?: Trait[];
}

export interface Trait {
  ID: number;
  Name: string;
  ImageSource: string;
  DefaultBG: string;
  BreakPoint1Count: number;
  BreakPoint1Level: number;
  BreakPoint1LevelBG: string;
  BreakPoint2Count: number;
  BreakPoint2Level: number;
  BreakPoint2LevelBG: string;
  BreakPoint3Count: number;
  BreakPoint3Level: number;
  BreakPoint3LevelBG: string;
  BreakPoint4Count: number;
  BreakPoint4Level: number;
  BreakPoint4LevelBG: string;
}
