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
function ToggleGroup({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value: string;
    onChange: (v: string) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
            {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
                    className={`px-5 py-2.5 text-sm font-medium transition-all ${value === opt.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                        } ${opt.value !== options[0].value ? 'border-l border-slate-200' : ''}`}
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
    const [view, setView] = useState<'inside' | 'outside'>('outside');
  const [isSidelightModalOpen, setIsSidelightModalOpen] = useState(false);
  const panel = useMemo(() => {
    return calculatePanels(config?.width);
  }, [config?.width]);
  console.log({ panel });
  useEffect(() => {
        const typeParam = searchParams.get('type');
    if (!typeParam) {
            router.replace('/portal/quotes');
      return;
    }
        if (typeParam === 'bifold') {
      handleProductSelect(ProductType.Bifold);
        } else if (typeParam === 'french_door') {
      handleProductSelect(ProductType.FrenchDoor);
    } else {
            router.replace('/portal/quotes');
    }
  }, [searchParams]);

  const handleProductSelect = (type: ProductType) => {
    const baseConfig = {
      id: crypto.randomUUID(),
      width: 2400,
      height: 2100,
            color: 'white',
            outsideColor: 'white',
            insideColor: 'white',
            glass: 'clear',
            handleColor: 'chrome',
            cill: '150mm',
            threshold: 'standard',
      trickleVents: true,
      transom: false,
    };

    if (type === ProductType.Bifold) {
      setConfig({
        ...baseConfig,
        type: ProductType.Bifold,
        panels: 3,
                configuration: '3+0',
                openingDirection: 'left',
        trafficDoor: true,
      } as BifoldConfig);
    } else if (type === ProductType.FrenchDoor) {
      setConfig({
        ...baseConfig,
        type: ProductType.FrenchDoor,
        width: 1800,
                color: 'black',
                outsideColor: 'black',
                insideColor: 'black',
                openingDirection: 'out',
                masterHandle: 'right',
        sidelights: {
          left: { enabled: false, width: 0, height: baseConfig.height },
          right: { enabled: false, width: 0, height: baseConfig.height },
                    top: { enabled: false, height: 0 }
        },
        addons: { left: null, right: null, top: null },
                hardwareColor: 'chrome'
      } as any);
    } else {
      setConfig({ ...baseConfig, type } as any);
    }

    setStep(2);
  };

  const handleBack = () => {
        router.push('/portal/quotes');
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
                trickleVents: config.trickleVents || false,
                width: config.width,
                height: config.height,
                outsideColor: (config as BifoldConfig).outsideColor,
                insideColor: (config as BifoldConfig).insideColor,
                color: config.color,
              })
            : null;

        return (
          <>
            <div className="flex flex-col xl:flex-row gap-6 items-start max-w-[1440px] mx-auto pb-24">
              {/* ═══════════════════════════════════════════
                            LEFT COLUMN — Visualizer Only
                        ═══════════════════════════════════════════ */}
              <div className="w-full xl:w-[480px] xl:flex-shrink-0 xl:sticky xl:top-20 z-0">
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

                  {/* Sidelights button for French Door */}
                  {config.type === ProductType.FrenchDoor && (
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
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${
                            (config as any).threshold === "standard"
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
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${
                            (config as any).threshold === "low"
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
                            className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all min-w-[80px] ${
                              (config as BifoldConfig).panels === num
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

                    {/* Colours */}
                    <SectionCard title="Frame Colour">
                      <ColourSection
                        config={config as BifoldConfig}
                        onChange={updateConfig}
                      />
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
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${
                            (config as any).threshold === "standard"
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
                          className={`flex flex-col items-center p-3 border rounded-xl w-36 transition-all ${
                            (config as any).threshold === "low"
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
                        config={config as BifoldConfig}
                        onChange={updateConfig}
                      />
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
