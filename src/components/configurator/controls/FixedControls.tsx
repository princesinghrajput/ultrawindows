import React from "react";
import { MapPin } from "lucide-react";
import { FixedConfig } from "../../../types/product";
import SectionCard from "../sections/SectionCard";

interface FixedControlsProps {
    config: FixedConfig;
    onUpdate: (updates: Partial<FixedConfig>) => void;
}

const OUTSIDE_COLORS = [
    { label: "White", value: "white", bg: "bg-gray-200" },
    { label: "Black", value: "black", bg: "bg-black" },
    { label: "Grey", value: "grey", bg: "bg-slate-600" },
];

const INSIDE_COLORS = [
    { label: "White", value: "white", bg: "bg-gray-200" },
    { label: "Black", value: "black", bg: "bg-black" },
];

const CILL_OPTIONS = [
    { label: "No Cill", value: "none", hasIcon: false },
    { label: "90mm", value: "90mm", hasIcon: true },
    { label: "150mm", value: "150mm", hasIcon: true },
    { label: "180mm", value: "180mm", hasIcon: true },
    { label: "230mm", value: "230mm", hasIcon: true },
];

const GLASS_TYPES = [
    { label: "Unglazed", value: "unglazed" },
    { label: "Toughened", value: "toughened" },
    { label: "Toughened Obscured", value: "toughened_obscure" },
];

const TOUGHENED_OPTIONS = [
    "Low E (1.2 u-value)", "6.8 Laminated (1.2 u-value)", "Low E (1.0 u-value)",
    "6.8 Acoustic Laminated (1.2 u-value)", "Triple Glazed (0.6 u-value)",
];

const OBSCURE_PATTERNS = [
    "Arctic (L5)", "Autumn (L3)", "Contora (L4)", "Cotswold (L5)",
    "Reeded (L2)", "Stippolyte (L4)", "Cassini (L5)", "Chantilly (L2)",
    "Charcoal Sticks (L4)", "Digital (L3)", "Everglade (L5)", "Flemish (L1)",
    "Florielle (L4)", "Mayflower (L4)", "Minster (L2)", "Oak (L4)",
    "Pelerine (L4)", "Sycamore (L2)", "Taffeta (L3)", "Warwick (L1)", "Satin",
];

