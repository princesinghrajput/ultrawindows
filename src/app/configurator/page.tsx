"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, RotateCcw, MapPin } from "lucide-react";
import ConfiguratorLayout from "../../components/configurator/ConfiguratorLayout";
import { ProductType, ProductConfig, BifoldConfig } from "../../types/product";
import BifoldVisualizer from "../../components/configurator/visualizers/RealisticBifoldVisualizer";
import { validateDimensions } from "../../utils/validation";
import ConfigurationSection from "../../components/configurator/sections/ConfigurationSection";
import ColourSection from "../../components/configurator/sections/ColourSection";
import CillSection from "../../components/configurator/sections/CillSection";
import HardwareSection from "../../components/configurator/sections/HardwareSection";

import RealisticFrenchDoorVisualizer from "../../components/configurator/visualizers/RealisticFrenchDoorVisualizer";
import RealisticSingleDoorVisualizer from "../../components/configurator/visualizers/RealisticSingleDoorVisualizer";
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
                          trickleVents={config.trickleVents}
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
                  {(config.type === ProductType.FrenchDoor || config.type === ProductType.SingleDoor) && (
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

                {/* ── FRENCH DOOR CONTROLS ── */}
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
                            {[
                              "Corner Post",
                              "Flat Pack",
                              "Door Panel",
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

                    {/* Glass Options */}
                    <SectionCard title="Glass Options">
                      <div className="space-y-4">
                        {/* Additional Glass Options */}
                        <div className="pb-4 flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(config as BifoldConfig).pas24 || false}
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
              </div>
            </div>

            {/* Fixed Bottom Price Bar */}
            {priceBreakdown && (
              <div className="fixed bottom-0 left-0 right-0 z-40">
                <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                  <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
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
