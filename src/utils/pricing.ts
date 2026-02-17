// Pricing data from client's ultra_pricing spreadsheet — Bifold Door pricing
// All values are in GBP (£)

export interface PriceBreakdown {
  lineItems: {
    label: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  total: number;
}

// ═══════════════════════════════════════════
//  BASE COMPONENT PRICES
// ═══════════════════════════════════════════

export const BIFOLD_PRICES = {
  // Per-leaf price (each panel/pane)
  leaf: 395,

  // Cill prices (per linear meter, based on width)
  cill: {
    none: 0,
    "85mm": 17.29,
    "90mm": 17.29,
    "150mm": 26.6,
    "180mm": 28.595,
    "190mm": 28.595, // mapping 190mm to the 180mm price tier
    "225mm": 32.585,
    "230mm": 32.585,
  } as Record<string, number>,

  // Handle prices per unit
  handle: {
    grey: 0,
    black: 0,
    white: 0,
    chrome: 30.78,
    satin: 36.765,
    gold: 36.765,
    rose_gold: 36.765,
    dual: 36.765,
    stainless: 94.05,
    coastal_stainless_steel: 94.05,
  } as Record<string, number>,

  // Addons - flat prices
  trickleVent: 15,
  floatingCorner: 75,
  adjustableJamb: 100,
  toeHeelAdjuster: 0,
  externalHandle: 50,
  flatPack: 0,

  // Addon extensions (per linear meter)
  addon: {
    "20mm": 16.625,
    "38mm": 21.945,
  } as Record<string, number>,

  // Colour / RAL extras
  ralColour: 250, // Custom RAL colour
  secondRal: 0, // Second RAL (different inside/outside)

  // Bar extras (per bar)
  astragalBar: 50,
  transomBar: 50,

  // Blinds (per panel)
  blinds: 200,

  // Sidelight
  sidelightFrame: 30,
  sidelightFrameFixed: 0,

  // Glass upgrade (per pane)
  lowEToughGlass: 55,

  // Fixed panel types
  frenchFixed: 0,
  singleFixed: 100,
};

// ═══════════════════════════════════════════
//  PRICING CALCULATOR
// ═══════════════════════════════════════════

export function calculateBifoldPrice(config: {
  panels: number;
  cill: string;
  handleColor: string;
  trickleVents: boolean | number;
  width: number;
  height: number;
  outsideColor?: string;
  insideColor?: string;
  color?: string;
  // Optional addons
  addonLeft?: string;
  addonRight?: string;
  addonTop?: string;
  transomBars?: number;
  astragalBars?: number;
  blinds?: boolean;
  sidelights?: number;
  lowEGlass?: boolean;
  extras?: string[];
}): PriceBreakdown {
  const items: PriceBreakdown["lineItems"] = [];

  // 1. Leaf / Panel cost
  const leafTotal = config.panels * BIFOLD_PRICES.leaf;
  items.push({
    label: `Bifold Panels (${config.panels}x)`,
    quantity: config.panels,
    unitPrice: BIFOLD_PRICES.leaf,
    total: leafTotal,
  });

  // 2. Cill cost (price per meter × width in meters)
  const cillKey = config.cill || "none";
  const cillUnitPrice = BIFOLD_PRICES.cill[cillKey] || 0;
  if (cillUnitPrice > 0) {
    const widthInMeters = config.width / 1000;
    const cillTotal = Math.round(cillUnitPrice * widthInMeters * 100) / 100;
    items.push({
      label: `Cill (${cillKey})`,
      quantity: 1,
      unitPrice: cillTotal,
      total: cillTotal,
    });
  }

  // 3. Handle cost (per panel — each panel has a handle)
  const handleKey = config.handleColor?.toLowerCase() || "chrome";
  const handleUnitPrice = BIFOLD_PRICES.handle[handleKey] ?? 0;
  if (handleUnitPrice > 0) {
    const handleTotal = config.panels * handleUnitPrice;
    items.push({
      label: `Handle - ${config.handleColor} (${config.panels}x)`,
      quantity: config.panels,
      unitPrice: handleUnitPrice,
      total: handleTotal,
    });
  }

  // 4. Trickle vents
  const ventCount =
    typeof config.trickleVents === "number"
      ? config.trickleVents
      : config.trickleVents
        ? 1
        : 0;

  if (ventCount > 0) {
    items.push({
      label: `Trickle Vents (${ventCount}x)`,
      quantity: ventCount,
      unitPrice: BIFOLD_PRICES.trickleVent,
      total: ventCount * BIFOLD_PRICES.trickleVent,
    });
  }

  // 5. Custom RAL colour
  const standardColours = ["white", "black", "grey", "anthracite"];
  const outsideColor = (
    config.outsideColor ||
    config.color ||
    "white"
  ).toLowerCase();
  const insideColor = (
    config.insideColor ||
    config.color ||
    "white"
  ).toLowerCase();
  const isCustomOutside = !standardColours.includes(outsideColor);
  const isCustomInside = !standardColours.includes(insideColor);

  if (isCustomOutside) {
    items.push({
      label: "Custom RAL Colour (Outside)",
      quantity: 1,
      unitPrice: BIFOLD_PRICES.ralColour,
      total: BIFOLD_PRICES.ralColour,
    });
  }
  if (isCustomInside && insideColor !== outsideColor) {
    items.push({
      label: "Custom RAL Colour (Inside)",
      quantity: 1,
      unitPrice: BIFOLD_PRICES.secondRal,
      total: BIFOLD_PRICES.secondRal,
    });
  }

  // 6. Addon extensions
  const addons = [
    { key: config.addonLeft, label: "Addon Left" },
    { key: config.addonRight, label: "Addon Right" },
    { key: config.addonTop, label: "Addon Top" },
  ];
  for (const addon of addons) {
    if (addon.key && BIFOLD_PRICES.addon[addon.key]) {
      const addonPrice = BIFOLD_PRICES.addon[addon.key];
      items.push({
        label: `${addon.label} (${addon.key})`,
        quantity: 1,
        unitPrice: addonPrice,
        total: addonPrice,
      });
    }
  }

  // 7. Transom bars
  if (config.transomBars && config.transomBars > 0) {
    items.push({
      label: `Transom Bars (${config.transomBars}x)`,
      quantity: config.transomBars,
      unitPrice: BIFOLD_PRICES.transomBar,
      total: config.transomBars * BIFOLD_PRICES.transomBar,
    });
  }

  // 8. Astragal bars
  if (config.astragalBars && config.astragalBars > 0) {
    items.push({
      label: `Astragal Bars (${config.astragalBars}x)`,
      quantity: config.astragalBars,
      unitPrice: BIFOLD_PRICES.astragalBar,
      total: config.astragalBars * BIFOLD_PRICES.astragalBar,
    });
  }

  // 9. Integrated blinds
  if (config.blinds) {
    items.push({
      label: `Integrated Blinds (${config.panels}x)`,
      quantity: config.panels,
      unitPrice: BIFOLD_PRICES.blinds,
      total: config.panels * BIFOLD_PRICES.blinds,
    });
  }

  // 10. Low-E toughened glass upgrade
  if (config.lowEGlass) {
    items.push({
      label: `Low-E Toughened Glass (${config.panels}x)`,
      quantity: config.panels,
      unitPrice: BIFOLD_PRICES.lowEToughGlass,
      total: config.panels * BIFOLD_PRICES.lowEToughGlass,
    });
  }

  // 11. Sidelights
  if (config.sidelights && config.sidelights > 0) {
    items.push({
      label: `Sidelight Frame (${config.sidelights}x)`,
      quantity: config.sidelights,
      unitPrice: BIFOLD_PRICES.sidelightFrame,
      total: config.sidelights * BIFOLD_PRICES.sidelightFrame,
    });
  }

  // 12. Optional Extras
  if (config.extras) {
    if (config.extras.includes("Corner Post")) {
      items.push({
        label: "Corner Post",
        quantity: 1,
        unitPrice: BIFOLD_PRICES.floatingCorner,
        total: BIFOLD_PRICES.floatingCorner,
      });
    }
    if (config.extras.includes("Adjustable Jamb")) {
      items.push({
        label: "Adjustable Jamb",
        quantity: 1,
        unitPrice: BIFOLD_PRICES.adjustableJamb,
        total: BIFOLD_PRICES.adjustableJamb,
      });
    }
    if (config.extras.includes("External Handle")) {
      items.push({
        label: "External Handle",
        quantity: 1,
        unitPrice: BIFOLD_PRICES.externalHandle,
        total: BIFOLD_PRICES.externalHandle,
      });
    }
    if (config.extras.includes("Flat Pack")) {
      items.push({
        label: "Flat Pack",
        quantity: 1,
        unitPrice: BIFOLD_PRICES.flatPack,
        total: BIFOLD_PRICES.flatPack,
      });
    }
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return {
    lineItems: items,
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(subtotal * 100) / 100,
  };
}
