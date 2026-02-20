import React, { useState } from "react";
import { BifoldConfig, ProductType } from "../../../types/product";
import SectionCard from "../sections/SectionCard";
import ToggleGroup from "../sections/ToggleGroup";
import ColourSection from "../sections/ColourSection";
import CillSection from "../sections/CillSection";
import HardwareSection from "../sections/HardwareSection";
import ConfigurationSection from "../sections/ConfigurationSection";

interface BifoldControlsProps {
  config: BifoldConfig;
  onUpdate: (updates: Partial<BifoldConfig>) => void;
  panelOptions: number[];
}

export default function BifoldControls({
  config,
  onUpdate,
  panelOptions,
}: BifoldControlsProps) {
  const [showTransomModal, setShowTransomModal] = useState(false);
  const [transomType, setTransomType] = useState<"horizontal" | "vertical">(
    "horizontal",
  );
  const [selectedBar, setSelectedBar] = useState(0);
  const [hBarPositions, setHBarPositions] = useState<number[]>([]);
  const [vBarPositions, setVBarPositions] = useState<number[]>([]);
  const [showVentModal, setShowVentModal] = useState(false);
  const [selectedVent, setSelectedVent] = useState(0);
  const [ventPositions, setVentPositions] = useState<number[]>([]);

  // Get current positions based on type
  const barPositions =
    transomType === "horizontal" ? hBarPositions : vBarPositions;
  const setBarPositions =
    transomType === "horizontal" ? setHBarPositions : setVBarPositions;
  const barCount =
    transomType === "horizontal"
      ? config.transomBars || 0
      : config.astragalBars || 0;

  // Build evenly-spaced positions (does NOT call onUpdate)
  const buildEvenPositions = (count: number) => {
    return Array.from(
      { length: count },
      (_, i) => (100 / (count + 1)) * (i + 1),
    );
  };

  // Sync local positions + config in one call
  const syncPositions = (count: number, type: "horizontal" | "vertical") => {
    const setter = type === "horizontal" ? setHBarPositions : setVBarPositions;
    const newPositions = buildEvenPositions(count);
    setter(newPositions);
    // Store both count + positions in a single onUpdate
    if (type === "horizontal") {
      onUpdate({
        transomBars: count,
        transomBarPositions: newPositions,
      } as any);
    } else {
      onUpdate({
        astragalBars: count,
        astragalBarPositions: newPositions,
      } as any);
    }
  };

  // Handle click on door preview to position the selected bar
  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let pct: number;
    if (transomType === "horizontal") {
      pct = ((e.clientY - rect.top) / rect.height) * 100;
    } else {
      pct = ((e.clientX - rect.left) / rect.width) * 100;
    }
    pct = Math.max(5, Math.min(95, pct));
    if (barPositions.length > 0 && selectedBar < barPositions.length) {
      const updated = [...barPositions];
      updated[selectedBar] = pct;
      setBarPositions(updated);
      // Store in config too
      if (transomType === "horizontal") {
        onUpdate({ transomBarPositions: updated } as any);
      } else {
        onUpdate({ astragalBarPositions: updated } as any);
      }
    }
  };

  return (
    <>
      {/* Number of Panes */}
      <SectionCard title="Number of Panes">
        <div className="flex justify-center gap-2">
          {panelOptions?.map((num) => (
            <button
              key={num}
              onClick={() =>
                onUpdate({
                  panels: num,
                  configuration: `${num}+0`,
                  type: ProductType.Bifold,
                } as any)
              }
              className="rounded-xl text-sm font-bold transition-all duration-200 min-w-20"
              style={{
                padding: "14px 24px",
                background:
                  config.panels === num
                    ? "linear-gradient(135deg, #f97316, #ea580c)"
                    : "#ffffff",
                color: config.panels === num ? "#fff" : "#475569",
                border:
                  config.panels === num
                    ? "1px solid #ea580c"
                    : "1px solid #e2e8f0",
                boxShadow:
                  config.panels === num
                    ? "0 4px 14px rgba(249,115,22,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                transform: config.panels === num ? "scale(1.05)" : "scale(1)",
              }}
            >
              {num}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Configuration Diagrams */}
      <SectionCard title="Configuration">
        <ConfigurationSection config={config} onChange={onUpdate} />
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
            onChange={(v) => onUpdate({ openingDirection: v } as any)}
          />
        </div>
      </SectionCard>

      {/* Traffic Door */}
      <SectionCard title="Traffic Door">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Enable Traffic Door
          </span>
          <ToggleGroup
            options={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
            value={config.trafficDoor ? "yes" : "no"}
            onChange={(v) => onUpdate({ trafficDoor: v === "yes" } as any)}
          />
        </div>
      </SectionCard>

      {/* Colours */}
      <SectionCard title="Frame Colour">
        <ColourSection config={config} onChange={onUpdate} />
      </SectionCard>

      {/* Glass Options */}
      <SectionCard title="Glass Options">
        <div className="space-y-5">
          {/* Additional Glass Options */}
          <div className="pb-4 flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={config.pas24 || false}
                onChange={(e) =>
                  onUpdate({
                    pas24: e.target.checked,
                  } as any)
                }
                className="w-4 h-4 rounded border-slate-300 accent-orange-500"
                style={{ accentColor: "#f97316" }}
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                PAS 24 Certified
              </span>
            </label>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={config.glassThickness !== undefined}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onUpdate({
                        glassThickness: 28,
                      } as any);
                    } else {
                      onUpdate({
                        glassThickness: undefined,
                      } as any);
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-300"
                  style={{ accentColor: "#f97316" }}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                  Specify Glass Thickness (if not 28mm)
                </span>
              </label>

              {config.glassThickness !== undefined && (
                <div className="flex items-center gap-2 ml-7">
                  <span className="text-sm text-slate-600">
                    Glass Thickness
                  </span>
                  <input
                    type="number"
                    value={config.glassThickness || ""}
                    onChange={(e) =>
                      onUpdate({
                        glassThickness: parseInt(e.target.value) || 0,
                      } as any)
                    }
                    className="w-20 p-2 rounded-lg text-sm text-slate-700 focus:outline-none transition-all"
                    style={{
                      border: "1px solid #e2e8f0",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#f97316")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                  <span className="text-sm text-slate-600">mm</span>
                </div>
              )}
            </div>
          </div>

          {/* Glass Type */}
          <div className="flex flex-col gap-3">
            <span className="text-sm text-slate-600 font-bold uppercase tracking-wide">
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
                    let defaultPattern: string | null = null;
                    if (opt.value === "toughened") defaultPattern = "Clear";
                    if (opt.value === "toughened_obscure")
                      defaultPattern = "Satin";
                    onUpdate({
                      glassType: opt.value as any,
                      glassPattern: defaultPattern,
                    } as any);
                  }}
                  className="py-2.5 px-3 text-sm rounded-xl transition-all duration-200"
                  style={{
                    border:
                      config.glassType === opt.value
                        ? "2px solid #f97316"
                        : "1px solid #e2e8f0",
                    background:
                      config.glassType === opt.value
                        ? "rgba(249,115,22,0.06)"
                        : "#ffffff",
                    color:
                      config.glassType === opt.value ? "#ea580c" : "#475569",
                    fontWeight: config.glassType === opt.value ? 600 : 500,
                    boxShadow:
                      config.glassType === opt.value
                        ? "0 2px 8px rgba(249,115,22,0.15)"
                        : "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toughened Glass Options */}
          {config.glassType === "toughened" && (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-slate-600 font-bold uppercase tracking-wide">
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
                      onUpdate({
                        glassPattern: opt,
                      } as any)
                    }
                    className="p-3 text-sm flex items-center justify-center text-center rounded-xl h-20 transition-all duration-200"
                    style={{
                      border:
                        config.glassPattern === opt
                          ? "2px solid #f97316"
                          : "1px solid #e2e8f0",
                      background:
                        config.glassPattern === opt
                          ? "rgba(249,115,22,0.06)"
                          : "#ffffff",
                      color:
                        config.glassPattern === opt ? "#ea580c" : "#475569",
                      fontWeight: config.glassPattern === opt ? 600 : 400,
                      boxShadow:
                        config.glassPattern === opt
                          ? "0 2px 8px rgba(249,115,22,0.15)"
                          : "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toughened Obscure Patterns */}
          {config.glassType === "toughened_obscure" && (
            <div className="flex flex-col gap-3">
              <span className="text-sm text-slate-600 font-bold uppercase tracking-wide">
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
                      onUpdate({
                        glassPattern: opt,
                      } as any)
                    }
                    className="p-2 text-xs rounded-lg transition-all duration-200"
                    style={{
                      border:
                        config.glassPattern === opt
                          ? "2px solid #f97316"
                          : "1px solid #e2e8f0",
                      background:
                        config.glassPattern === opt
                          ? "rgba(249,115,22,0.06)"
                          : "#ffffff",
                      color:
                        config.glassPattern === opt ? "#ea580c" : "#475569",
                      fontWeight: config.glassPattern === opt ? 600 : 400,
                    }}
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
        <CillSection config={config} onChange={onUpdate} />
      </SectionCard>

      {/* Threshold */}
      <SectionCard title="Threshold">
        <div className="flex justify-center gap-4">
          {[
            { label: "Standard 55mm", value: "standard", img: "standard.png" },
            { label: "Low 20mm", value: "low", img: "low.png" },
          ].map((opt) => {
            const isSelected = (config as any).threshold === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onUpdate({ threshold: opt.value } as any)}
                className="flex flex-col items-center p-3 rounded-xl w-36 transition-all duration-200 group"
                style={{
                  border: isSelected
                    ? "2px solid #f97316"
                    : "1px solid #e2e8f0",
                  background: isSelected ? "rgba(249,115,22,0.04)" : "#ffffff",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(249,115,22,0.15)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <div className="h-12 w-full mb-2 relative transition-transform duration-200 group-hover:scale-105">
                  <img
                    src={`/images/aluminium_bifolf/${opt.img}`}
                    className="w-full h-full object-contain"
                    alt={opt.label}
                  />
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: isSelected ? "#ea580c" : "#334155" }}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Threshold Ramp */}
        {config.threshold === "low" && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-3 text-center uppercase tracking-wide">
              Threshold Ramp
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "None", value: "none" },
                { label: "Inside Ramp", value: "inside" },
                { label: "Outside Ramp", value: "outside" },
                { label: "Inside & Outside Ramp", value: "both" },
              ].map((opt) => {
                const isSelected =
                  (config.thresholdRamp || "none") === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      onUpdate({
                        thresholdRamp: opt.value as any,
                      } as any)
                    }
                    className="py-3 px-2 text-sm rounded-xl transition-all duration-200"
                    style={{
                      border: isSelected
                        ? "2px solid #f97316"
                        : "1px solid #e2e8f0",
                      background: isSelected
                        ? "rgba(249,115,22,0.06)"
                        : "#ffffff",
                      color: isSelected ? "#ea580c" : "#475569",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Addons */}
      <SectionCard title="Addons">
        <div className="space-y-3">
          {["Left", "Top", "Right"].map((side) => {
            const sideLower = side.toLowerCase() as "left" | "top" | "right";
            return (
              <div key={side} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Addon {side}
                </span>
                <select
                  value={config.addons?.[sideLower] || "None"}
                  onChange={(e) => {
                    const val =
                      e.target.value === "None" ? null : e.target.value;
                    const currentAddons = config.addons || {
                      left: null,
                      right: null,
                      top: null,
                    };
                    onUpdate({
                      addons: {
                        ...currentAddons,
                        [sideLower]: val,
                      },
                    } as any);
                  }}
                  className="rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none w-28 transition-all"
                  style={{
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#f97316";
                    e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
                  }}
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

      {/* Transom Bars */}
      <SectionCard title="Transom Bars">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => {
              setShowTransomModal(true);
              // Initialize local state from config positions
              if (
                config.transomBarPositions &&
                config.transomBarPositions.length > 0
              ) {
                setHBarPositions(config.transomBarPositions);
              } else if ((config.transomBars || 0) > 0) {
                syncPositions(config.transomBars || 0, "horizontal");
              }
              if (
                config.astragalBarPositions &&
                config.astragalBarPositions.length > 0
              ) {
                setVBarPositions(config.astragalBarPositions);
              } else if ((config.astragalBars || 0) > 0) {
                syncPositions(config.astragalBars || 0, "vertical");
              }
            }}
            className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow:
                "0 4px 14px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
          >
            Edit Transoms
          </button>
          {((config.transomBars || 0) > 0 ||
            (config.astragalBars || 0) > 0) && (
            <p className="text-xs text-slate-500">
              {config.transomBars || 0} horizontal, {config.astragalBars || 0}{" "}
              vertical bars
            </p>
          )}
        </div>
      </SectionCard>

      {/* Transom Modal */}
      {showTransomModal && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowTransomModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Edit Transoms
              </h2>
              <button
                onClick={() => setShowTransomModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-xl"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Select Transom Type */}
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3">
                  Select Transom
                </h3>
                <div className="space-y-2">
                  <label
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{
                      border:
                        transomType === "horizontal"
                          ? "2px solid #f97316"
                          : "1px solid #e2e8f0",
                      background:
                        transomType === "horizontal"
                          ? "rgba(249,115,22,0.04)"
                          : "#fff",
                    }}
                  >
                    <input
                      type="radio"
                      name="transomType"
                      checked={transomType === "horizontal"}
                      onChange={() => setTransomType("horizontal")}
                      className="w-5 h-5"
                      style={{ accentColor: "#f97316" }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Door Horizontal Transom
                    </span>
                  </label>
                  <label
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{
                      border:
                        transomType === "vertical"
                          ? "2px solid #f97316"
                          : "1px solid #e2e8f0",
                      background:
                        transomType === "vertical"
                          ? "rgba(249,115,22,0.04)"
                          : "#fff",
                    }}
                  >
                    <input
                      type="radio"
                      name="transomType"
                      checked={transomType === "vertical"}
                      onChange={() => setTransomType("vertical")}
                      className="w-5 h-5"
                      style={{ accentColor: "#f97316" }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Door Vertical Transom
                    </span>
                  </label>
                </div>
              </div>

              {/* Number of Bars */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">
                  Number of bars
                </h3>
                <input
                  type="number"
                  min={0}
                  value={
                    transomType === "horizontal"
                      ? config.transomBars || 0
                      : config.astragalBars || 0
                  }
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    // Use syncPositions which does a single merged onUpdate
                    syncPositions(val, transomType);
                    setSelectedBar(0);
                  }}
                  className="w-40 p-3 rounded-xl text-sm text-slate-700 focus:outline-none transition-all"
                  style={{ border: "1px solid #e2e8f0" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#f97316";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                  }}
                />
              </div>

              {/* Selected Bar */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">
                  Selected Bar
                </h3>
                <div
                  className="flex items-center gap-4 px-4 py-2.5 rounded-xl"
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  <button
                    onClick={() => setSelectedBar(Math.max(0, selectedBar - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    style={{ border: "1px solid #e2e8f0" }}
                  >
                    ‹
                  </button>
                  <span className="text-sm text-slate-600 flex-1 text-center">
                    {(() => {
                      const count =
                        transomType === "horizontal"
                          ? config.transomBars || 0
                          : config.astragalBars || 0;
                      return count === 0
                        ? "No bars to show"
                        : `Bar ${selectedBar + 1} of ${count}`;
                    })()}
                  </span>
                  <button
                    onClick={() => {
                      const count =
                        transomType === "horizontal"
                          ? config.transomBars || 0
                          : config.astragalBars || 0;
                      setSelectedBar(Math.min(count - 1, selectedBar + 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    style={{ border: "1px solid #e2e8f0" }}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Evenly Space */}
              <button
                className="px-5 py-2 rounded-lg text-sm text-slate-500 transition-all"
                style={{ border: "1px solid #e2e8f0" }}
                onClick={() => syncPositions(barCount, transomType)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#f97316";
                  e.currentTarget.style.color = "#ea580c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.color = "#64748b";
                }}
              >
                Evenly space bars
              </button>

              {/* Hint */}
              <p className="text-sm" style={{ color: "#f97316" }}>
                Click on the image to position the bars
              </p>

              {/* Door Preview */}
              <div className="flex justify-center py-4">
                <div
                  onClick={handlePreviewClick}
                  style={{
                    width: "100%",
                    maxWidth: 350,
                    aspectRatio: `${config.width || 3000} / ${config.height || 2100}`,
                    border: "6px solid #1e293b",
                    borderRadius: 4,
                    display: "flex",
                    overflow: "hidden",
                    position: "relative",
                    background: "#4a5a6a",
                    cursor: "crosshair",
                  }}
                >
                  {Array.from({ length: config.panels || 3 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        borderLeft: i > 0 ? "3px solid #1e293b" : "none",
                        position: "relative",
                      }}
                    >
                      {/* Show transom bars */}
                      {transomType === "horizontal" &&
                        (hBarPositions.length > 0
                          ? hBarPositions
                          : Array.from(
                              { length: config.transomBars || 0 },
                              (_, bi) =>
                                (100 / ((config.transomBars || 0) + 1)) *
                                (bi + 1),
                            )
                        ).map((pos, bi) => (
                          <div
                            key={`t-${bi}`}
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: bi === selectedBar ? 6 : 4,
                              background:
                                bi === selectedBar ? "#f97316" : "#1e293b",
                              top: `${pos}%`,
                              transform: "translateY(-50%)",
                              transition: "all 0.2s ease",
                              zIndex: bi === selectedBar ? 10 : 1,
                              borderRadius: 1,
                            }}
                          />
                        ))}
                      {/* Show astragal bars */}
                      {transomType === "vertical" &&
                        (vBarPositions.length > 0
                          ? vBarPositions
                          : Array.from(
                              { length: config.astragalBars || 0 },
                              (_, bi) =>
                                (100 / ((config.astragalBars || 0) + 1)) *
                                (bi + 1),
                            )
                        ).map((pos, bi) => (
                          <div
                            key={`a-${bi}`}
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: bi === selectedBar ? 6 : 4,
                              background:
                                bi === selectedBar ? "#f97316" : "#1e293b",
                              left: `${pos}%`,
                              transform: "translateX(-50%)",
                              transition: "all 0.2s ease",
                              zIndex: bi === selectedBar ? 10 : 1,
                              borderRadius: 1,
                            }}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTransomModal(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ border: "1px solid #e2e8f0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trickle Vents */}
      <SectionCard title="Trickle Vents">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Add Vents</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const current =
                  typeof config.trickleVents === "number"
                    ? (config.trickleVents as number)
                    : config.trickleVents
                      ? 1
                      : 0;
                if (current > 0)
                  onUpdate({
                    trickleVents: current - 1,
                  } as any);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 font-bold text-lg transition-all duration-200"
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(249,115,22,0.1)";
                e.currentTarget.style.borderColor = "#f97316";
                e.currentTarget.style.color = "#ea580c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#475569";
              }}
            >
              −
            </button>
            <span className="text-base font-bold text-slate-800 w-6 text-center tabular-nums">
              {typeof config.trickleVents === "number"
                ? (config.trickleVents as number)
                : config.trickleVents
                  ? 1
                  : 0}
            </span>
            <button
              onClick={() => {
                const current =
                  typeof config.trickleVents === "number"
                    ? (config.trickleVents as number)
                    : config.trickleVents
                      ? 1
                      : 0;
                onUpdate({
                  trickleVents: current + 1,
                } as any);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 font-bold text-lg transition-all duration-200"
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(249,115,22,0.1)";
                e.currentTarget.style.borderColor = "#f97316";
                e.currentTarget.style.color = "#ea580c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#475569";
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Edit Vents Button */}
        <div className="flex flex-col items-center gap-3 pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={() => {
              setShowVentModal(true);
              setSelectedVent(0);
              const ventCount =
                typeof config.trickleVents === "number"
                  ? (config.trickleVents as number)
                  : config.trickleVents
                    ? 1
                    : 0;
              if (ventCount > 0 && ventPositions.length !== ventCount) {
                const positions = Array.from(
                  { length: ventCount },
                  (_, i) => (100 / (ventCount + 1)) * (i + 1),
                );
                setVentPositions(positions);
              }
            }}
            className="px-8 py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              boxShadow:
                "0 4px 14px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
          >
            Edit Vents
          </button>
          {(() => {
            const ventCount =
              typeof config.trickleVents === "number"
                ? (config.trickleVents as number)
                : config.trickleVents
                  ? 1
                  : 0;
            return ventCount > 0 ? (
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                {ventCount} Sash Trickle Vent{ventCount > 1 ? "s" : ""}
              </p>
            ) : null;
          })()}
        </div>
      </SectionCard>

      {/* Edit Vents Modal */}
      {showVentModal &&
        (() => {
          const ventCount =
            typeof config.trickleVents === "number"
              ? (config.trickleVents as number)
              : config.trickleVents
                ? 1
                : 0;
          return (
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowVentModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">
                    Edit Vents
                  </h2>
                  <button
                    onClick={() => setShowVentModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="flex flex-col md:flex-row">
                  {/* Left side - controls */}
                  <div className="px-6 py-5 space-y-5 md:w-1/2">
                    {/* Select Section */}
                    <div>
                      <h3 className="text-base font-bold text-slate-800 mb-3">
                        Select Section
                      </h3>
                      <label
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                        style={{
                          border: "2px solid #f97316",
                          background: "rgba(249,115,22,0.04)",
                        }}
                      >
                        <span className="w-3 h-3 rounded-full bg-orange-400" />
                        <span className="text-sm font-medium text-slate-700">
                          Sash
                        </span>
                      </label>
                    </div>

                    {/* Number of vents */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">
                        Number of vents
                      </h3>
                      <input
                        type="number"
                        min={0}
                        value={ventCount}
                        onChange={(e) => {
                          const val = Math.max(
                            0,
                            parseInt(e.target.value) || 0,
                          );
                          const positions = Array.from(
                            { length: val },
                            (_, i) => (100 / (val + 1)) * (i + 1),
                          );
                          onUpdate({
                            trickleVents: val,
                            ventPositions: positions,
                          } as any);
                          setVentPositions(positions);
                          setSelectedVent(0);
                        }}
                        className="w-40 p-3 rounded-xl text-sm text-slate-700 focus:outline-none transition-all"
                        style={{ border: "1px solid #e2e8f0" }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#f97316";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                        }}
                      />
                    </div>

                    {/* Selected Vent */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">
                        Selected Vent
                      </h3>
                      <div
                        className="flex items-center gap-4 px-4 py-2.5 rounded-xl"
                        style={{ border: "1px solid #e2e8f0" }}
                      >
                        <button
                          onClick={() =>
                            setSelectedVent(Math.max(0, selectedVent - 1))
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                          style={{ border: "1px solid #e2e8f0" }}
                        >
                          ‹
                        </button>
                        <span className="text-sm text-slate-600 flex-1 text-center">
                          {ventCount === 0
                            ? "No vents"
                            : `Vent ${selectedVent + 1} of ${ventCount}`}
                        </span>
                        <button
                          onClick={() =>
                            setSelectedVent(
                              Math.min(ventCount - 1, selectedVent + 1),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                          style={{ border: "1px solid #e2e8f0" }}
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* Hint */}
                    <p className="text-sm" style={{ color: "#f97316" }}>
                      Click on the image to position the vent
                    </p>
                  </div>

                  {/* Right side - door preview */}
                  <div className="flex-1 flex justify-center items-start p-4">
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pctX = Math.max(
                          5,
                          Math.min(
                            95,
                            ((e.clientX - rect.left) / rect.width) * 100,
                          ),
                        );
                        if (
                          ventPositions.length > 0 &&
                          selectedVent < ventPositions.length
                        ) {
                          const updated = [...ventPositions];
                          updated[selectedVent] = pctX;
                          setVentPositions(updated);
                          onUpdate({ ventPositions: updated } as any);
                        }
                      }}
                      style={{
                        width: "100%",
                        maxWidth: 380,
                        aspectRatio: `${config.width || 3000} / ${config.height || 2100}`,
                        border: "6px solid #1e293b",
                        borderRadius: 4,
                        display: "flex",
                        overflow: "hidden",
                        position: "relative",
                        background: "#4a5a6a",
                        cursor: "crosshair",
                      }}
                    >
                      {/* Vent bar at top */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 14,
                          background: "#1e293b",
                          zIndex: 20,
                        }}
                      >
                        {(ventPositions.length > 0
                          ? ventPositions
                          : Array.from(
                              { length: ventCount },
                              (_, i) => (100 / (ventCount + 1)) * (i + 1),
                            )
                        ).map((pos, vi) => (
                          <div
                            key={vi}
                            style={{
                              position: "absolute",
                              top: 2,
                              height: 10,
                              width: `${Math.min(15, 60 / Math.max(ventCount, 1))}%`,
                              left: `${pos}%`,
                              transform: "translateX(-50%)",
                              background:
                                vi === selectedVent ? "#ef4444" : "#fbbf24",
                              borderRadius: 2,
                              transition: "all 0.2s ease",
                            }}
                          />
                        ))}
                      </div>

                      {/* Panels */}
                      {Array.from({ length: config.panels || 3 }).map(
                        (_, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              borderLeft: i > 0 ? "3px solid #1e293b" : "none",
                              position: "relative",
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setShowVentModal(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ border: "1px solid #e2e8f0" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Hardware */}
      <SectionCard title="Hardware Colour">
        <HardwareSection config={config} onChange={onUpdate} />
      </SectionCard>

      {/* Extras & Notes */}
      <SectionCard title="Extras & Notes">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
              Optional Extras
            </label>
            <div className="space-y-2">
              {[
                "External Handle",
                "Corner Post",
                "Adjustable Jamb",
                "Flat Pack",
              ].map((extra) => {
                const isChecked = (config.extras || []).includes(extra);
                return (
                  <label
                    key={extra}
                    className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 group"
                    style={{
                      border: isChecked
                        ? "1px solid #fdba74"
                        : "1px solid #e2e8f0",
                      background: isChecked
                        ? "rgba(249,115,22,0.04)"
                        : "#ffffff",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const currentExtras = config.extras || [];
                        const newExtras = e.target.checked
                          ? [...currentExtras, extra]
                          : currentExtras.filter((ex) => ex !== extra);
                        onUpdate({ extras: newExtras } as any);
                      }}
                      className="w-4 h-4 rounded border-slate-300"
                      style={{ accentColor: "#f97316" }}
                    />
                    <span
                      className="text-sm font-medium transition-colors"
                      style={{
                        color: isChecked ? "#c2410c" : "#334155",
                      }}
                    >
                      {extra}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Additional Notes
            </label>
            <textarea
              value={config.notes || ""}
              onChange={(e) => onUpdate({ notes: e.target.value } as any)}
              placeholder="Any special requirements or notes..."
              className="w-full h-24 px-4 py-3 text-sm rounded-xl resize-none focus:outline-none transition-all"
              style={{
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#f97316";
                e.target.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
              }}
            />
          </div>
        </div>
      </SectionCard>
    </>
  );
}
