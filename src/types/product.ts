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
  cill: "none" | "85mm" | "150mm" | "190mm" | "225mm" | "90mm" | "230mm";
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
  panels: 2 | 3 | 4 | 6;
  slideDirection: "left" | "right" | "center";
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
  trickleVents: boolean | number;
  transom: boolean;
  hardwareColor: string;
  addons: {
    left: string | null;
    right: string | null;
    top: string | null;
  };
}

export interface WindowConfig extends BaseConfig {
  type: ProductType.Window;
  style: "casement" | "tilt_turn";
  layout: string; // ID of a layout pattern (e.g., "fixed-opener-fixed")
}

export interface RoofConfig extends BaseConfig {
  type: ProductType.Rooflight | ProductType.Lantern;
  bars: number;
}

export type ProductConfig =
  | BifoldConfig
  | SliderConfig
  | DoorConfig
  | WindowConfig
  | RoofConfig
  | BaseConfig;
