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

interface SingleDoorControlsProps {
    config: DoorConfig;
    onUpdate: (updates: Partial<DoorConfig>) => void;
}

export default function SingleDoorControls({ config, onUpdate }: SingleDoorControlsProps) {
    return (
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
                            onUpdate({ trickleVents: v === "yes" } as any)
                        }
                    />
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
                                                onUpdate({
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
                                onUpdate({ notes: e.target.value } as any)
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
                                    checked={
                                        (config as any).glassThickness !== undefined
                                    }
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

                            {(config as any).glassThickness !== undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                    <span className="text-sm text-slate-600">
                                        Glass Thickness
                                    </span>
                                    <input
                                        type="number"
                                        value={(config as any).glassThickness || ""}
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
                                        onUpdate({
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
                                        onUpdate({
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
                                        <line x1="8" y1="10" x2="32" y2="10" stroke="currentColor" strokeWidth="1.5" />
                                        <line x1="8" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="1.5" />
                                        <line x1="8" y1="18" x2="32" y2="18" stroke="currentColor" strokeWidth="1.5" />
                                        <line x1="8" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.5" />
                                        <line x1="8" y1="26" x2="32" y2="26" stroke="currentColor" strokeWidth="1.5" />
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
                                                    onUpdate({
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
                                            onUpdate({
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
                                            onUpdate({
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
    );
}
