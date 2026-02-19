"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, RotateCcw, MapPin } from "lucide-react";
import ConfiguratorLayout from "../../components/configurator/ConfiguratorLayout";
import {
  ProductType,
  ProductConfig,
  BifoldConfig,
  DoorConfig,
  SliderConfig,
  WindowConfig,
  ShapedConfig,
} from "../../types/product";
import BifoldVisualizer from "../../components/configurator/visualizers/RealisticBifoldVisualizer";
import RealisticAluminiumWindowVisualizer from "../../components/configurator/visualizers/RealisticAluminiumWindowVisualizer";
import { validateDimensions } from "../../utils/validation";
import ConfigurationSection from "../../components/configurator/sections/ConfigurationSection";
import ColourSection from "../../components/configurator/sections/ColourSection";
import CillSection from "../../components/configurator/sections/CillSection";
import HardwareSection from "../../components/configurator/sections/HardwareSection";
import WindowStyleSelector from "../../components/configurator/sections/WindowStyleSelector";

import RealisticFrenchDoorVisualizer from "../../components/configurator/visualizers/RealisticFrenchDoorVisualizer";
import RealisticSingleDoorVisualizer from "../../components/configurator/visualizers/RealisticSingleDoorVisualizer";
import RealisticSliderVisualizer from "../../components/configurator/visualizers/RealisticSliderVisualizer";
import RealisticShapedFrameVisualizer from "../../components/configurator/visualizers/RealisticShapedFrameVisualizer";
import SidelightModal from "../../components/configurator/sections/SidelightModal";
import { calculateBifoldPrice } from "../../utils/pricing";
import PriceSummary from "../../components/configurator/PriceSummary";

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

// ─── Reusable Section Card ───────────────────────────────────────────
function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─── Toggle Button Group ─────────────────────────────────────────────
function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-5 py-2.5 text-sm font-medium transition-all ${value === opt.value
            ? "bg-slate-900 text-white"
            : "bg-white text-slate-600 hover:bg-slate-50"
            } ${opt.value !== options[0].value ? "border-l border-slate-200" : ""}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Configurator ──────────────────────────────────────────────
function ConfiguratorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(2);
  const [config, setConfig] = useState<ProductConfig | null>(null);
  const [view, setView] = useState<"inside" | "outside">("outside");
  const [isSidelightModalOpen, setIsSidelightModalOpen] = useState(false);
  const [isAstragalModalOpen, setIsAstragalModalOpen] = useState(false);
  const [selectedPane, setSelectedPane] = useState(0);
  const [selectedBar, setSelectedBar] = useState(0);
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
              {/* ═══════════════════════════════════════════
                            LEFT COLUMN — Visualizer Only
                        ═══════════════════════════════════════════ */}
              <div className="w-full xl:w-120 xl:shrink-0 xl:sticky xl:top-20 z-0">
                {/* Visualizer Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Visualizer Preview */}
                  <div
                    className="relative"
                    style={{ height: "clamp(320px, 45vw, 480px)" }}
                  >
                    {config.type === ProductType.Bifold ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <BifoldVisualizer
                          width={config.width}
                          height={config.height}
                          panels={(config as BifoldConfig).panels}
                          openingDirection={
                            (config as BifoldConfig).openingDirection
                          }
                          configuration={(config as BifoldConfig).configuration}
                          color={
                            view === "outside"
                              ? (config as BifoldConfig).outsideColor ||
                              config.color
                              : (config as BifoldConfig).insideColor ||
                              config.color
                          }
                          handleColor={config.handleColor}
                          cill={(config as BifoldConfig).cill}
                          trickleVents={(config as BifoldConfig).trickleVents as any}
                          view={view}
                          integralBlinds={
                            (config as BifoldConfig).integralBlinds
                          }
                          glassType={(config as BifoldConfig).glassType}
                          addonLeft={(config as BifoldConfig).addons?.left}
                          addonRight={(config as BifoldConfig).addons?.right}
                          addonTop={(config as BifoldConfig).addons?.top}
                          transomBars={(config as BifoldConfig).transomBars}
                          astragalBars={(config as BifoldConfig).astragalBars}
                        />
                      </div>
                    ) : config.type === ProductType.FrenchDoor ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticFrenchDoorVisualizer
                          config={config as any}
                          width={config.width}
                          height={config.height}
                          view={view}
                        />
                      </div>
                    ) : config.type === ProductType.SingleDoor ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticSingleDoorVisualizer
                          config={config as any}
                          width={config.width}
                          height={config.height}
                          view={view}
                        />
                      </div>
                    ) : config.type === ProductType.Slider ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticSliderVisualizer
                          config={config as SliderConfig}
                          width={config.width}
                          height={config.height}
                          view={view}
                        />
                      </div>
                    ) : config.type === ProductType.Window ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticAluminiumWindowVisualizer
                          config={config as WindowConfig}
                          width={config.width}
                          height={config.height}
                          view={view}
                        />
                      </div>
                    ) : config.type === ProductType.Shaped ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticShapedFrameVisualizer
                          config={config as ShapedConfig}
                          width={config.width}
                          height={config.height}
                          view={view}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                        Visualizer for {config.type} coming soon
                      </div>
                    )}
                  </div>

                  {/* View Toggle Bar */}
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {view === "outside" ? "Outside" : "Inside"} View
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setView((v) => (v === "outside" ? "inside" : "outside"))
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Flip View
                    </button>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════
                            RIGHT COLUMN — Configuration Controls
                        ═══════════════════════════════════════════ */}
              <div className="w-full xl:flex-1 min-w-0 space-y-4">
                {/* Dimensions */}
                <SectionCard title="Dimensions">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Overall Width
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={config.width}
                          onChange={(e) =>
                            updateConfig({ width: Number(e.target.value) })
                          }
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-12 text-sm font-medium text-slate-800 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          mm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Overall Height
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={config.height}
                          onChange={(e) =>
                            updateConfig({ height: Number(e.target.value) })
                          }
                          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-12 text-sm font-medium text-slate-800 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          mm
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Kitchen, Living Room"
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-600 placeholder:text-slate-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Sidelights button for French Door & Single Door */}
                  {(config.type === ProductType.FrenchDoor ||
                    config.type === ProductType.SingleDoor) && (
                      <div className="mt-4">
                        <button
                          onClick={() => setIsSidelightModalOpen(true)}
                          className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-colors text-sm font-medium"
                        >
                          Edit Sidelights
                        </button>
                        <SidelightModal
                          isOpen={isSidelightModalOpen}
                          onClose={() => setIsSidelightModalOpen(false)}
                          config={config as any}
                          onChange={updateConfig as any}
                        />
                      </div>
                    )}

                  {/* Validation */}
                  {!validation.isValid && (
                    <div className="mt-3 text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="flex-shrink-0">⚠</span>
                      {validation.message}
                    </div>
                  )}
                </SectionCard>


                {/* ── WINDOW CONTROLS ── */}
                {config.type === ProductType.Window && (
                  <>
                    {/* Frame System */}
                    <SectionCard title="Frame System">
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        {["standard", "flush"].map((sys) => (
                          <button
                            key={sys}
                            onClick={() => updateConfig({ frameSystem: sys } as any)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${(config as WindowConfig).frameSystem === sys
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                              }`}
                          >
                            {sys}
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Style Configuration */}
                    <SectionCard title="Window Style">
                      <WindowStyleSelector
                        value={(config as WindowConfig).windowStyle || "style-21"}
                        onChange={(styleId) => updateConfig({ windowStyle: styleId } as any)}
                      />
                    </SectionCard>

                    {/* Colours */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Hardware */}
                    <SectionCard title="Hardware Colour">
                      <HardwareSection
                        config={config as any}
                        onChange={(updates) => updateConfig({ ...updates } as any)}
                      />
                    </SectionCard>

                    {/* Cill */}
                    <SectionCard title="Cill">
                      <CillSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Trickle Vents */}
                    <SectionCard title="Trickle Vents">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Trickle Vents
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current = typeof (config as WindowConfig).trickleVents === "number"
                                ? ((config as WindowConfig).trickleVents as number)
                                : (config as WindowConfig).trickleVents ? 1 : 0;
                              if (current > 0)
                                updateConfig({ trickleVents: current - 1 } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {typeof (config as WindowConfig).trickleVents === "number"
                              ? (config as WindowConfig).trickleVents
                              : (config as WindowConfig).trickleVents ? 1 : 0}
                          </span>
                          <button
                            onClick={() => {
                              const current = typeof (config as WindowConfig).trickleVents === "number"
                                ? ((config as WindowConfig).trickleVents as number)
                                : (config as WindowConfig).trickleVents ? 1 : 0;
                              updateConfig({ trickleVents: current + 1 } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Options */}
                    <SectionCard title="Glass Options">
                      <div className="space-y-4">
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as WindowConfig).pas24 || false}
                              onChange={(e) => updateConfig({ pas24: e.target.checked } as any)}
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">PAS 24 Certified</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {["Clear", "Obscure", "Laminated"].map((type) => (
                            <button
                              key={type}
                              onClick={() => updateConfig({ glassType: type.toLowerCase() as any })}
                              className={`px-3 py-2 text-sm border rounded-lg transition-all ${(config as WindowConfig).glassType === type.toLowerCase()
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => {
                          const sideKey = side.toLowerCase() as "left" | "top" | "right";
                          return (
                            <div key={side} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">Addon {side}</span>
                              <select
                                value={(config as WindowConfig).addons?.[sideKey] || "None"}
                                onChange={(e) => {
                                  const val = e.target.value === "None" ? null : e.target.value;
                                  const currentAddons = (config as WindowConfig).addons || { left: null, right: null, top: null };
                                  updateConfig({ addons: { ...currentAddons, [sideKey]: val } } as any);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28"
                              >
                                <option value="None">None</option>
                                <option value="20mm Addon">20mm</option>
                                <option value="38mm Addon">38mm</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── SHAPED FRAME CONTROLS ── */}
                {config.type === ProductType.Shaped && (
                  <>
                    {/* Shape Type Selector */}
                    <SectionCard title="Configuration">
                      <div className="flex flex-wrap justify-center gap-4">
                        {([
                          {
                            label: "Gable",
                            value: "gable",
                            icon: (
                              <svg viewBox="0 0 80 60" className="w-16 h-12">
                                <polygon
                                  points="10,55 40,8 70,55"
                                  fill="#475569"
                                  stroke="#334155"
                                  strokeWidth="2"
                                />
                              </svg>
                            ),
                          },
                          {
                            label: "Shaped Left",
                            value: "shaped_left",
                            icon: (
                              <svg viewBox="0 0 80 60" className="w-16 h-12">
                                <polygon
                                  points="10,55 10,30 55,8 70,55"
                                  fill="#475569"
                                  stroke="#334155"
                                  strokeWidth="2"
                                />
                              </svg>
                            ),
                          },
                          {
                            label: "Shaped Right",
                            value: "shaped_right",
                            icon: (
                              <svg viewBox="0 0 80 60" className="w-16 h-12">
                                <polygon
                                  points="10,55 25,8 70,30 70,55"
                                  fill="#475569"
                                  stroke="#334155"
                                  strokeWidth="2"
                                />
                              </svg>
                            ),
                          },
                          {
                            label: "Gable w/ Upstand",
                            value: "gable_upstand",
                            icon: (
                              <svg viewBox="0 0 80 60" className="w-16 h-12">
                                <polygon
                                  points="10,55 10,38 40,8 70,38 70,55"
                                  fill="#475569"
                                  stroke="#334155"
                                  strokeWidth="2"
                                />
                              </svg>
                            ),
                          },
                        ] as { label: string; value: string; icon: React.ReactNode }[]).map(
                          (shape) => (
                            <button
                              key={shape.value}
                              onClick={() =>
                                updateConfig({ shapeType: shape.value } as any)
                              }
                              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl w-28 h-28 transition-all ${(config as ShapedConfig).shapeType ===
                                  shape.value
                                  ? "bg-sky-50 border-sky-400 ring-1 ring-sky-200"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                            >
                              {shape.icon}
                              <span className="text-xs font-medium text-slate-700 mt-2 text-center leading-tight">
                                {shape.label}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </SectionCard>

                    {/* Outside Frame Colour */}
                    <SectionCard title="Outside Frame Colour">
                      <div className="flex flex-wrap gap-3 items-start">
                        {[
                          { label: "White", value: "white", bg: "bg-gray-200" },
                          { label: "Black", value: "black", bg: "bg-black" },
                          { label: "Grey", value: "grey", bg: "bg-slate-600" },
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() =>
                              updateConfig({
                                outsideColor: color.value,
                                outsideRAL: undefined,
                              } as any)
                            }
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${(config as ShapedConfig).outsideColor ===
                                color.value &&
                                !(config as ShapedConfig).outsideRAL
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            <div
                              className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`}
                            />
                            <span className="text-xs font-semibold text-slate-700 mt-2">
                              {color.label}
                            </span>
                          </button>
                        ))}

                        {/* RAL Colour Input */}
                        <div
                          className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${(config as ShapedConfig).outsideRAL
                              ? "bg-sky-50 border-sky-400"
                              : "bg-white border-slate-200"
                            }`}
                        >
                          <span className="text-xs text-slate-500 mb-1">
                            RAL Colour
                          </span>
                          <input
                            type="text"
                            value={(config as ShapedConfig).outsideRAL || "0000"}
                            onChange={(e) =>
                              updateConfig({
                                outsideRAL: e.target.value,
                                outsideColor: `RAL ${e.target.value}`,
                              } as any)
                            }
                            className="w-full text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-orange-500"
                          />
                          <button
                            onClick={() => {
                              const ral =
                                (config as ShapedConfig).outsideRAL || "0000";
                              updateConfig({
                                outsideRAL: ral,
                                outsideColor: `RAL ${ral}`,
                              } as any);
                            }}
                            className="mt-1 px-3 py-1 bg-orange-500 text-white text-xs rounded font-medium hover:bg-orange-600 transition-colors"
                          >
                            Add RAL
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Inside Frame Colour */}
                    <SectionCard title="Inside Frame Colour">
                      <div className="flex flex-wrap gap-3 items-start">
                        {[
                          { label: "White", value: "white", bg: "bg-gray-200" },
                          { label: "Black", value: "black", bg: "bg-black" },
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() =>
                              updateConfig({
                                insideColor: color.value,
                                insideRAL: undefined,
                              } as any)
                            }
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${(config as ShapedConfig).insideColor ===
                                color.value &&
                                !(config as ShapedConfig).insideRAL
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            <div
                              className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`}
                            />
                            <span className="text-xs font-semibold text-slate-700 mt-2">
                              {color.label}
                            </span>
                          </button>
                        ))}

                        {/* RAL Colour Input */}
                        <div
                          className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${(config as ShapedConfig).insideRAL
                              ? "bg-sky-50 border-sky-400"
                              : "bg-white border-slate-200"
                            }`}
                        >
                          <span className="text-xs text-slate-500 mb-1">
                            RAL Colour
                          </span>
                          <input
                            type="text"
                            value={(config as ShapedConfig).insideRAL || "0000"}
                            onChange={(e) =>
                              updateConfig({
                                insideRAL: e.target.value,
                                insideColor: `RAL ${e.target.value}`,
                              } as any)
                            }
                            className="w-full text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-orange-500"
                          />
                          <button
                            onClick={() => {
                              const ral =
                                (config as ShapedConfig).insideRAL || "0000";
                              updateConfig({
                                insideRAL: ral,
                                insideColor: `RAL ${ral}`,
                              } as any);
                            }}
                            className="mt-1 px-3 py-1 bg-orange-500 text-white text-xs rounded font-medium hover:bg-orange-600 transition-colors"
                          >
                            Add RAL
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Cill */}
                    <SectionCard title="Cill">
                      <div className="flex flex-wrap justify-center gap-3">
                        {[
                          { label: "No Cill", value: "none", hasIcon: false },
                          { label: "90mm", value: "90mm", hasIcon: true },
                          { label: "150mm", value: "150mm", hasIcon: true },
                          { label: "180mm", value: "180mm", hasIcon: true },
                          { label: "230mm", value: "230mm", hasIcon: true },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              updateConfig({ cill: opt.value } as any)
                            }
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl w-24 h-24 transition-all ${(config as ShapedConfig).cill === opt.value
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            {opt.hasIcon ? (
                              <img
                                src="/images/aluminium_bifolf/standard.png"
                                className="w-12 h-8 object-contain mb-1"
                                alt={opt.label}
                              />
                            ) : (
                              <svg
                                className="w-8 h-8 text-slate-400 mb-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            )}
                            <span className="text-xs font-semibold text-slate-700">
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Transom Bars */}
                    <SectionCard title="Transom Bars">
                      <div className="space-y-4">
                        {/* Horizontal Transom */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            Door Horizontal Transom
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const current =
                                  (config as ShapedConfig).transomBars || 0;
                                if (current > 0)
                                  updateConfig({
                                    transomBars: current - 1,
                                  } as any);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-4 text-center">
                              {(config as ShapedConfig).transomBars || 0}
                            </span>
                            <button
                              onClick={() => {
                                const current =
                                  (config as ShapedConfig).transomBars || 0;
                                updateConfig({
                                  transomBars: current + 1,
                                } as any);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Vertical Astragal */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm text-slate-600">
                            Door Vertical Transom
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const current =
                                  (config as ShapedConfig).astragalBars || 0;
                                if (current > 0)
                                  updateConfig({
                                    astragalBars: current - 1,
                                  } as any);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-4 text-center">
                              {(config as ShapedConfig).astragalBars || 0}
                            </span>
                            <button
                              onClick={() => {
                                const current =
                                  (config as ShapedConfig).astragalBars || 0;
                                updateConfig({
                                  astragalBars: current + 1,
                                } as any);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Type */}
                    <SectionCard title="Glass Type">
                      <div className="space-y-4">
                        {/* PAS 24 & Glass Thickness */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                (config as ShapedConfig).pas24 || false
                              }
                              onChange={(e) =>
                                updateConfig({
                                  pas24: e.target.checked,
                                } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as ShapedConfig).glassThickness !==
                                  undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as ShapedConfig).glassThickness !==
                              undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                  <span className="text-sm text-slate-600">
                                    Glass Thickness
                                  </span>
                                  <input
                                    type="number"
                                    value={
                                      (config as ShapedConfig).glassThickness ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      updateConfig({
                                        glassThickness:
                                          parseInt(e.target.value) || 0,
                                      } as any)
                                    }
                                    className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                  />
                                  <span className="text-sm text-slate-600">
                                    mm
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Glass Type Options */}
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscured",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern: string | null = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Low E (1.0 u-value)";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as ShapedConfig).glassType ===
                                    opt.value
                                    ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Glass Options for Toughened */}
                        {(config as ShapedConfig).glassType ===
                          "toughened" && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-slate-600 font-medium">
                                Glass
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                  "Low E (1.2 u-value)",
                                  "6.8 Laminated (1.2 u-value)",
                                  "Low E (1.0 u-value)",
                                  "6.8 Acoustic Laminated (1.2 u-value)",
                                  "Triple Glazed (0.6 u-value)",
                                ].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      updateConfig({
                                        glassPattern: opt,
                                      } as any)
                                    }
                                    className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as ShapedConfig).glassPattern ===
                                        opt
                                        ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Obscure Pattern Options */}
                        {(config as ShapedConfig).glassType ===
                          "toughened_obscure" && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-slate-600">
                                Obscure Pattern
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  "Arctic (L5)",
                                  "Autumn (L3)",
                                  "Contora (L4)",
                                  "Cotswold (L5)",
                                  "Reeded (L2)",
                                  "Stippolyte (L4)",
                                  "Cassini (L5)",
                                  "Chantilly (L2)",
                                  "Charcoal Sticks (L4)",
                                  "Digital (L3)",
                                  "Everglade (L5)",
                                  "Flemish (L1)",
                                  "Florielle (L4)",
                                  "Mayflower (L4)",
                                  "Minster (L2)",
                                  "Oak (L4)",
                                  "Pelerine (L4)",
                                  "Sycamore (L2)",
                                  "Taffeta (L3)",
                                  "Warwick (L1)",
                                  "Satin",
                                ].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      updateConfig({
                                        glassPattern: opt,
                                      } as any)
                                    }
                                    className={`p-2 text-xs border rounded-lg transition-all ${(config as ShapedConfig).glassPattern ===
                                        opt
                                        ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </SectionCard>

                    {/* Notes */}
                    <SectionCard title="Notes">
                      <div>
                        <textarea
                          value={config.notes || ""}
                          onChange={(e) =>
                            updateConfig({ notes: e.target.value } as any)
                          }
                          placeholder="Add any notes to the item here"
                          className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y"
                        />
                      </div>
                    </SectionCard>

                    {/* Validation */}
                    {!validation.isValid && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                        <p className="font-semibold mb-1">
                          Invalid configuration, please go back and change the
                          options to satisfy this criteria
                        </p>
                        <ul className="list-disc ml-4">
                          <li>{validation.message}</li>
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {config.type === ProductType.FrenchDoor && (
                  <>
                    {/* Master Handle */}
                    <SectionCard title="Master Handle">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Left", value: "left" },
                            { label: "Right", value: "right" },
                          ]}
                          value={(config as any).masterHandle || "right"}
                          onChange={(v) =>
                            updateConfig({ masterHandle: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Opening Direction */}
                    <SectionCard title="Opening Direction">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Open In", value: "in" },
                            { label: "Open Out", value: "out" },
                          ]}
                          value={(config as any).openingDirection || "out"}
                          onChange={(v) =>
                            updateConfig({ openingDirection: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Colours */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Cills */}
                    <SectionCard title="Cill">
                      <CillSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Threshold */}
                    <SectionCard title="Threshold">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            updateConfig({
                              threshold: "standard",
                              thresholdRamp: undefined, // Reset ramp on standard
                            } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "standard"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/standard.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Standard 55mm
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "low" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "low"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/low.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Low 20mm
                          </span>
                        </button>
                      </div>
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => {
                          const sideKey = side.toLowerCase() as
                            | "left"
                            | "top"
                            | "right";
                          return (
                            <div
                              key={side}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-slate-600">
                                Addon {side}
                              </span>
                              <select
                                value={
                                  (config as DoorConfig).addons?.[sideKey] ||
                                  "None"
                                }
                                onChange={(e) => {
                                  const val =
                                    e.target.value === "None"
                                      ? null
                                      : e.target.value;
                                  const currentAddons = (config as DoorConfig)
                                    .addons || {
                                    left: null,
                                    right: null,
                                    top: null,
                                  };
                                  updateConfig({
                                    addons: {
                                      ...currentAddons,
                                      [sideKey]: val,
                                    },
                                  } as any);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28"
                              >
                                <option value="None">None</option>
                                <option value="20mm Addon">20mm</option>
                                <option value="38mm Addon">38mm</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>

                    {/* Transom */}
                    <SectionCard title="Transom Bars">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Transom Bars
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).transomBars || 0;
                              if (current > 0)
                                updateConfig({
                                  transomBars: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {(config as DoorConfig).transomBars || 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).transomBars || 0;
                              updateConfig({ transomBars: current + 1 } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                        <span className="text-sm text-slate-600">
                          Number of Astragal Bars (Vertical)
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).astragalBars || 0;
                              if (current > 0)
                                updateConfig({
                                  astragalBars: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {(config as DoorConfig).astragalBars || 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).astragalBars || 0;
                              updateConfig({
                                astragalBars: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Trickle Vents */}
                    <SectionCard title="Trickle Vents">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Trickle Vents
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as DoorConfig).trickleVents ===
                                  "number"
                                  ? ((config as DoorConfig)
                                    .trickleVents as number)
                                  : (config as DoorConfig).trickleVents
                                    ? 1
                                    : 0;
                              if (current > 0)
                                updateConfig({
                                  trickleVents: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {typeof (config as DoorConfig).trickleVents ===
                              "number"
                              ? (config as DoorConfig).trickleVents
                              : (config as DoorConfig).trickleVents
                                ? 1
                                : 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as DoorConfig).trickleVents ===
                                  "number"
                                  ? ((config as DoorConfig)
                                    .trickleVents as number)
                                  : (config as DoorConfig).trickleVents
                                    ? 1
                                    : 0;
                              updateConfig({
                                trickleVents: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Options - Copied from Bifold to match French Door requirements */}
                    <SectionCard title="Glass Options">
                      <div className="space-y-4">
                        {/* Additional Glass Options */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as DoorConfig).pas24 || false}
                              onChange={(e) =>
                                updateConfig({ pas24: e.target.checked } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as DoorConfig).glassThickness !==
                                  undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as DoorConfig).glassThickness !==
                              undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                  <span className="text-sm text-slate-600">
                                    Glass Thickness
                                  </span>
                                  <input
                                    type="number"
                                    value={
                                      (config as DoorConfig).glassThickness || ""
                                    }
                                    onChange={(e) =>
                                      updateConfig({
                                        glassThickness:
                                          parseInt(e.target.value) || 0,
                                      } as any)
                                    }
                                    className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                  />
                                  <span className="text-sm text-slate-600">
                                    mm
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscure",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Clear";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as DoorConfig).glassType === opt.value
                                  ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(config as DoorConfig).glassType === "toughened" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Glass Option
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Low E (1.2 u-value)",
                                "6.8 Laminated (1.2 u-value)",
                                "Low E (1.0 u-value)",
                                "6.8 Acoustic Laminated (1.2 u-value)",
                                "Triple Glazed (0.6 u-value)",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as DoorConfig).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {(config as DoorConfig).glassType ===
                          "toughened_obscure" && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-slate-600">
                                Obscure Pattern
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  "Arctic (L5)",
                                  "Autumn (L3)",
                                  "Contora (L4)",
                                  "Cotswold (L5)",
                                  "Reeded (L2)",
                                  "Stippolyte (L4)",
                                  "Cassini (L5)",
                                  "Chantilly (L2)",
                                  "Charcoal Sticks (L4)",
                                  "Digital (L3)",
                                  "Everglade (L5)",
                                  "Flemish (L1)",
                                  "Florielle (L4)",
                                  "Mayflower (L4)",
                                  "Minster (L2)",
                                  "Oak (L4)",
                                  "Pelerine (L4)",
                                  "Sycamore (L2)",
                                  "Taffeta (L3)",
                                  "Warwick (L1)",
                                  "Satin",
                                ].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      updateConfig({
                                        glassPattern: opt,
                                      } as any)
                                    }
                                    className={`p-2 text-xs border rounded-lg transition-all ${(config as DoorConfig).glassPattern === opt
                                      ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </SectionCard>

                    {/* Hardware */}
                    <SectionCard title="Hardware Colour">
                      <HardwareSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Extras */}
                    <SectionCard title="Extras">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.extras?.includes("corner_post")}
                            onChange={(e) => {
                              const newExtras = new Set(config.extras || []);
                              if (e.target.checked)
                                newExtras.add("corner_post");
                              else newExtras.delete("corner_post");
                              updateConfig({
                                extras: Array.from(newExtras),
                              } as any);
                            }}
                            className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                          />
                          <span className="text-slate-700 font-medium">
                            Corner Post
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.extras?.includes("flat_pack")}
                            onChange={(e) => {
                              const newExtras = new Set(config.extras || []);
                              if (e.target.checked) newExtras.add("flat_pack");
                              else newExtras.delete("flat_pack");
                              updateConfig({
                                extras: Array.from(newExtras),
                              } as any);
                            }}
                            className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                          />
                          <span className="text-slate-700 font-medium">
                            Flat Pack
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={config.notes || ""}
                          onChange={(e) =>
                            updateConfig({ notes: e.target.value } as any)
                          }
                          placeholder="Any special requirements or notes..."
                          className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── SLIDER CONTROLS ── */}
                {config.type === ProductType.Slider && (
                  <>
                    <SectionCard title="Slide Panels">
                      <div className="flex gap-2">
                        {[2, 3, 4].map((p) => {
                          let isValid = false;
                          const w = config.width;
                          if (p === 2) isValid = w >= 1000 && w < 6000;
                          if (p === 3) isValid = w >= 1500 && w < 8000;
                          if (p === 4) isValid = w >= 2000;

                          return (
                            <button
                              key={p}
                              onClick={() => {
                                if (isValid) updateConfig({ panels: p } as any);
                              }}
                              disabled={!isValid}
                              className={`flex-1 py-2 text-sm border rounded-lg transition-colors ${(config as SliderConfig).panels === p
                                ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                : isValid
                                  ? "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                                }`}
                            >
                              {p} Panes
                            </button>
                          );
                        })}
                      </div>
                    </SectionCard>
                    <SectionCard title="Configuration">
                      <div className="flex gap-4">
                        {(() => {
                          const panels = (config as SliderConfig).panels;
                          let options: {
                            label: string;
                            value: string;
                            icon: React.ReactNode;
                          }[] = [];

                          if (panels === 4) {
                            options = [
                              {
                                label: "Middle",
                                value: "center",
                                icon: (
                                  <svg
                                    viewBox="0 0 100 60"
                                    className="w-12 h-12 stroke-slate-800 fill-none stroke-2 center"
                                  >
                                    <rect
                                      x="2"
                                      y="5"
                                      width="96"
                                      height="50"
                                      rx="1"
                                    />
                                    <line x1="26" y1="5" x2="26" y2="55" />
                                    <line x1="50" y1="5" x2="50" y2="55" />
                                    <line x1="74" y1="5" x2="74" y2="55" />
                                    {/* Arrows for middle opening */}
                                    <path d="M40 30h-10m3 3l-3-3 3-3" />
                                    <path d="M60 30h10m-3 3l3-3-3-3" />
                                  </svg>
                                ),
                              },
                            ];
                          } else {
                            // 2 or 3 panels
                            options = [
                              {
                                label: "Left",
                                value: "left",
                                icon: (
                                  <svg
                                    viewBox="0 0 100 60"
                                    className="w-12 h-12 stroke-slate-800 fill-none stroke-2"
                                  >
                                    <rect
                                      x="2"
                                      y="5"
                                      width="96"
                                      height="50"
                                      rx="1"
                                    />
                                    <line x1="50" y1="5" x2="50" y2="55" />
                                    {/* Arrow Left */}
                                    <path d="M70 30H30m3 3l-3-3 3-3" />
                                  </svg>
                                ),
                              },
                              {
                                label: "Right",
                                value: "right",
                                icon: (
                                  <svg
                                    viewBox="0 0 100 60"
                                    className="w-12 h-12 stroke-slate-800 fill-none stroke-2"
                                  >
                                    <rect
                                      x="2"
                                      y="5"
                                      width="96"
                                      height="50"
                                      rx="1"
                                    />
                                    <line x1="50" y1="5" x2="50" y2="55" />
                                    {/* Arrow Right */}
                                    <path d="M30 30h40m-3 3l3-3-3-3" />
                                  </svg>
                                ),
                              },
                              {
                                label: panels === 3 ? "Both (Right)" : "Both",
                                value: "both",
                                icon: (
                                  <svg
                                    viewBox="0 0 100 60"
                                    className="w-12 h-12 stroke-slate-800 fill-none stroke-2"
                                  >
                                    <rect
                                      x="2"
                                      y="5"
                                      width="96"
                                      height="50"
                                      rx="1"
                                    />
                                    <line x1="50" y1="5" x2="50" y2="55" />
                                    {/* Arrows Both In */}
                                    <path d="M20 30h20m-3 3l3-3-3-3" />
                                    <path d="M80 30H60m3 3l-3-3 3-3" />
                                  </svg>
                                ),
                              },
                            ];
                          }

                          return options.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                updateConfig({
                                  slideDirection: opt.value,
                                } as any)
                              }
                              className={`flex flex-col items-center justify-center p-4 border rounded-lg w-32 h-40 gap-4 transition-all ${(config as SliderConfig).slideDirection ===
                                opt.value
                                ? "bg-white border-slate-900 ring-1 ring-slate-900 shadow-sm"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                            >
                              {opt.icon}
                              <span className="text-sm font-medium text-slate-700">
                                {opt.label}
                              </span>
                            </button>
                          ));
                        })()}
                      </div>
                    </SectionCard>

                    {/* Frame Colour */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Cill */}
                    <SectionCard title="Cill">
                      <CillSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Threshold */}
                    <SectionCard title="Threshold">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "standard" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "standard"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/standard.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Standard
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "low" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "low"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/low.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Low
                          </span>
                        </button>
                      </div>
                    </SectionCard>

                    {/* Glass Type */}
                    <SectionCard title="Glass Type">
                      <div className="space-y-4">
                        {/* PAS 24 & Glass Thickness */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as any).pas24 || false}
                              onChange={(e) =>
                                updateConfig({ pas24: e.target.checked } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as any).glassThickness !== undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as any).glassThickness !== undefined && (
                              <div className="flex items-center gap-2 ml-6">
                                <span className="text-sm text-slate-600">
                                  Glass Thickness
                                </span>
                                <input
                                  type="number"
                                  value={(config as any).glassThickness || ""}
                                  onChange={(e) =>
                                    updateConfig({
                                      glassThickness:
                                        parseInt(e.target.value) || 0,
                                    } as any)
                                  }
                                  className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                />
                                <span className="text-sm text-slate-600">
                                  mm
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Glass Type Options */}
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscure",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Clear";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as any).glassType === opt.value
                                  ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Blinds */}
                        {(config as any).glassType === "toughened" && (
                          <div className="flex flex-col gap-3 pt-2">
                            <span className="text-sm text-slate-600 font-medium">
                              Blinds
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                              {/* No Blinds */}
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "none",
                                    blindsColour: undefined,
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${!(config as any).blinds ||
                                  (config as any).blinds === "none"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-400 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  No Blinds
                                </span>
                              </button>

                              {/* Mechanical Blinds */}
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "mechanical",
                                    blindsColour:
                                      (config as any).blindsColour || "White",
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${(config as any).blinds === "mechanical"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 40 40"
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="28"
                                    height="32"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <line
                                    x1="8"
                                    y1="10"
                                    x2="32"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="14"
                                    x2="32"
                                    y2="14"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="18"
                                    x2="32"
                                    y2="18"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="22"
                                    x2="32"
                                    y2="22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="26"
                                    x2="32"
                                    y2="26"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  Mechanical Blinds
                                </span>
                              </button>
                            </div>

                            {/* Blinds Colour */}
                            {(config as any).blinds === "mechanical" && (
                              <div className="flex flex-col gap-2 mt-2">
                                <span className="text-sm text-slate-600 font-medium">
                                  Blinds Colour
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    "White",
                                    "Yellow",
                                    "Agate Grey",
                                    "Beige",
                                    "Green",
                                    "Light Blue",
                                    "Cream",
                                    "Light Grey",
                                    "Metallic Silver",
                                    "Silver",
                                    "Slate Grey",
                                    "Anthracite",
                                    "Black",
                                  ].map((colour) => (
                                    <button
                                      key={colour}
                                      onClick={() =>
                                        updateConfig({
                                          blindsColour: colour,
                                        } as any)
                                      }
                                      className={`p-2 text-xs border rounded-lg transition-all text-center ${(config as any).blindsColour === colour
                                        ? "bg-sky-50 border-sky-300 text-sky-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                      {colour}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Toughened Obscure Sub-options */}
                        {(config as any).glassType === "toughened_obscure" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Obscure Pattern
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                "Arctic (L5)",
                                "Autumn (L3)",
                                "Contora (L4)",
                                "Cotswold (L5)",
                                "Reeded (L2)",
                                "Stippolyte (L4)",
                                "Cassini (L5)",
                                "Chantilly (L2)",
                                "Charcoal Sticks (L4)",
                                "Digital (L3)",
                                "Everglade (L5)",
                                "Flemish (L1)",
                                "Florielle (L4)",
                                "Mayflower (L4)",
                                "Minster (L2)",
                                "Oak (L4)",
                                "Pelerine (L4)",
                                "Sycamore (L2)",
                                "Taffeta (L3)",
                                "Warwick (L1)",
                                "Satin",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-2 text-xs border rounded-lg transition-all ${(config as any).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => {
                          const sideKey = side.toLowerCase() as
                            | "left"
                            | "top"
                            | "right";
                          return (
                            <div
                              key={side}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-slate-600">
                                Addon {side}
                              </span>
                              <select
                                value={
                                  (config as any).addons?.[sideKey] || "None"
                                }
                                onChange={(e) => {
                                  const val =
                                    e.target.value === "None"
                                      ? null
                                      : e.target.value;
                                  const currentAddons = (config as any)
                                    .addons || {
                                    left: null,
                                    right: null,
                                    top: null,
                                  };
                                  updateConfig({
                                    addons: {
                                      ...currentAddons,
                                      [sideKey]: val,
                                    },
                                  } as any);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28"
                              >
                                <option value="None">None</option>
                                <option value="20mm Addon">20mm</option>
                                <option value="38mm Addon">38mm</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>

                    {/* Trickle Vents */}
                    <SectionCard title="Trickle Vents">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Trickle Vents
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as any).trickleVents === "number"
                                  ? ((config as any).trickleVents as number)
                                  : (config as any).trickleVents
                                    ? 1
                                    : 0;
                              if (current > 0)
                                updateConfig({
                                  trickleVents: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {typeof (config as any).trickleVents === "number"
                              ? (config as any).trickleVents
                              : (config as any).trickleVents
                                ? 1
                                : 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as any).trickleVents === "number"
                                  ? ((config as any).trickleVents as number)
                                  : (config as any).trickleVents
                                    ? 1
                                    : 0;
                              updateConfig({
                                trickleVents: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Hardware */}
                    <SectionCard title="Hardware Colour">
                      <HardwareSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Extras */}
                    <SectionCard title="Extras">
                      <div className="space-y-6">
                        <div>
                          <div className="space-y-2">
                            {["Corner Post", "Flat Pack"].map((extra) => (
                              <label
                                key={extra}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={(config.extras || []).includes(
                                    extra,
                                  )}
                                  onChange={(e) => {
                                    const currentExtras = config.extras || [];
                                    const newExtras = e.target.checked
                                      ? [...currentExtras, extra]
                                      : currentExtras.filter(
                                        (ex) => ex !== extra,
                                      );
                                    updateConfig({
                                      extras: newExtras,
                                    } as any);
                                  }}
                                  className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-slate-700">
                                  {extra}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            value={config.notes || ""}
                            onChange={(e) =>
                              updateConfig({ notes: e.target.value } as any)
                            }
                            placeholder="Any special requirements or notes..."
                            className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                          />
                        </div>
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── SINGLE DOOR CONTROLS ── */}
                {config.type === ProductType.SingleDoor && (
                  <>
                    {/* Handle Side */}
                    <SectionCard title="Handle Side">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Left", value: "left" },
                            { label: "Right", value: "right" },
                          ]}
                          value={(config as any).masterHandle || "right"}
                          onChange={(v) =>
                            updateConfig({ masterHandle: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Opening Direction */}
                    <SectionCard title="Opening Direction">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Open In", value: "in" },
                            { label: "Open Out", value: "out" },
                          ]}
                          value={(config as any).openingDirection || "out"}
                          onChange={(v) =>
                            updateConfig({ openingDirection: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Colours */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Cills */}
                    <SectionCard title="Cill">
                      <CillSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Threshold */}
                    <SectionCard title="Threshold">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "standard" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "standard"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/standard.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Standard 55mm
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "low" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "low"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/low.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Low 20mm
                          </span>
                        </button>
                      </div>
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => {
                          const sideKey = side.toLowerCase() as
                            | "left"
                            | "top"
                            | "right";
                          return (
                            <div
                              key={side}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-slate-600">
                                Addon {side}
                              </span>
                              <select
                                value={
                                  (config as DoorConfig).addons?.[sideKey] ||
                                  "None"
                                }
                                onChange={(e) => {
                                  const val =
                                    e.target.value === "None"
                                      ? null
                                      : e.target.value;
                                  const currentAddons = (config as DoorConfig)
                                    .addons || {
                                    left: null,
                                    right: null,
                                    top: null,
                                  };
                                  updateConfig({
                                    addons: {
                                      ...currentAddons,
                                      [sideKey]: val,
                                    },
                                  } as any);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28"
                              >
                                <option value="None">None</option>
                                <option value="20mm Addon">20mm</option>
                                <option value="38mm Addon">38mm</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>

                    {/* Transom */}
                    <SectionCard title="Transom Bars">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Transom Bars
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).transomBars || 0;
                              if (current > 0)
                                updateConfig({
                                  transomBars: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {(config as DoorConfig).transomBars || 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).transomBars || 0;
                              updateConfig({ transomBars: current + 1 } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                        <span className="text-sm text-slate-600">
                          Number of Astragal Bars (Vertical)
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).astragalBars || 0;
                              if (current > 0)
                                updateConfig({
                                  astragalBars: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {(config as DoorConfig).astragalBars || 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                (config as DoorConfig).astragalBars || 0;
                              updateConfig({
                                astragalBars: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Trickle Vents */}
                    <SectionCard title="Trickle Vents">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Trickle Vents
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as DoorConfig).trickleVents ===
                                  "number"
                                  ? ((config as DoorConfig)
                                    .trickleVents as number)
                                  : (config as DoorConfig).trickleVents
                                    ? 1
                                    : 0;
                              if (current > 0)
                                updateConfig({
                                  trickleVents: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {typeof (config as DoorConfig).trickleVents ===
                              "number"
                              ? (config as DoorConfig).trickleVents
                              : (config as DoorConfig).trickleVents
                                ? 1
                                : 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as DoorConfig).trickleVents ===
                                  "number"
                                  ? ((config as DoorConfig)
                                    .trickleVents as number)
                                  : (config as DoorConfig).trickleVents
                                    ? 1
                                    : 0;
                              updateConfig({
                                trickleVents: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Options - Copied from Bifold to match French Door requirements */}
                    <SectionCard title="Glass Options">
                      <div className="space-y-4">
                        {/* Additional Glass Options */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as DoorConfig).pas24 || false}
                              onChange={(e) =>
                                updateConfig({ pas24: e.target.checked } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as DoorConfig).glassThickness !==
                                  undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as DoorConfig).glassThickness !==
                              undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                  <span className="text-sm text-slate-600">
                                    Glass Thickness
                                  </span>
                                  <input
                                    type="number"
                                    value={
                                      (config as DoorConfig).glassThickness || ""
                                    }
                                    onChange={(e) =>
                                      updateConfig({
                                        glassThickness:
                                          parseInt(e.target.value) || 0,
                                      } as any)
                                    }
                                    className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                  />
                                  <span className="text-sm text-slate-600">
                                    mm
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscure",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Clear";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as DoorConfig).glassType === opt.value
                                  ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(config as DoorConfig).glassType === "toughened" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Glass Option
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Low E (1.2 u-value)",
                                "6.8 Laminated (1.2 u-value)",
                                "Low E (1.0 u-value)",
                                "6.8 Acoustic Laminated (1.2 u-value)",
                                "Triple Glazed (0.6 u-value)",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as DoorConfig).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {(config as DoorConfig).glassType ===
                          "toughened_obscure" && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-slate-600">
                                Obscure Pattern
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  "Arctic (L5)",
                                  "Autumn (L3)",
                                  "Contora (L4)",
                                  "Cotswold (L5)",
                                  "Reeded (L2)",
                                  "Stippolyte (L4)",
                                  "Cassini (L5)",
                                  "Chantilly (L2)",
                                  "Charcoal Sticks (L4)",
                                  "Digital (L3)",
                                  "Everglade (L5)",
                                  "Flemish (L1)",
                                  "Florielle (L4)",
                                  "Mayflower (L4)",
                                  "Minster (L2)",
                                  "Oak (L4)",
                                  "Pelerine (L4)",
                                  "Sycamore (L2)",
                                  "Taffeta (L3)",
                                  "Warwick (L1)",
                                  "Satin",
                                ].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      updateConfig({
                                        glassPattern: opt,
                                      } as any)
                                    }
                                    className={`p-2 text-xs border rounded-lg transition-all ${(config as DoorConfig).glassPattern === opt
                                      ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </SectionCard>

                    {/* Hardware */}
                    <SectionCard title="Hardware Colour">
                      <HardwareSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Extras */}
                    <SectionCard title="Extras">
                      <div className="space-y-6">
                        <div>
                          <div className="space-y-2">
                            {["Corner Post", "Flat Pack", "Door Panel"].map(
                              (extra) => (
                                <label
                                  key={extra}
                                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={(config.extras || []).includes(
                                      extra,
                                    )}
                                    onChange={(e) => {
                                      const currentExtras = config.extras || [];
                                      const newExtras = e.target.checked
                                        ? [...currentExtras, extra]
                                        : currentExtras.filter(
                                          (ex) => ex !== extra,
                                        );
                                      updateConfig({
                                        extras: newExtras,
                                      } as any);
                                    }}
                                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                                  />
                                  <span className="text-sm text-slate-700">
                                    {extra}
                                  </span>
                                </label>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            value={config.notes || ""}
                            onChange={(e) =>
                              updateConfig({ notes: e.target.value } as any)
                            }
                            placeholder="Any special requirements or notes..."
                            className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                          />
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Type */}
                    <SectionCard title="Glass Type">
                      <div className="space-y-4">
                        {/* PAS 24 & Glass Thickness */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as any).pas24 || false}
                              onChange={(e) =>
                                updateConfig({ pas24: e.target.checked } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as any).glassThickness !== undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as any).glassThickness !== undefined && (
                              <div className="flex items-center gap-2 ml-6">
                                <span className="text-sm text-slate-600">
                                  Glass Thickness
                                </span>
                                <input
                                  type="number"
                                  value={(config as any).glassThickness || ""}
                                  onChange={(e) =>
                                    updateConfig({
                                      glassThickness:
                                        parseInt(e.target.value) || 0,
                                    } as any)
                                  }
                                  className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                />
                                <span className="text-sm text-slate-600">
                                  mm
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Glass Type Options */}
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscure",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Clear";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as any).glassType === opt.value
                                  ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Blinds — shown when Toughened is selected */}
                        {(config as any).glassType === "toughened" && (
                          <div className="flex flex-col gap-3 pt-2">
                            <span className="text-sm text-slate-600 font-medium">
                              Blinds
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                              {/* No Blinds */}
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "none",
                                    blindsColour: undefined,
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${!(config as any).blinds ||
                                  (config as any).blinds === "none"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-400 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  No Blinds
                                </span>
                              </button>

                              {/* Mechanical Blinds */}
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "mechanical",
                                    blindsColour:
                                      (config as any).blindsColour || "White",
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${(config as any).blinds === "mechanical"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 40 40"
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="28"
                                    height="32"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <line
                                    x1="8"
                                    y1="10"
                                    x2="32"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="14"
                                    x2="32"
                                    y2="14"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="18"
                                    x2="32"
                                    y2="18"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="22"
                                    x2="32"
                                    y2="22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="26"
                                    x2="32"
                                    y2="26"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  Mechanical Blinds
                                </span>
                              </button>
                            </div>

                            {/* Blinds Colour — shown when Mechanical Blinds selected */}
                            {(config as any).blinds === "mechanical" && (
                              <div className="flex flex-col gap-2 mt-2">
                                <span className="text-sm text-slate-600 font-medium">
                                  Blinds Colour
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    "White",
                                    "Yellow",
                                    "Agate Grey",
                                    "Beige",
                                    "Green",
                                    "Light Blue",
                                    "Cream",
                                    "Light Grey",
                                    "Metallic Silver",
                                    "Silver",
                                    "Slate Grey",
                                    "Anthracite",
                                    "Black",
                                  ].map((colour) => (
                                    <button
                                      key={colour}
                                      onClick={() =>
                                        updateConfig({
                                          blindsColour: colour,
                                        } as any)
                                      }
                                      className={`py-2 px-2 text-sm rounded-lg border transition-all ${(config as any).blindsColour === colour
                                        ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                      {colour}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Toughened Sub-options */}
                        {(config as any).glassType === "toughened" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Glass Option
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Low E (1.2 u-value)",
                                "6.8 Laminated (1.2 u-value)",
                                "Low E (1.0 u-value)",
                                "6.8 Acoustic Laminated (1.2 u-value)",
                                "Triple Glazed (0.6 u-value)",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as any).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Toughened Obscure Sub-options */}
                        {(config as any).glassType === "toughened_obscure" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Obscure Pattern
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                "Arctic (L5)",
                                "Autumn (L3)",
                                "Contora (L4)",
                                "Cotswold (L5)",
                                "Reeded (L2)",
                                "Stippolyte (L4)",
                                "Cassini (L5)",
                                "Chantilly (L2)",
                                "Charcoal Sticks (L4)",
                                "Digital (L3)",
                                "Everglade (L5)",
                                "Flemish (L1)",
                                "Florielle (L4)",
                                "Mayflower (L4)",
                                "Minster (L2)",
                                "Oak (L4)",
                                "Pelerine (L4)",
                                "Sycamore (L2)",
                                "Taffeta (L3)",
                                "Warwick (L1)",
                                "Satin",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-2 text-xs border rounded-lg transition-all ${(config as any).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── SINGLE DOOR CONTROLS ── */}
                {config.type === ProductType.SingleDoor && (
                  <>
                    {/* Handle Side */}
                    <SectionCard title="Handle Side">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Left", value: "left" },
                            { label: "Right", value: "right" },
                          ]}
                          value={(config as any).masterHandle || "right"}
                          onChange={(v) =>
                            updateConfig({ masterHandle: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Opening Direction */}
                    <SectionCard title="Opening Direction">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Open In", value: "in" },
                            { label: "Open Out", value: "out" },
                          ]}
                          value={(config as any).openingDirection || "out"}
                          onChange={(v) =>
                            updateConfig({ openingDirection: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Colours */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Cills */}
                    <SectionCard title="Cill">
                      <CillSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Threshold */}
                    <SectionCard title="Threshold">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "standard" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "standard"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/standard.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Standard 55mm
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "low" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "low"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/low.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Low 20mm
                          </span>
                        </button>
                      </div>
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => (
                          <div
                            key={side}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-slate-600">
                              Addon {side}
                            </span>
                            <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28">
                              <option>None</option>
                              <option>20mm</option>
                              <option>38mm</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Transom */}
                    <SectionCard title="Transom Bars">
                      <div className="flex justify-center">
                        <button className="px-5 py-2.5 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-colors text-sm font-medium">
                          Edit Transoms
                        </button>
                      </div>
                    </SectionCard>

                    {/* Trickle Vents */}
                    <SectionCard title="Trickle Vents">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Add Trickle Vents
                        </span>
                        <ToggleGroup
                          options={[
                            { label: "No", value: "no" },
                            { label: "Yes", value: "yes" },
                          ]}
                          value={config.trickleVents ? "yes" : "no"}
                          onChange={(v) =>
                            updateConfig({ trickleVents: v === "yes" } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Hardware */}
                    <SectionCard title="Hardware Colour">
                      <HardwareSection
                        config={config as any}
                        onChange={updateConfig as any}
                      />
                    </SectionCard>

                    {/* Extras */}
                    <SectionCard title="Extras">
                      <div className="space-y-6">
                        <div>
                          <div className="space-y-2">
                            {["Corner Post", "Flat Pack", "Door Panel"].map(
                              (extra) => (
                                <label
                                  key={extra}
                                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={(config.extras || []).includes(
                                      extra,
                                    )}
                                    onChange={(e) => {
                                      const currentExtras = config.extras || [];
                                      const newExtras = e.target.checked
                                        ? [...currentExtras, extra]
                                        : currentExtras.filter(
                                          (ex) => ex !== extra,
                                        );
                                      updateConfig({
                                        extras: newExtras,
                                      } as any);
                                    }}
                                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                                  />
                                  <span className="text-sm text-slate-700">
                                    {extra}
                                  </span>
                                </label>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            value={config.notes || ""}
                            onChange={(e) =>
                              updateConfig({ notes: e.target.value } as any)
                            }
                            placeholder="Any special requirements or notes..."
                            className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                          />
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Type */}
                    <SectionCard title="Glass Type">
                      <div className="space-y-4">
                        {/* PAS 24 & Glass Thickness */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as any).pas24 || false}
                              onChange={(e) =>
                                updateConfig({ pas24: e.target.checked } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as any).glassThickness !== undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as any).glassThickness !== undefined && (
                              <div className="flex items-center gap-2 ml-6">
                                <span className="text-sm text-slate-600">
                                  Glass Thickness
                                </span>
                                <input
                                  type="number"
                                  value={(config as any).glassThickness || ""}
                                  onChange={(e) =>
                                    updateConfig({
                                      glassThickness:
                                        parseInt(e.target.value) || 0,
                                    } as any)
                                  }
                                  className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                />
                                <span className="text-sm text-slate-600">
                                  mm
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Glass Type Options */}
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscure",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Clear";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as any).glassType === opt.value
                                  ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Blinds — shown when Toughened is selected */}
                        {(config as any).glassType === "toughened" && (
                          <div className="flex flex-col gap-3 pt-2">
                            <span className="text-sm text-slate-600 font-medium">
                              Blinds
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                              {/* No Blinds */}
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "none",
                                    blindsColour: undefined,
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${!(config as any).blinds ||
                                  (config as any).blinds === "none"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-400 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  No Blinds
                                </span>
                              </button>

                              {/* Mechanical Blinds */}
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "mechanical",
                                    blindsColour:
                                      (config as any).blindsColour || "White",
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${(config as any).blinds === "mechanical"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 40 40"
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="28"
                                    height="32"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <line
                                    x1="8"
                                    y1="10"
                                    x2="32"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="14"
                                    x2="32"
                                    y2="14"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="18"
                                    x2="32"
                                    y2="18"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="22"
                                    x2="32"
                                    y2="22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="26"
                                    x2="32"
                                    y2="26"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  Mechanical Blinds
                                </span>
                              </button>
                            </div>

                            {/* Blinds Colour — shown when Mechanical Blinds selected */}
                            {(config as any).blinds === "mechanical" && (
                              <div className="flex flex-col gap-2 mt-2">
                                <span className="text-sm text-slate-600 font-medium">
                                  Blinds Colour
                                </span>
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    "White",
                                    "Yellow",
                                    "Agate Grey",
                                    "Beige",
                                    "Green",
                                    "Light Blue",
                                    "Cream",
                                    "Light Grey",
                                    "Metallic Silver",
                                    "Silver",
                                    "Slate Grey",
                                    "Anthracite",
                                    "Black",
                                  ].map((colour) => (
                                    <button
                                      key={colour}
                                      onClick={() =>
                                        updateConfig({
                                          blindsColour: colour,
                                        } as any)
                                      }
                                      className={`py-2 px-2 text-sm rounded-lg border transition-all ${(config as any).blindsColour === colour
                                        ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                    >
                                      {colour}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Toughened Sub-options */}
                        {(config as any).glassType === "toughened" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Glass Option
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Low E (1.2 u-value)",
                                "6.8 Laminated (1.2 u-value)",
                                "Low E (1.0 u-value)",
                                "6.8 Acoustic Laminated (1.2 u-value)",
                                "Triple Glazed (0.6 u-value)",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as any).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Toughened Obscure Sub-options */}
                        {(config as any).glassType === "toughened_obscure" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Obscure Pattern
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                "Arctic (L5)",
                                "Autumn (L3)",
                                "Contora (L4)",
                                "Cotswold (L5)",
                                "Reeded (L2)",
                                "Stippolyte (L4)",
                                "Cassini (L5)",
                                "Chantilly (L2)",
                                "Charcoal Sticks (L4)",
                                "Digital (L3)",
                                "Everglade (L5)",
                                "Flemish (L1)",
                                "Florielle (L4)",
                                "Mayflower (L4)",
                                "Minster (L2)",
                                "Oak (L4)",
                                "Pelerine (L4)",
                                "Sycamore (L2)",
                                "Taffeta (L3)",
                                "Warwick (L1)",
                                "Satin",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-2 text-xs border rounded-lg transition-all ${(config as any).glassPattern === opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── BIFOLD CONTROLS ── */}
                {config.type === ProductType.Bifold && (
                  <>
                    {/* Number of Panes */}
                    <SectionCard title="Number of Panes">
                      <div className="flex justify-center gap-2">
                        {getNumberOfPanel(panel)?.map((num) => (
                          <button
                            key={num}
                            onClick={() =>
                              updateConfig({
                                panels: num,
                                configuration: `${num}+0`,
                                type: ProductType.Bifold,
                              } as any)
                            }
                            className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all min-w-20 ${(config as BifoldConfig).panels === num
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Configuration Diagrams */}
                    <SectionCard title="Configuration">
                      <ConfigurationSection
                        config={config as BifoldConfig}
                        onChange={updateConfig}
                      />
                    </SectionCard>

                    {/* Opening Direction */}
                    <SectionCard title="Opening Direction">
                      <div className="flex justify-center">
                        <ToggleGroup
                          options={[
                            { label: "Open In", value: "in" },
                            { label: "Open Out", value: "out" },
                          ]}
                          value={(config as any).openingDirection || "left"}
                          onChange={(v) =>
                            updateConfig({ openingDirection: v } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Traffic Door */}
                    <SectionCard title="Traffic Door">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Enable Traffic Door
                        </span>
                        <ToggleGroup
                          options={[
                            { label: "No", value: "no" },
                            { label: "Yes", value: "yes" },
                          ]}
                          value={
                            (config as BifoldConfig).trafficDoor ? "yes" : "no"
                          }
                          onChange={(v) =>
                            updateConfig({ trafficDoor: v === "yes" } as any)
                          }
                        />
                      </div>
                    </SectionCard>

                    {/* Colours */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as BifoldConfig}
                        onChange={updateConfig}
                      />
                    </SectionCard>

                    <SectionCard title="Glass Options">
                      <div className="space-y-4">
                        {/* Additional Glass Options */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as BifoldConfig).pas24 || false}
                              onChange={(e) =>
                                updateConfig({
                                  pas24: e.target.checked,
                                } as any)
                              }
                              className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              PAS 24 Certified
                            </span>
                          </label>

                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  (config as BifoldConfig).glassThickness !==
                                  undefined
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    updateConfig({
                                      glassThickness: 28,
                                    } as any);
                                  } else {
                                    updateConfig({
                                      glassThickness: undefined,
                                    } as any);
                                  }
                                }}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                Specify Glass Thickness (if not 28mm)
                              </span>
                            </label>

                            {(config as BifoldConfig).glassThickness !==
                              undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                  <span className="text-sm text-slate-600">
                                    Glass Thickness
                                  </span>
                                  <input
                                    type="number"
                                    value={
                                      (config as BifoldConfig).glassThickness ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      updateConfig({
                                        glassThickness:
                                          parseInt(e.target.value) || 0,
                                      } as any)
                                    }
                                    className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
                                  />
                                  <span className="text-sm text-slate-600">
                                    mm
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "Unglazed", value: "unglazed" },
                              { label: "Toughened", value: "toughened" },
                              {
                                label: "Toughened Obscure",
                                value: "toughened_obscure",
                              },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => {
                                  let defaultPattern = null;
                                  if (opt.value === "toughened")
                                    defaultPattern = "Clear";
                                  if (opt.value === "toughened_obscure")
                                    defaultPattern = "Satin";
                                  updateConfig({
                                    glassType: opt.value as any,
                                    glassPattern: defaultPattern,
                                  } as any);
                                }}
                                className={`py-2 px-3 text-sm rounded-lg border transition-all ${(config as BifoldConfig).glassType ===
                                  opt.value
                                  ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(config as BifoldConfig).glassType === "toughened" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Glass Option
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Low E (1.2 u-value)",
                                "6.8 Laminated (1.2 u-value)",
                                "Low E (1.0 u-value)",
                                "6.8 Acoustic Laminated (1.2 u-value)",
                                "Triple Glazed (0.6 u-value)",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({
                                      glassPattern: opt,
                                    } as any)
                                  }
                                  className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as BifoldConfig).glassPattern ===
                                    opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {(config as BifoldConfig).glassType ===
                          "toughened_obscure" && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-slate-600">
                                Obscure Pattern
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  "Arctic (L5)",
                                  "Autumn (L3)",
                                  "Contora (L4)",
                                  "Cotswold (L5)",
                                  "Reeded (L2)",
                                  "Stippolyte (L4)",
                                  "Cassini (L5)",
                                  "Chantilly (L2)",
                                  "Charcoal Sticks (L4)",
                                  "Digital (L3)",
                                  "Everglade (L5)",
                                  "Flemish (L1)",
                                  "Florielle (L4)",
                                  "Mayflower (L4)",
                                  "Minster (L2)",
                                  "Oak (L4)",
                                  "Pelerine (L4)",
                                  "Sycamore (L2)",
                                  "Taffeta (L3)",
                                  "Warwick (L1)",
                                  "Satin",
                                ].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      updateConfig({
                                        glassPattern: opt,
                                      } as any)
                                    }
                                    className={`p-2 text-xs border rounded-lg transition-all ${(config as BifoldConfig).glassPattern ===
                                      opt
                                      ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </SectionCard>

                    {/* Cills */}
                    <SectionCard title="Cill">
                      <CillSection
                        config={config as BifoldConfig}
                        onChange={updateConfig}
                      />
                    </SectionCard>

                    {/* Threshold */}
                    <SectionCard title="Threshold">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "standard" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "standard"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/standard.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Standard 55mm
                          </span>
                        </button>
                        <button
                          onClick={() =>
                            updateConfig({ threshold: "low" } as any)
                          }
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${(config as any).threshold === "low"
                            ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                        >
                          <div className="h-12 w-full mb-2 relative">
                            <img
                              src="/images/aluminium_bifolf/low.png"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            Low 20mm
                          </span>
                        </button>
                      </div>

                      {/* Threshold Ramp (Only if low threshold selected) */}
                      {(config as BifoldConfig).threshold === "low" && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                            Threshold Ramp
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { label: "None", value: "none" },
                              { label: "Inside Ramp", value: "inside" },
                              { label: "Outside Ramp", value: "outside" },
                              { label: "Inside & Outside Ramp", value: "both" },
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() =>
                                  updateConfig({
                                    thresholdRamp: opt.value as any,
                                  } as any)
                                }
                                className={`py-3 px-2 text-sm border rounded-lg transition-all ${((config as BifoldConfig).thresholdRamp ||
                                  "none") === opt.value
                                  ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => {
                          const sideLower = side.toLowerCase() as
                            | "left"
                            | "top"
                            | "right";
                          return (
                            <div
                              key={side}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-slate-600">
                                Addon {side}
                              </span>
                              <select
                                value={
                                  (config as BifoldConfig).addons?.[
                                  sideLower
                                  ] || "None"
                                }
                                onChange={(e) => {
                                  const val =
                                    e.target.value === "None"
                                      ? null
                                      : e.target.value;
                                  const currentAddons = (config as BifoldConfig)
                                    .addons || {
                                    left: null,
                                    right: null,
                                    top: null,
                                  };
                                  updateConfig({
                                    addons: {
                                      ...currentAddons,
                                      [sideLower]: val,
                                    },
                                  } as any);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28"
                              >
                                <option>None</option>
                                <option>20mm</option>
                                <option>38mm</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>

                    {/* Transom */}
                    <SectionCard title="Transom Bars">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Transom Bars
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                (config as BifoldConfig).transomBars || 0;
                              if (current > 0)
                                updateConfig({
                                  transomBars: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {(config as BifoldConfig).transomBars || 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                (config as BifoldConfig).transomBars || 0;
                              updateConfig({ transomBars: current + 1 } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                        <span className="text-sm text-slate-600">
                          Number of Astragal Bars (Vertical)
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                (config as BifoldConfig).astragalBars || 0;
                              if (current > 0)
                                updateConfig({
                                  astragalBars: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {(config as BifoldConfig).astragalBars || 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                (config as BifoldConfig).astragalBars || 0;
                              updateConfig({
                                astragalBars: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Trickle Vents */}
                    <SectionCard title="Trickle Vents">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Number of Trickle Vents
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as BifoldConfig).trickleVents ===
                                  "number"
                                  ? ((config as BifoldConfig)
                                    .trickleVents as number)
                                  : (config as BifoldConfig).trickleVents
                                    ? 1
                                    : 0;
                              if (current > 0)
                                updateConfig({
                                  trickleVents: current - 1,
                                } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="text-smfont-medium w-4 text-center">
                            {typeof (config as BifoldConfig).trickleVents ===
                              "number"
                              ? ((config as BifoldConfig)
                                .trickleVents as number)
                              : (config as BifoldConfig).trickleVents
                                ? 1
                                : 0}
                          </span>
                          <button
                            onClick={() => {
                              const current =
                                typeof (config as BifoldConfig).trickleVents ===
                                  "number"
                                  ? ((config as BifoldConfig)
                                    .trickleVents as number)
                                  : (config as BifoldConfig).trickleVents
                                    ? 1
                                    : 0;
                              updateConfig({
                                trickleVents: current + 1,
                              } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Hardware */}
                    <SectionCard title="Hardware Colour">
                      <HardwareSection
                        config={config as BifoldConfig}
                        onChange={updateConfig}
                      />
                    </SectionCard>

                    {/* Extras & Notes */}
                    <SectionCard title="Extras & Notes">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-3">
                            Optional Extras
                          </label>
                          <div className="space-y-2">
                            {[
                              "External Handle",
                              "Corner Post",
                              "Adjustable Jamb",
                              "Flat Pack",
                            ].map((extra) => (
                              <label
                                key={extra}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={(config.extras || []).includes(
                                    extra,
                                  )}
                                  onChange={(e) => {
                                    const currentExtras = config.extras || [];
                                    const newExtras = e.target.checked
                                      ? [...currentExtras, extra]
                                      : currentExtras.filter(
                                        (ex) => ex !== extra,
                                      );
                                    updateConfig({ extras: newExtras } as any);
                                  }}
                                  className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                                />
                                <span className="text-sm text-slate-700">
                                  {extra}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            value={config.notes || ""}
                            onChange={(e) =>
                              updateConfig({ notes: e.target.value } as any)
                            }
                            placeholder="Any special requirements or notes..."
                            className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                          />
                        </div>
                      </div>
                    </SectionCard>
                  </>
                )}

                {/* ── SLIDER CONTROLS ── */}
                {config.type === ProductType.Slider && (
                  <>
                    {/* Number of Panes */}
                    <SectionCard title="Number of Panes">
                      <div className="flex justify-center gap-2">
                        {[2].map((num) => (
                          <button
                            key={num}
                            onClick={() =>
                              updateConfig({
                                panels: num,
                              } as any)
                            }
                            className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all min-w-28 ${(config as SliderConfig).panels === num
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            {num} Panes
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Configuration - slide direction */}
                    <SectionCard title="Configuration">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Left", value: "left" },
                          { label: "Right", value: "right" },
                          { label: "Both", value: "both" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              updateConfig({ slideDirection: opt.value } as any)
                            }
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${(config as SliderConfig).slideDirection ===
                              opt.value
                              ? "bg-sky-50 border-sky-300"
                              : "bg-white border-slate-200 hover:border-slate-300"
                              }`}
                          >
                            <svg
                              className="w-16 h-16 mb-2"
                              viewBox="0 0 80 80"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              {/* Outer frame */}
                              <rect x="8" y="8" width="64" height="64" rx="2" />
                              {/* Divider */}
                              <line x1="40" y1="8" x2="40" y2="72" />
                              {/* Left pane */}
                              <rect
                                x="12"
                                y="12"
                                width="24"
                                height="56"
                                rx="1"
                                opacity="0.3"
                              />
                              {/* Right pane */}
                              <rect
                                x="44"
                                y="12"
                                width="24"
                                height="56"
                                rx="1"
                                opacity="0.3"
                              />
                              {/* Arrows based on direction */}
                              {(opt.value === "left" ||
                                opt.value === "both") && (
                                  <>
                                    <line
                                      x1="32"
                                      y1="40"
                                      x2="18"
                                      y2="40"
                                      strokeWidth="2.5"
                                    />
                                    <polyline
                                      points="22,36 18,40 22,44"
                                      strokeWidth="2.5"
                                    />
                                  </>
                                )}
                              {(opt.value === "right" ||
                                opt.value === "both") && (
                                  <>
                                    <line
                                      x1="48"
                                      y1="40"
                                      x2="62"
                                      y2="40"
                                      strokeWidth="2.5"
                                    />
                                    <polyline
                                      points="58,36 62,40 58,44"
                                      strokeWidth="2.5"
                                    />
                                  </>
                                )}
                              {/* Handle indicators */}
                              {opt.value === "left" && (
                                <rect
                                  x="34"
                                  y="36"
                                  width="3"
                                  height="8"
                                  rx="1"
                                  fill="currentColor"
                                />
                              )}
                              {opt.value === "right" && (
                                <rect
                                  x="43"
                                  y="36"
                                  width="3"
                                  height="8"
                                  rx="1"
                                  fill="currentColor"
                                />
                              )}
                              {opt.value === "both" && (
                                <>
                                  <rect
                                    x="34"
                                    y="36"
                                    width="3"
                                    height="8"
                                    rx="1"
                                    fill="currentColor"
                                  />
                                  <rect
                                    x="43"
                                    y="36"
                                    width="3"
                                    height="8"
                                    rx="1"
                                    fill="currentColor"
                                  />
                                </>
                              )}
                            </svg>
                            <span className="text-sm font-medium text-slate-700">
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </SectionCard>

                    {/* Frame Colour */}
                    <SectionCard title="Frame Colour">
                      <div className="space-y-6">
                        {/* Outside Frame Colour */}
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-center">
                            Outside Frame Colour
                          </h3>
                          <div className="flex justify-center flex-wrap gap-4">
                            {[
                              {
                                name: "White",
                                value: "white",
                                img: "white.jpg",
                              },
                              {
                                name: "Black",
                                value: "black",
                                img: "black.jpg",
                              },
                              { name: "Grey", value: "grey", img: "grey.jpg" },
                            ].map((c) => (
                              <button
                                key={c.value}
                                onClick={() =>
                                  updateConfig({
                                    outsideColor: c.value,
                                    color: c.value,
                                  } as any)
                                }
                                className={`group relative w-28 flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${(config as SliderConfig).outsideColor ===
                                  c.value
                                  ? "border-sky-300 bg-sky-50"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                <div className="w-24 h-14 rounded border border-gray-200 overflow-hidden shadow-sm">
                                  <img
                                    src={`/images/aluminium_bifolf/${c.img}`}
                                    alt={c.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  {c.name}
                                </span>
                              </button>
                            ))}
                            {/* RAL Colour */}
                            <div className="flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-dashed border-slate-300 w-28">
                              <span className="text-xs font-medium text-slate-500">
                                RAL Colour
                              </span>
                              <input
                                type="text"
                                placeholder="0000"
                                value={
                                  (
                                    config as SliderConfig
                                  ).outsideColor?.startsWith("RAL")
                                    ? (
                                      config as SliderConfig
                                    ).outsideColor.replace("RAL ", "")
                                    : ""
                                }
                                onChange={(e) => {
                                  if (e.target.value)
                                    updateConfig({
                                      outsideColor: `RAL ${e.target.value}`,
                                      color: `RAL ${e.target.value}`,
                                    } as any);
                                }}
                                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded text-center focus:outline-none focus:border-orange-500"
                              />
                              <button
                                onClick={() => {
                                  const input = (
                                    config as SliderConfig
                                  ).outsideColor?.startsWith("RAL")
                                    ? (config as SliderConfig).outsideColor
                                    : "";
                                  if (input)
                                    updateConfig({
                                      outsideColor: input,
                                      color: input,
                                    } as any);
                                }}
                                className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors font-medium"
                              >
                                Add RAL
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Inside Frame Colour */}
                        <div>
                          <h3 className="text-lg font-bold mb-4 text-center">
                            Inside Frame Colour
                          </h3>
                          <div className="flex justify-center flex-wrap gap-4">
                            {[
                              {
                                name: "White",
                                value: "white",
                                img: "white.jpg",
                              },
                              {
                                name: "Black",
                                value: "black",
                                img: "black.jpg",
                              },
                            ].map((c) => (
                              <button
                                key={c.value}
                                onClick={() =>
                                  updateConfig({ insideColor: c.value } as any)
                                }
                                className={`group relative w-28 flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${(config as SliderConfig).insideColor ===
                                  c.value
                                  ? "border-sky-300 bg-sky-50"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                                  }`}
                              >
                                <div className="w-24 h-14 rounded border border-gray-200 overflow-hidden shadow-sm">
                                  <img
                                    src={`/images/aluminium_bifolf/${c.img}`}
                                    alt={c.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">
                                  {c.name}
                                </span>
                              </button>
                            ))}
                            {/* RAL Colour */}
                            <div className="flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-dashed border-slate-300 w-28">
                              <span className="text-xs font-medium text-slate-500">
                                RAL Colour
                              </span>
                              <input
                                type="text"
                                placeholder="0000"
                                value={
                                  (
                                    config as SliderConfig
                                  ).insideColor?.startsWith("RAL")
                                    ? (
                                      config as SliderConfig
                                    ).insideColor.replace("RAL ", "")
                                    : ""
                                }
                                onChange={(e) => {
                                  if (e.target.value)
                                    updateConfig({
                                      insideColor: `RAL ${e.target.value}`,
                                    } as any);
                                }}
                                className="w-16 px-2 py-1 text-sm border border-slate-200 rounded text-center focus:outline-none focus:border-orange-500"
                              />
                              <button
                                onClick={() => {
                                  const input = (
                                    config as SliderConfig
                                  ).insideColor?.startsWith("RAL")
                                    ? (config as SliderConfig).insideColor
                                    : "";
                                  if (input)
                                    updateConfig({ insideColor: input } as any);
                                }}
                                className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors font-medium"
                              >
                                Add RAL
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionCard>

                    {/* Cill */}
                    <SectionCard title="Cill">
                      <div>
                        <h3 className="text-lg font-bold mb-4 text-center">
                          Cill
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { name: "No Cill", value: "none", img: null },
                            {
                              name: "180mm",
                              value: "180mm",
                              img: "cill_150.png",
                            },
                            {
                              name: "230mm",
                              value: "230mm",
                              img: "cill_230.png",
                            },
                            {
                              name: "250mm",
                              value: "250mm",
                              img: "cill_190.png",
                            },
                          ].map((c) => (
                            <button
                              key={c.value}
                              onClick={() =>
                                updateConfig({ cill: c.value } as any)
                              }
                              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all h-28 justify-between ${(config as SliderConfig).cill === c.value
                                ? "bg-sky-50 border-sky-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                            >
                              <div className="flex-1 flex items-center justify-center w-full">
                                {c.img ? (
                                  <img
                                    src={`/images/aluminium_bifolf/${c.img}`}
                                    alt={c.name}
                                    className="max-w-full max-h-12 object-contain"
                                  />
                                ) : (
                                  <div className="text-gray-400 text-2xl">
                                    ✕
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-medium text-gray-600 mt-2">
                                {c.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </SectionCard>

                    {/* Extras */}
                    <SectionCard title="Extras">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.extras?.includes("lift_and_slide")}
                            onChange={(e) => {
                              const newExtras = new Set(config.extras || []);
                              if (e.target.checked)
                                newExtras.add("lift_and_slide");
                              else newExtras.delete("lift_and_slide");
                              updateConfig({
                                extras: Array.from(newExtras),
                              } as any);
                            }}
                            className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                          />
                          <span className="text-slate-700 font-medium">
                            Lift And Slide
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={config.extras?.includes("flat_pack")}
                            onChange={(e) => {
                              const newExtras = new Set(config.extras || []);
                              if (e.target.checked) newExtras.add("flat_pack");
                              else newExtras.delete("flat_pack");
                              updateConfig({
                                extras: Array.from(newExtras),
                              } as any);
                            }}
                            className="w-5 h-5 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                          />
                          <span className="text-slate-700 font-medium">
                            Flat Pack
                          </span>
                        </label>
                      </div>
                    </SectionCard>

                    {/* Addons */}
                    <SectionCard title="Addons">
                      <div className="space-y-3">
                        {["Left", "Top", "Right"].map((side) => {
                          const sideKey = side.toLowerCase() as
                            | "left"
                            | "top"
                            | "right";
                          return (
                            <div
                              key={side}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-slate-600">
                                Addon {side}
                              </span>
                              <select
                                value={
                                  (config as SliderConfig).addons?.[sideKey] ||
                                  "None"
                                }
                                onChange={(e) => {
                                  const val =
                                    e.target.value === "None"
                                      ? null
                                      : e.target.value;
                                  const currentAddons = (config as SliderConfig)
                                    .addons || {
                                    left: null,
                                    right: null,
                                    top: null,
                                  };
                                  updateConfig({
                                    addons: {
                                      ...currentAddons,
                                      [sideKey]: val,
                                    },
                                  } as any);
                                }}
                                className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28"
                              >
                                <option value="None">None</option>
                                <option value="20mm Addon">20mm</option>
                                <option value="38mm Addon">38mm</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </SectionCard>

                    {/* Hardware Colour */}
                    <SectionCard title="Hardware Colour">
                      <div>
                        <h3 className="text-lg font-bold mb-4 text-center">
                          Hardware Colour
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { name: "White", value: "white", img: "white.jpg" },
                            { name: "Black", value: "black", img: "black.jpg" },
                            { name: "Gold", value: "gold", img: "gold.png" },
                            {
                              name: "Polished Chrome",
                              value: "polished_chrome",
                              img: "chrome.jpg",
                            },
                          ].map((h) => (
                            <button
                              key={h.value}
                              onClick={() =>
                                updateConfig({ hardwareColor: h.value } as any)
                              }
                              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${(config as SliderConfig).hardwareColor ===
                                h.value
                                ? "border-sky-300 bg-sky-50"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                            >
                              <div className="h-16 w-16 mb-2 relative flex items-center justify-center">
                                <img
                                  src={`/images/aluminium_bifolf/${h.img}`}
                                  alt={h.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-700 text-center">
                                {h.name}
                              </span>
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          {[
                            {
                              name: "Smooth Satin Chrome",
                              value: "smooth_satin_chrome",
                              img: "satin.jpg",
                            },
                            {
                              name: "Coastal Black",
                              value: "coastal_black",
                              img: "black.jpg",
                            },
                            {
                              name: "Coastal Stainless Steel",
                              value: "coastal_stainless_steel",
                              img: "coastal_stainless_steel.jpg",
                            },
                          ].map((h) => (
                            <button
                              key={h.value}
                              onClick={() =>
                                updateConfig({ hardwareColor: h.value } as any)
                              }
                              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${(config as SliderConfig).hardwareColor ===
                                h.value
                                ? "border-sky-300 bg-sky-50"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                                }`}
                            >
                              <div className="h-16 w-16 mb-2 relative flex items-center justify-center">
                                <img
                                  src={`/images/aluminium_bifolf/${h.img}`}
                                  alt={h.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-700 text-center">
                                {h.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </SectionCard>

                    {/* Glass Type */}
                    <SectionCard title="Glass Type">
                      <div className="flex flex-col gap-4">
                        {/* PAS 24 and Glass Thickness */}
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(config as SliderConfig).pas24 || false}
                            onChange={(e) =>
                              updateConfig({ pas24: e.target.checked } as any)
                            }
                            className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-slate-700 font-medium">
                            PAS 24 Certified
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!(config as SliderConfig).glassThickness}
                            onChange={(e) =>
                              updateConfig({
                                glassThickness: e.target.checked
                                  ? 28
                                  : undefined,
                              } as any)
                            }
                            className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-slate-700 font-medium">
                            Specify Glass Thickness (if not 28mm)
                          </span>
                        </label>
                        {(config as SliderConfig).glassThickness && (
                          <input
                            type="number"
                            value={
                              (config as SliderConfig).glassThickness || 28
                            }
                            onChange={(e) =>
                              updateConfig({
                                glassThickness: parseInt(e.target.value) || 28,
                              } as any)
                            }
                            className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            placeholder="28"
                          />
                        )}

                        {/* Glazing Type Cards */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Unglazed", value: "unglazed" },
                            { label: "Toughened", value: "toughened" },
                            {
                              label: "Toughened Obscured",
                              value: "toughened_obscure",
                            },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                let defaultPattern = null;
                                if (opt.value === "toughened")
                                  defaultPattern = "Clear";
                                if (opt.value === "toughened_obscure")
                                  defaultPattern = "Satin";
                                updateConfig({
                                  glassType: opt.value as any,
                                  glassPattern: defaultPattern,
                                  blinds: undefined,
                                  blindsColour: undefined,
                                } as any);
                              }}
                              className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${(config as SliderConfig).glassType === opt.value
                                ? "bg-sky-50 border-sky-300"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                            >
                              {opt.value === "unglazed" && (
                                <svg
                                  className="w-12 h-12 text-slate-400 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              )}
                              {opt.value === "toughened" && (
                                <svg
                                  className="w-12 h-12 text-slate-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 40 40"
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="28"
                                    height="32"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <rect
                                    x="10"
                                    y="8"
                                    width="20"
                                    height="24"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                  />
                                  <circle
                                    cx="17"
                                    cy="26"
                                    r="1.5"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="23"
                                    cy="26"
                                    r="1.5"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="20"
                                    cy="29"
                                    r="1.5"
                                    fill="currentColor"
                                  />
                                </svg>
                              )}
                              {opt.value === "toughened_obscure" && (
                                <svg
                                  className="w-12 h-12 text-slate-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 40 40"
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="28"
                                    height="32"
                                    rx="2"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <rect
                                    x="10"
                                    y="8"
                                    width="20"
                                    height="24"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                  />
                                  <line
                                    x1="10"
                                    y1="12"
                                    x2="30"
                                    y2="28"
                                    stroke="currentColor"
                                    strokeWidth="0.8"
                                  />
                                  <line
                                    x1="10"
                                    y1="16"
                                    x2="26"
                                    y2="28"
                                    stroke="currentColor"
                                    strokeWidth="0.8"
                                  />
                                  <line
                                    x1="10"
                                    y1="20"
                                    x2="22"
                                    y2="28"
                                    stroke="currentColor"
                                    strokeWidth="0.8"
                                  />
                                  <line
                                    x1="14"
                                    y1="12"
                                    x2="30"
                                    y2="24"
                                    stroke="currentColor"
                                    strokeWidth="0.8"
                                  />
                                  <line
                                    x1="18"
                                    y1="12"
                                    x2="30"
                                    y2="20"
                                    stroke="currentColor"
                                    strokeWidth="0.8"
                                  />
                                </svg>
                              )}
                              <span className="text-sm font-medium text-slate-700">
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Blinds - when Toughened */}
                        {(config as SliderConfig).glassType === "toughened" && (
                          <div className="flex flex-col gap-3 pt-2">
                            <span className="text-sm text-slate-600 font-medium">
                              Blinds
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "none",
                                    blindsColour: undefined,
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${!(config as SliderConfig).blinds ||
                                  (config as SliderConfig).blinds === "none"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-400 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  No Blinds
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  updateConfig({
                                    blinds: "mechanical",
                                    blindsColour:
                                      (config as any).blindsColour || "White",
                                  } as any)
                                }
                                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${(config as SliderConfig).blinds ===
                                  "mechanical"
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-white border-slate-200 hover:border-slate-300"
                                  }`}
                              >
                                <svg
                                  className="w-10 h-10 text-slate-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 40 40"
                                >
                                  <rect
                                    x="6"
                                    y="4"
                                    width="28"
                                    height="32"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <line
                                    x1="8"
                                    y1="10"
                                    x2="32"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="14"
                                    x2="32"
                                    y2="14"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="18"
                                    x2="32"
                                    y2="18"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="22"
                                    x2="32"
                                    y2="22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                  <line
                                    x1="8"
                                    y1="26"
                                    x2="32"
                                    y2="26"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-slate-700">
                                  Mechanical Blinds
                                </span>
                              </button>
                            </div>

                            {(config as SliderConfig).blinds ===
                              "mechanical" && (
                                <div className="flex flex-col gap-2 mt-2">
                                  <span className="text-sm text-slate-600 font-medium">
                                    Blinds Colour
                                  </span>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[
                                      "White",
                                      "Yellow",
                                      "Agate Grey",
                                      "Beige",
                                      "Green",
                                      "Light Blue",
                                      "Cream",
                                      "Light Grey",
                                      "Metallic Silver",
                                      "Silver",
                                      "Slate Grey",
                                      "Anthracite",
                                      "Black",
                                    ].map((colour) => (
                                      <button
                                        key={colour}
                                        onClick={() =>
                                          updateConfig({
                                            blindsColour: colour,
                                          } as any)
                                        }
                                        className={`py-2 px-2 text-sm rounded-lg border transition-all ${(config as SliderConfig)
                                          .blindsColour === colour
                                          ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                          }`}
                                      >
                                        {colour}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Toughened Glass Options */}
                        {(config as SliderConfig).glassType === "toughened" && (
                          <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">
                              Glass Option
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {[
                                "Low E (1.2 u-value)",
                                "6.8 Laminated (1.2 u-value)",
                                "Low E (1.0 u-value)",
                                "6.8 Acoustic Laminated (1.2 u-value)",
                                "Triple Glazed (0.6 u-value)",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() =>
                                    updateConfig({ glassPattern: opt } as any)
                                  }
                                  className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${(config as SliderConfig).glassPattern ===
                                    opt
                                    ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Toughened Obscure Patterns */}
                        {(config as SliderConfig).glassType ===
                          "toughened_obscure" && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-slate-600">
                                Obscure Pattern
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  "Arctic (L5)",
                                  "Autumn (L3)",
                                  "Contora (L4)",
                                  "Cotswold (L5)",
                                  "Reeded (L2)",
                                  "Stippolyte (L4)",
                                  "Cassini (L5)",
                                  "Chantilly (L2)",
                                  "Charcoal Sticks (L4)",
                                  "Digital (L3)",
                                  "Everglade (L5)",
                                  "Flemish (L1)",
                                  "Florielle (L4)",
                                  "Mayflower (L4)",
                                  "Minster (L2)",
                                  "Oak (L4)",
                                  "Pelerine (L4)",
                                  "Sycamore (L2)",
                                  "Taffeta (L3)",
                                  "Warwick (L1)",
                                  "Satin",
                                ].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      updateConfig({ glassPattern: opt } as any)
                                    }
                                    className={`p-2 text-xs border rounded-lg transition-all ${(config as SliderConfig).glassPattern ===
                                      opt
                                      ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </SectionCard>

                    {/* Astragal Bars */}
                    <SectionCard title="Astragal Bars">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          className="px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm"
                          onClick={() => setIsAstragalModalOpen(true)}
                        >
                          Edit Astragal Bars
                        </button>
                        {((config as SliderConfig).astragalBars || 0) > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            {(config as SliderConfig).astragalBars} vertical
                            bar(s) configured
                          </p>
                        )}
                      </div>
                    </SectionCard>

                    {/* Astragal Bars Modal */}
                    {isAstragalModalOpen && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsAstragalModalOpen(false)}
                      >
                        <div
                          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Modal Header */}
                          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-800">
                              Edit Astragal Bars
                            </h2>
                            <button
                              onClick={() => setIsAstragalModalOpen(false)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Modal Body */}
                          <div className="px-6 py-5 space-y-5">
                            {/* Horizontal bars */}
                            <div>
                              <label className="text-sm font-semibold text-slate-700 block mb-2">
                                Horizontal bars
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={
                                  (config as SliderConfig).transomBars || 0
                                }
                                onChange={(e) =>
                                  updateConfig({
                                    transomBars: parseInt(e.target.value) || 0,
                                  } as any)
                                }
                                className="w-48 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            {/* Vertical bars */}
                            <div>
                              <label className="text-sm font-semibold text-slate-700 block mb-2">
                                Vertical bars
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={10}
                                value={
                                  (config as SliderConfig).astragalBars || 0
                                }
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  updateConfig({ astragalBars: val } as any);
                                  setSelectedBar(0);
                                }}
                                className="w-48 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              />
                            </div>

                            {/* Selected Bar */}
                            <div>
                              <label className="text-xs font-medium text-slate-500 block mb-2">
                                Selected Bar
                              </label>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    setSelectedBar(Math.max(0, selectedBar - 1))
                                  }
                                  disabled={
                                    ((config as SliderConfig).astragalBars ||
                                      0) === 0
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>
                                <span className="text-sm text-slate-600 min-w-[100px] text-center">
                                  {((config as SliderConfig).astragalBars ||
                                    0) > 0
                                    ? `Bar ${selectedBar + 1} of ${(config as SliderConfig).astragalBars}`
                                    : "No bars to show"}
                                </span>
                                <button
                                  onClick={() =>
                                    setSelectedBar(
                                      Math.min(
                                        ((config as SliderConfig)
                                          .astragalBars || 1) - 1,
                                        selectedBar + 1,
                                      ),
                                    )
                                  }
                                  disabled={
                                    ((config as SliderConfig).astragalBars ||
                                      0) === 0
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Evenly space */}
                            <button
                              disabled={
                                ((config as SliderConfig).astragalBars || 0) ===
                                0
                              }
                              className="text-sm text-slate-400 disabled:cursor-not-allowed hover:text-slate-600 transition-colors"
                            >
                              Evenly space vertical bars
                            </button>

                            <p className="text-sm text-slate-500">
                              Click on the image to position the bars
                            </p>

                            {/* Select another pane */}
                            <button
                              onClick={() =>
                                setSelectedPane(
                                  (selectedPane + 1) %
                                  ((config as SliderConfig).panels || 2),
                                )
                              }
                              className="px-5 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm"
                            >
                              Select another pane
                            </button>

                            {/* Slider Preview */}
                            <div className="flex justify-center py-4">
                              <div className="relative w-72 h-48 border-[8px] border-slate-800 rounded-sm bg-sky-100/60">
                                {/* Panels */}
                                <div className="flex h-full">
                                  {Array.from({
                                    length:
                                      (config as SliderConfig).panels || 2,
                                  }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`flex-1 h-full border-r-2 last:border-r-0 relative cursor-pointer transition-colors ${selectedPane === i
                                        ? "bg-sky-200/50"
                                        : "bg-sky-100/30"
                                        }`}
                                      style={{ borderColor: "#334155" }}
                                      onClick={() => setSelectedPane(i)}
                                    >
                                      {/* Vertical astragal bars for this pane */}
                                      {selectedPane === i &&
                                        ((config as SliderConfig)
                                          .astragalBars || 0) > 0 &&
                                        Array.from({
                                          length:
                                            (config as SliderConfig)
                                              .astragalBars || 0,
                                        }).map((_, barIdx) => {
                                          const spacing =
                                            100 /
                                            (((config as SliderConfig)
                                              .astragalBars || 0) +
                                              1);
                                          return (
                                            <div
                                              key={barIdx}
                                              className={`absolute top-0 bottom-0 w-0.5 ${barIdx === selectedBar ? "bg-orange-500" : "bg-slate-600"}`}
                                              style={{
                                                left: `${spacing * (barIdx + 1)}%`,
                                              }}
                                            />
                                          );
                                        })}
                                      {/* Horizontal transom bars */}
                                      {((config as SliderConfig).transomBars ||
                                        0) > 0 &&
                                        Array.from({
                                          length:
                                            (config as SliderConfig)
                                              .transomBars || 0,
                                        }).map((_, barIdx) => {
                                          const spacing =
                                            100 /
                                            (((config as SliderConfig)
                                              .transomBars || 0) +
                                              1);
                                          return (
                                            <div
                                              key={`h-${barIdx}`}
                                              className="absolute left-0 right-0 h-0.5 bg-slate-600"
                                              style={{
                                                top: `${spacing * (barIdx + 1)}%`,
                                              }}
                                            />
                                          );
                                        })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Modal Footer */}
                          <div className="flex justify-end px-6 py-4 border-t border-slate-200">
                            <button
                              onClick={() => setIsAstragalModalOpen(false)}
                              className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <SectionCard title="Notes">
                      <div>
                        <textarea
                          value={config.notes || ""}
                          onChange={(e) =>
                            updateConfig({ notes: e.target.value } as any)
                          }
                          placeholder="Add any notes to the item here"
                          className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y"
                        />
                      </div>
                    </SectionCard>

                    {/* Add Item Button */}
                  </>
                )}
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
