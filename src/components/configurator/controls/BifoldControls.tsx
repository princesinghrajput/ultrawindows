import React from "react";
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

export default function BifoldControls({ config, onUpdate, panelOptions }: BifoldControlsProps) {
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
                            className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all min-w-20 ${config.panels === num
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
                    config={config}
                    onChange={onUpdate}
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
                            onUpdate({ openingDirection: v } as any)
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
                        value={config.trafficDoor ? "yes" : "no"}
                        onChange={(v) =>
                            onUpdate({ trafficDoor: v === "yes" } as any)
                        }
                    />
                </div>
            </SectionCard>

            {/* Colours */}
            <SectionCard title="Frame Colour">
                <ColourSection
                    config={config}
                    onChange={onUpdate}
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
                                checked={config.pas24 || false}
                                onChange={(e) =>
                                    onUpdate({
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
                                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Specify Glass Thickness (if not 28mm)
                                </span>
                            </label>

                            {config.glassThickness !== undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                    <span className="text-sm text-slate-600">
                                        Glass Thickness
                                    </span>
                                    <input
                                        type="number"
                                        value={config.glassThickness || ""}
                                        onChange={(e) =>
                                            onUpdate({
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

                    {/* Glass Type */}
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
                                        let defaultPattern: string | null = null;
                                        if (opt.value === "toughened")
                                            defaultPattern = "Clear";
                                        if (opt.value === "toughened_obscure")
                                            defaultPattern = "Satin";
                                        onUpdate({
                                            glassType: opt.value as any,
                                            glassPattern: defaultPattern,
                                        } as any);
                                    }}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${config.glassType === opt.value
                                        ? "bg-orange-50 border-orange-500 text-orange-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toughened Glass Options */}
                    {config.glassType === "toughened" && (
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
                                            onUpdate({
                                                glassPattern: opt,
                                            } as any)
                                        }
                                        className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${config.glassPattern === opt
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
                    {config.glassType === "toughened_obscure" && (
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
                                            onUpdate({
                                                glassPattern: opt,
                                            } as any)
                                        }
                                        className={`p-2 text-xs border rounded-lg transition-all ${config.glassPattern === opt
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
                    config={config}
                    onChange={onUpdate}
                />
            </SectionCard>

            {/* Threshold */}
            <SectionCard title="Threshold">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() =>
                            onUpdate({ threshold: "standard" } as any)
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
                            onUpdate({ threshold: "low" } as any)
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
                {config.threshold === "low" && (
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
                                        onUpdate({
                                            thresholdRamp: opt.value as any,
                                        } as any)
                                    }
                                    className={`py-3 px-2 text-sm border rounded-lg transition-all ${(config.thresholdRamp || "none") === opt.value
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
                                    value={config.addons?.[sideLower] || "None"}
                                    onChange={(e) => {
                                        const val =
                                            e.target.value === "None"
                                                ? null
                                                : e.target.value;
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

            {/* Transom Bars */}
            <SectionCard title="Transom Bars">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                        Number of Transom Bars
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                const current = config.transomBars || 0;
                                if (current > 0)
                                    onUpdate({
                                        transomBars: current - 1,
                                    } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-smfont-medium w-4 text-center">
                            {config.transomBars || 0}
                        </span>
                        <button
                            onClick={() => {
                                const current = config.transomBars || 0;
                                onUpdate({ transomBars: current + 1 } as any);
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
                                const current = config.astragalBars || 0;
                                if (current > 0)
                                    onUpdate({
                                        astragalBars: current - 1,
                                    } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-smfont-medium w-4 text-center">
                            {config.astragalBars || 0}
                        </span>
                        <button
                            onClick={() => {
                                const current = config.astragalBars || 0;
                                onUpdate({
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
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-smfont-medium w-4 text-center">
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
                    config={config}
                    onChange={onUpdate}
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
                                        checked={(config.extras || []).includes(extra)}
                                        onChange={(e) => {
                                            const currentExtras = config.extras || [];
                                            const newExtras = e.target.checked
                                                ? [...currentExtras, extra]
                                                : currentExtras.filter(
                                                    (ex) => ex !== extra,
                                                );
                                            onUpdate({ extras: newExtras } as any);
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
                                onUpdate({ notes: e.target.value } as any)
                            }
                            placeholder="Any special requirements or notes..."
                            className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                        />
                    </div>
                </div>
            </SectionCard>
        </>
    );
}
