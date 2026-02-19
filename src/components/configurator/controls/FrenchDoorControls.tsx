import React from "react";
import { DoorConfig } from "../../../types/product";
import SectionCard from "../sections/SectionCard";
import ColourSection from "../sections/ColourSection";
import CillSection from "../sections/CillSection";
import HardwareSection from "../sections/HardwareSection";

// ─── Toggle Button Group (local) ─────────────────────────────────────
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

interface FrenchDoorControlsProps {
    config: DoorConfig;
    onUpdate: (updates: Partial<DoorConfig>) => void;
}

export default function FrenchDoorControls({ config, onUpdate }: FrenchDoorControlsProps) {
    return (
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
                            onUpdate({ masterHandle: v } as any)
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
                            onUpdate({ openingDirection: v } as any)
                        }
                    />
                </div>
            </SectionCard>

            {/* Colours */}
            <SectionCard title="Frame Colour">
                <ColourSection
                    config={config as any}
                    onChange={onUpdate as any}
                />
            </SectionCard>

            {/* Cills */}
            <SectionCard title="Cill">
                <CillSection
                    config={config as any}
                    onChange={onUpdate as any}
                />
            </SectionCard>

            {/* Threshold */}
            <SectionCard title="Threshold">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() =>
                            onUpdate({
                                threshold: "standard",
                                thresholdRamp: undefined,
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
                                        config.addons?.[sideKey] ||
                                        "None"
                                    }
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
                                ? config.trickleVents
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
                                    onUpdate({ pas24: e.target.checked } as any)
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

            {/* Hardware */}
            <SectionCard title="Hardware Colour">
                <HardwareSection
                    config={config as any}
                    onChange={onUpdate as any}
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
                                onUpdate({
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
                                onUpdate({
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
                            onUpdate({ notes: e.target.value } as any)
                        }
                        placeholder="Any special requirements or notes..."
                        className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                    />
                </div>
            </SectionCard>
        </>
    );
}