export default function FixedControls({ config, onUpdate }: FixedControlsProps) {
    return (
        <>
            {/* Location */}
            <SectionCard title="Location">
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <input type="text" value={config.location || ""}
                        onChange={(e) => onUpdate({ location: e.target.value } as any)}
                        placeholder="e.g. Living Room, Kitchen"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                </div>
            </SectionCard>

            {/* Outside Frame Colour */}
            <SectionCard title="Outside Frame Colour">
                <div className="flex flex-wrap gap-3 items-start">
                    {OUTSIDE_COLORS.map((color) => (
                        <button key={color.value}
                            onClick={() => onUpdate({ outsideColor: color.value, outsideRAL: undefined } as any)}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.outsideColor === color.value && !config.outsideRAL
                                ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                            <div className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`} />
                            <span className="text-xs font-semibold text-slate-700 mt-2">{color.label}</span>
                        </button>
                    ))}
                    <div className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.outsideRAL ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200"}`}>
                        <span className="text-xs text-slate-500 mb-1">RAL Colour</span>
                        <input type="text" value={config.outsideRAL || "0000"}
                            onChange={(e) => onUpdate({ outsideRAL: e.target.value, outsideColor: `RAL ${e.target.value}` } as any)}
                            className="w-full text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-orange-500" />
                        <button onClick={() => { const ral = config.outsideRAL || "0000"; onUpdate({ outsideRAL: ral, outsideColor: `RAL ${ral}` } as any); }}
                            className="mt-1 px-3 py-1 bg-orange-500 text-white text-xs rounded font-medium hover:bg-orange-600 transition-colors">Add RAL</button>
                    </div>
                </div>
            </SectionCard>

            {/* Inside Frame Colour */}
            <SectionCard title="Inside Frame Colour">
                <div className="flex flex-wrap gap-3 items-start">
                    {INSIDE_COLORS.map((color) => (
                        <button key={color.value}
                            onClick={() => onUpdate({ insideColor: color.value, insideRAL: undefined } as any)}
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.insideColor === color.value && !config.insideRAL
                                ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                            <div className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`} />
                            <span className="text-xs font-semibold text-slate-700 mt-2">{color.label}</span>
                        </button>
                    ))}
                    <div className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.insideRAL ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200"}`}>
                        <span className="text-xs text-slate-500 mb-1">RAL Colour</span>
                        <input type="text" value={config.insideRAL || "0000"}
                            onChange={(e) => onUpdate({ insideRAL: e.target.value, insideColor: `RAL ${e.target.value}` } as any)}
                            className="w-full text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-orange-500" />
                        <button onClick={() => { const ral = config.insideRAL || "0000"; onUpdate({ insideRAL: ral, insideColor: `RAL ${ral}` } as any); }}
                            className="mt-1 px-3 py-1 bg-orange-500 text-white text-xs rounded font-medium hover:bg-orange-600 transition-colors">Add RAL</button>
                    </div>
                </div>
            </SectionCard>

            {/* Cill */}
            <SectionCard title="Cill">
                <div className="flex flex-wrap justify-center gap-3">
                    {CILL_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => onUpdate({ cill: opt.value } as any)}
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl w-24 h-24 transition-all ${config.cill === opt.value
                                ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200 hover:border-slate-300"}`}>
                            {opt.hasIcon ? (
                                <img src="/images/aluminium_bifolf/standard.png" className="w-12 h-8 object-contain mb-1" alt={opt.label} />
                            ) : (
                                <svg className="w-8 h-8 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Addons */}
            <SectionCard title="Addons">
                <div className="flex justify-center gap-6">
                    {(["Left", "Top", "Right"] as const).map((side) => {
                        const sideKey = side.toLowerCase() as "left" | "top" | "right";
                        return (
                            <div key={side} className="flex flex-col items-center gap-2">
                                <span className="text-sm text-slate-600">{side}</span>
                                <select value={config.addons?.[sideKey] || "None"}
                                    onChange={(e) => {
                                        const val = e.target.value === "None" ? null : e.target.value;
                                        const currentAddons = config.addons || { left: null, right: null, top: null };
                                        onUpdate({ addons: { ...currentAddons, [sideKey]: val } } as any);
                                    }}
                                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none w-28">
                                    <option value="None">None</option>
                                    <option value="20mm Addon">20mm</option>
                                    <option value="38mm Addon">38mm</option>
                                </select>
                            </div>
                        );
                    })}
                </div>
            </SectionCard>

            {/* Transom Bars */}
            <SectionCard title="Transom Bars">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Door Horizontal Transom</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => { if ((config.transomBars || 0) > 0) onUpdate({ transomBars: (config.transomBars || 0) - 1 } as any); }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">-</button>
                            <span className="text-sm font-medium w-4 text-center">{config.transomBars || 0}</span>
                            <button onClick={() => onUpdate({ transomBars: (config.transomBars || 0) + 1 } as any)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">+</button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm text-slate-600">Door Vertical Transom</span>
                        <div className="flex items-center gap-3">
                            <button onClick={() => { if ((config.astragalBars || 0) > 0) onUpdate({ astragalBars: (config.astragalBars || 0) - 1 } as any); }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">-</button>
                            <span className="text-sm font-medium w-4 text-center">{config.astragalBars || 0}</span>
                            <button onClick={() => onUpdate({ astragalBars: (config.astragalBars || 0) + 1 } as any)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">+</button>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Glass Type */}
            <SectionCard title="Glass Type">
                <div className="space-y-4">
                    <div className="pb-4 flex flex-col gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={config.pas24 || false}
                                onChange={(e) => onUpdate({ pas24: e.target.checked } as any)}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
                            <span className="text-sm font-medium text-slate-700">PAS 24 Certified</span>
                        </label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={config.glassThickness !== undefined}
                                    onChange={(e) => onUpdate({ glassThickness: e.target.checked ? 28 : undefined } as any)}
                                    className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500" />
                                <span className="text-sm font-medium text-slate-700">Specify Glass Thickness (if not 28mm)</span>
                            </label>
                            {config.glassThickness !== undefined && (
                                <div className="flex items-center gap-2 ml-6">
                                    <span className="text-sm text-slate-600">Glass Thickness</span>
                                    <input type="number" value={config.glassThickness || ""}
                                        onChange={(e) => onUpdate({ glassThickness: parseInt(e.target.value) || 0 } as any)}
                                        className="w-20 p-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500" />
                                    <span className="text-sm text-slate-600">mm</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <span className="text-sm text-slate-600 font-medium">Glass Type</span>
                        <div className="grid grid-cols-3 gap-2">
                            {GLASS_TYPES.map((opt) => (
                                <button key={opt.value}
                                    onClick={() => {
                                        let defaultPattern: string | null = null;
                                        if (opt.value === "toughened") defaultPattern = "Low E (1.0 u-value)";
                                        if (opt.value === "toughened_obscure") defaultPattern = "Satin";
                                        onUpdate({ glassType: opt.value as any, glassPattern: defaultPattern } as any);
                                    }}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${config.glassType === opt.value
                                        ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{opt.label}</button>
                            ))}
                        </div>
                    </div>
                    {config.glassType === "toughened" && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600 font-medium">Glass</span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {TOUGHENED_OPTIONS.map((opt) => (
                                    <button key={opt} onClick={() => onUpdate({ glassPattern: opt } as any)}
                                        className={`p-3 text-sm flex items-center justify-center text-center border rounded-lg transition-all h-20 ${config.glassPattern === opt
                                            ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    {config.glassType === "toughened_obscure" && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm text-slate-600">Obscure Pattern</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {OBSCURE_PATTERNS.map((opt) => (
                                    <button key={opt} onClick={() => onUpdate({ glassPattern: opt } as any)}
                                        className={`p-2 text-xs border rounded-lg transition-all ${config.glassPattern === opt
                                            ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* Notes */}
            <SectionCard title="Notes">
                <div>
                    <textarea value={config.notes || ""}
                        onChange={(e) => onUpdate({ notes: e.target.value } as any)}
                        placeholder="Add any notes to the item here"
                        className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y" />
                </div>
            </SectionCard>
        </>
    );
}
