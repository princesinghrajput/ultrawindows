export enum ProductType {
  Bifold = "bifold",
  FrenchDoor = "french_door",
  SingleDoor = "single_door",
  Slider = "slider",
  Window = "window",
  Shaped = "shaped",
  Fixed = "fixed",
  Bay = "bay",
  Rooflight = "rooflight",
  Lantern = "lantern",
  Custom = "custom",
}

export interface BaseConfig {
  id: string;
  type: ProductType;
  width: number;
  height: number;
  color: string;
  glass: string;
  handleColor: string;
  cill: "none" | "85mm" | "150mm" | "180mm" | "190mm" | "225mm" | "90mm" | "230mm" | "250mm";
  trickleVents: boolean | number;
  extras: string[];
  notes: string;
}

export interface BifoldConfig extends BaseConfig {
  type: ProductType.Bifold;
  panels: number;
  openingDirection: "left" | "right" | "both";
  trafficDoor: boolean;
  // New fields for realistic configurator
  configuration: string; // e.g., '3+0', '2+1'
  outsideColor: string;
  insideColor: string;
  cill: "none" | "85mm" | "150mm" | "190mm" | "225mm";
  threshold: "standard" | "low" | "integrated";
  thresholdRamp?: "none" | "inside" | "outside" | "both";
  trickleVents: boolean | number;
  transomBars: number; // Replaces transom boolean
  astragalBars: number; // Vertical bars
  hardwareColor: string;
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure"
  | "laminated"
  | "clear"
  | "obscure"; // Keeping old types for safety
  glassPattern?: string;
  integralBlinds: boolean;
  pas24?: boolean;
  glassThickness?: number;
  addons: {
    left: string | null;
    right: string | null;
    top: string | null;
  };
}

export interface SliderConfig extends BaseConfig {
  type: ProductType.Slider;
  interlock: "25mm" | "47mm";
  panels: number;
  slideDirection: "left" | "right" | "both";
  outsideColor: string;
  insideColor: string;
  cill: "none" | "180mm" | "230mm" | "250mm";
  threshold: "standard" | "low";
  thresholdRamp?: "none" | "inside" | "outside" | "both";
  trickleVents: boolean | number;
  transomBars: number;
  astragalBars: number;
  hardwareColor: string;
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure"
  | "clear";
  glassPattern?: string;
  glassThickness?: number;
  pas24?: boolean;
  blinds?: "none" | "mechanical";
  blindsColour?: string;
  addons: {
    left: string | null;
    right: string | null;
    top: string | null;
  };
}

export interface DoorConfig extends BaseConfig {
  type: ProductType.FrenchDoor | ProductType.SingleDoor;
  openingDirection: "in" | "out";
  masterHandle: "left" | "right";
  sidelights: {
    left: {
      enabled: boolean;
      width: number;
      height: number;
      transom?: boolean;
    };
    right: {
      enabled: boolean;
      width: number;
      height: number;
      transom?: boolean;
    };
    top: { enabled: boolean; height: number };
  };
  outsideColor: string;
  insideColor: string;
  cill: "none" | "90mm" | "150mm" | "190mm" | "230mm";
  threshold: "standard" | "low" | "integrated";
  thresholdRamp?: "none" | "inside" | "outside" | "both";
  trickleVents: boolean | number;
  transomBars: number;
  astragalBars: number;
  hardwareColor: string;
  addons: {
    left: string | null;
    right: string | null;
    top: string | null;
  };
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure"
  | "laminated"
  | "clear"
  | "obscure";
  glassPattern?: string;
  glassThickness?: number;
  pas24?: boolean;
}

export interface WindowConfig extends BaseConfig {
  type: ProductType.Window;
  style: "casement" | "tilt_turn";
  windowStyle: string; // e.g., "style-1", "style-21" - ID from windowLayouts
  frameSystem: "standard" | "flush";
  configuration: string; // Legacy simple string, keeping for compatibility or simple serialization
  paneConfigurations?: Record<string, string>; // Map of pane ID to type (e.g "0": "opener", "1": "fixed")
  outsideColor: string;
  insideColor: string;
  hardwareColor: string;
  transomBars: number;
  astragalBars: number;
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure"
  | "laminated"
  | "clear"
  | "obscure";
  glassPattern?: string;
  glassThickness?: number;
  pas24?: boolean;
  addons: {
    left: string | null;
    right: string | null;
    top: string | null;
  };
}

export interface ShapedConfig extends BaseConfig {
  type: ProductType.Shaped;
  shapeType: "gable" | "shaped_left" | "shaped_right" | "gable_upstand";
  outsideColor: string;
  insideColor: string;
  outsideRAL?: string;
  insideRAL?: string;
  cill: "none" | "90mm" | "150mm" | "180mm" | "230mm";
  transomBars: number;
  astragalBars: number;
  transomBarPositions?: number[];
  astragalBarPositions?: number[];
  hardwareColor: string;
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure";
  glassPattern?: string;
  glassThickness?: number;
  pas24?: boolean;
  location?: string;
}

export interface FixedConfig extends BaseConfig {
  type: ProductType.Fixed;
  outsideColor: string;
  insideColor: string;
  outsideRAL?: string;
  insideRAL?: string;
  cill: "none" | "90mm" | "150mm" | "180mm" | "230mm";
  addons: { left: string | null; right: string | null; top: string | null };
  transomBars: number;
  astragalBars: number;
  transomBarPositions?: number[];
  astragalBarPositions?: number[];
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure";
  glassPattern?: string;
  glassThickness?: number;
  pas24?: boolean;
  location?: string;
}

export interface BayConfig extends BaseConfig {
  type: ProductType.Bay;
  frameSystem: "standard" | "flush";
  numberOfPanes: number;
  bayHeight: number;
  lengths: number[];
  angles: number[];
  outsideColor: string;
  insideColor: string;
  outsideRAL?: string;
  insideRAL?: string;
  cill: "none" | "90mm" | "150mm" | "180mm" | "230mm";
  glassType:
  | "unglazed"
  | "toughened"
  | "toughened_obscure";
  glassPattern?: string;
  glassThickness?: number;
  pas24?: boolean;
  location?: string;
}

export interface RoofConfig extends BaseConfig {
  type: ProductType.Rooflight | ProductType.Lantern;
  bars: number;
  outsideColor: string;
  insideColor: string;
  outsideRAL?: string;
  insideRAL?: string;
  location?: string;
}

export type ProductConfig =
  | BifoldConfig
  | SliderConfig
  | DoorConfig
  | WindowConfig
  | ShapedConfig
  | FixedConfig
  | BayConfig
  | RoofConfig
  | BaseConfig;
