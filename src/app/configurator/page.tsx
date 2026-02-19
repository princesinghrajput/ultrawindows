"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ConfiguratorLayout from "../../components/configurator/ConfiguratorLayout";
import {
  ProductType,
  ProductConfig,
  BifoldConfig,
  DoorConfig,
  SliderConfig,
  WindowConfig,
  ShapedConfig,
  FixedConfig,
  BayConfig,
  RoofConfig,
} from "../../types/product";
import { validateDimensions } from "../../utils/validation";
import { calculateBifoldPrice } from "../../utils/pricing";
import PriceSummary from "../../components/configurator/PriceSummary";

// Extracted components
import VisualizerPanel from "../../components/configurator/VisualizerPanel";
import DimensionsSection from "../../components/configurator/sections/DimensionsSection";

// Product-type control components
import BifoldControls from "../../components/configurator/controls/BifoldControls";
import SliderControls from "../../components/configurator/controls/SliderControls";
import WindowControls from "../../components/configurator/controls/WindowControls";
import ShapedControls from "../../components/configurator/controls/ShapedControls";
import FixedControls from "../../components/configurator/controls/FixedControls";
import BayControls from "../../components/configurator/controls/BayControls";
import RooflightControls from "../../components/configurator/controls/RooflightControls";
import FrenchDoorControls from "../../components/configurator/controls/FrenchDoorControls";
import SingleDoorControls from "../../components/configurator/controls/SingleDoorControls";

const BIFOLD = 600;
const calculatePanels = (width?: number) => {
  if (!width) return 0;
  return Math.floor(width / BIFOLD);
};

const getNumberOfPanel = (panel?: number) => {
  if (!panel) return [];

  if (panel > 3 && panel < 7) {
    return Array.from({ length: 3 }, (_, i) => panel - i).sort(
      (a: number, b: number) => a - b,
    );
  }
  if (panel == 3) {
    return Array.from({ length: 2 }, (_, i) => panel - i).sort(
      (a: number, b: number) => a - b,
    );
  }
  if (panel == 2) {
    return Array.from({ length: 1 }, (_, i) => panel - i).sort(
      (a: number, b: number) => a - b,
    );
  }
  if (panel <= 1) {
    return [];
  }
  return Array.from({ length: 3 }, (_, i) => 7 - i).sort(
    (a: number, b: number) => a - b,
  );
};

function ConfiguratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ProductConfig | null>(null);
  const [view, setView] = useState<"inside" | "outside">("outside");
  const [isSidelightModalOpen, setIsSidelightModalOpen] = useState(false);

  const panel = useMemo(() => {
    return calculatePanels(config?.width);
  }, [config?.width]);
  console.log({ panel });
  const handleProductSelect = (type: ProductType) => {
    const baseConfig = {
      id: crypto.randomUUID(),
      width: 2400,
      height: 2100,
      color: "white",
      outsideColor: "white",
      insideColor: "white",
      glass: "clear",
      handleColor: "chrome",
      cill: "150mm",
      threshold: "standard",
      trickleVents: 0,
      extras: [],
      notes: "",
    };

    if (type === ProductType.Bifold) {
      setConfig({
        ...baseConfig,
        type: ProductType.Bifold,
        panels: 3,
        configuration: "3+0",
        openingDirection: "left",
        trafficDoor: true,

        trickleVents: 0,
        transomBars: 0,
        astragalBars: 0,
        addons: { left: null, right: null, top: null },
        hardwareColor: "chrome",
        glassType: "toughened",
        glassPattern: "Clear",
        integralBlinds: false,
        extras: [],
        notes: "",
      } as BifoldConfig);
    } else if (type === ProductType.FrenchDoor) {
      setConfig({
        ...baseConfig,
        type: ProductType.FrenchDoor,
        width: 1800,
        color: "black",
        outsideColor: "black",
        insideColor: "black",
        openingDirection: "out",
        masterHandle: "right",
        sidelights: {
          left: { enabled: false, width: 0, height: baseConfig.height },
          right: { enabled: false, width: 0, height: baseConfig.height },
          top: { enabled: false, height: 0 },
        },
        addons: { left: null, right: null, top: null },
        hardwareColor: "chrome",
        transomBars: 0,
        astragalBars: 0,
        glassType: "toughened",
        glassPattern: "Clear",
        pas24: false,
        extras: [],
      } as any);
    } else if (type === ProductType.Slider) {
      setConfig({
        ...baseConfig,
        type: ProductType.Slider,
        width: 3000,
        interlock: "47mm",
        panels: 2,
        slideDirection: "left",
        outsideColor: "black",
        insideColor: "black",
        color: "black",
        hardwareColor: "chrome",
        glassType: "toughened",
        glassThickness: undefined,
        cill: "180mm",
        extras: [],
      } as any);
    } else if (type === ProductType.SingleDoor) {
      setConfig({
        ...baseConfig,
        type: ProductType.SingleDoor,
        width: 900,
        color: "black",
        outsideColor: "black",
        insideColor: "black",
        openingDirection: "out",
        masterHandle: "right",
        sidelights: {
          left: { enabled: false, width: 0, height: baseConfig.height },
          right: { enabled: false, width: 0, height: baseConfig.height },
          top: { enabled: false, height: 0 },
        },
        addons: { left: null, right: null, top: null },
        hardwareColor: "chrome",
      } as any);
    } else if (type === ProductType.Window) {
      setConfig({
        ...baseConfig,
        type: ProductType.Window,
        style: "casement",
        windowStyle: "style-21", // Default style
        frameSystem: "standard",
        configuration: "Fixed-Opener", // Keep for now
        outsideColor: "black",
        insideColor: "white",
        hardwareColor: "chrome",
        transomBars: 0,
        astragalBars: 0,
        glassType: "clear",
        addons: { left: null, right: null, top: null },
      } as WindowConfig);
    } else if (type === ProductType.Shaped) {
      setConfig({
        ...baseConfig,
        type: ProductType.Shaped,
        shapeType: "gable",
        width: 3000,
        height: 500,
        outsideColor: "white",
        insideColor: "white",
        cill: "90mm",
        transomBars: 0,
        astragalBars: 0,
        hardwareColor: "chrome",
        glassType: "toughened",
        glassPattern: "Low E (1.0 u-value)",
        pas24: false,
      } as ShapedConfig);
    } else if (type === ProductType.Fixed) {
      setConfig({
        ...baseConfig,
        type: ProductType.Fixed,
        width: 300,
        height: 300,
        outsideColor: "black",
        insideColor: "white",
        cill: "90mm",
        addons: { left: null, right: null, top: null },
        transomBars: 0,
        astragalBars: 0,
        glassType: "toughened",
        glassPattern: "Low E (1.0 u-value)",
        pas24: false,
        location: "",
      } as FixedConfig);
    } else if (type === ProductType.Bay) {
      setConfig({
        ...baseConfig,
        type: ProductType.Bay,
        frameSystem: "standard",
        numberOfPanes: 3,
        bayHeight: 0,
        width: 1000,
        height: 1000,
        lengths: [0, 0, 0],
        angles: [0, 0],
        outsideColor: "white",
        insideColor: "white",
        cill: "90mm",
        glassType: "toughened",
        glassPattern: "Low E (1.0 u-value)",
        pas24: false,
        location: "",
      } as BayConfig);
    } else if (type === ProductType.Rooflight) {
      setConfig({
        ...baseConfig,
        type: ProductType.Rooflight,
        width: 3000,
        height: 1200,
        bars: 0,
        outsideColor: "white",
        insideColor: "white",
        location: "",
      } as RoofConfig);
    } else {
      setConfig({ ...baseConfig, type } as any);
    }

    setStep(2);
  };

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (!typeParam) {
      router.replace("/portal/quotes");
      return;
    }
    if (typeParam === "bifold") {
      handleProductSelect(ProductType.Bifold);
    } else if (typeParam === "french_door") {
      handleProductSelect(ProductType.FrenchDoor);
    } else if (typeParam === "single_door") {
      handleProductSelect(ProductType.SingleDoor);
    } else if (typeParam === "patio") {
      // Ultra Patio 47mm
      handleProductSelect(ProductType.Slider);
      // We set specific override after init
      setTimeout(() => {
        setConfig((prev) =>
          prev ? ({ ...prev, interlock: "47mm" } as any) : null,
        );
      }, 0);
    } else if (typeParam === "aluminium-slider") {
      // Cortizo 25mm
      handleProductSelect(ProductType.Slider);
      setTimeout(() => {
        setConfig((prev) =>
          prev ? ({ ...prev, interlock: "25mm" } as any) : null,
        );
      }, 0);
    } else if (typeParam === "slider") {
      handleProductSelect(ProductType.Slider);
    } else if (typeParam === "window") {
      handleProductSelect(ProductType.Window);
    } else if (typeParam === "shaped") {
      handleProductSelect(ProductType.Shaped);
    } else if (typeParam === "fixed") {
      handleProductSelect(ProductType.Fixed);
    } else if (typeParam === "bay") {
      handleProductSelect(ProductType.Bay);
    } else if (typeParam === "rooflight") {
      handleProductSelect(ProductType.Rooflight);
    } else {
      router.replace("/portal/quotes");
    }
  }, [searchParams]);

  const handleBack = () => {
    router.push("/portal/quotes");
  };

  const updateConfig = (updates: Partial<ProductConfig>) => {
    if (!config) return;
    setConfig({ ...config, ...updates } as ProductConfig);
  };

  const renderProductControls = () => {
    if (!config) return null;

    const validation = validateDimensions(config);

    switch (config.type) {
      case ProductType.Window:
        return <WindowControls config={config as WindowConfig} onUpdate={updateConfig} />;
      case ProductType.Shaped:
        return <ShapedControls config={config as ShapedConfig} onUpdate={updateConfig} />;
      case ProductType.Fixed:
        return <FixedControls config={config as FixedConfig} onUpdate={updateConfig} />;
      case ProductType.Bay:
        return <BayControls config={config as BayConfig} onUpdate={updateConfig} validation={validation} />;
      case ProductType.Rooflight:
        return <RooflightControls config={config as RoofConfig} onUpdate={updateConfig} />;
      case ProductType.FrenchDoor:
        return <FrenchDoorControls config={config as DoorConfig} onUpdate={updateConfig} />;
      case ProductType.SingleDoor:
        return <SingleDoorControls config={config as DoorConfig} onUpdate={updateConfig} />;
      case ProductType.Bifold:
        return (
          <BifoldControls
            config={config as BifoldConfig}
            onUpdate={updateConfig}
            panelOptions={getNumberOfPanel(panel) || []}
          />
        );
      case ProductType.Slider:
        return <SliderControls config={config as SliderConfig} onUpdate={updateConfig} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 2:
        if (!config) return null;

        const validation = validateDimensions(config);

        // Calculate price for bifold
        const priceBreakdown =
          config.type === ProductType.Bifold
            ? calculateBifoldPrice({
              panels: (config as BifoldConfig).panels,
              cill: (config as BifoldConfig).cill || "none",
              handleColor: config.handleColor || "chrome",
              trickleVents: config.trickleVents || 0,
              width: config.width,
              height: config.height,
              outsideColor: (config as BifoldConfig).outsideColor,
              insideColor: (config as BifoldConfig).insideColor,
              color: config.color,
              blinds: (config as BifoldConfig).integralBlinds,
              transomBars: (config as BifoldConfig).transomBars || 0,
              astragalBars: (config as BifoldConfig).astragalBars || 0,
              addonLeft: (config as BifoldConfig).addons?.left || undefined,
              addonRight: (config as BifoldConfig).addons?.right || undefined,
              addonTop: (config as BifoldConfig).addons?.top || undefined,
              extras: config.extras,
            })
            : null;

        return (
          <>
            <div className="flex flex-col xl:flex-row gap-6 items-start max-w-[1440px] mx-auto pb-24">
              {/* LEFT COLUMN — Visualizer */}
              <VisualizerPanel
                config={config}
                view={view}
                onToggleView={() =>
                  setView((v) => (v === "outside" ? "inside" : "outside"))
                }
              />

              {/* RIGHT COLUMN — Configuration Controls */}
              <div className="w-full xl:flex-1 min-w-0 space-y-4">
                {/* Dimensions, Location, Sidelights, Validation */}
                <DimensionsSection
                  config={config}
                  onUpdate={updateConfig}
                  validation={validation}
                  isSidelightModalOpen={isSidelightModalOpen}
                  onOpenSidelightModal={() => setIsSidelightModalOpen(true)}
                  onCloseSidelightModal={() => setIsSidelightModalOpen(false)}
                />

                {/* Product-specific controls */}
                {renderProductControls()}
              </div>
            </div>

            {/* Fixed Bottom Price Bar */}
            {priceBreakdown && (
              <div className="fixed bottom-0 left-0 right-0 z-40">
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                  <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
                    <PriceSummary breakdown={priceBreakdown} />
                  </div>
                </div>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ConfiguratorLayout
      title="Configure Product"
      step={step}
      totalSteps={3}
      onBack={handleBack}
    >
      {renderContent()}
    </ConfiguratorLayout>
  );
}

export default function ConfiguratorPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center text-slate-400">
          Loading configurator...
        </div>
      }
    >
      <ConfiguratorContent />
    </React.Suspense>
  );
}
