import React, { useState } from "react";
import { SliderConfig } from "../../../types/product";
import SectionCard from "../sections/SectionCard";

interface SliderControlsProps {
    config: SliderConfig;
    onUpdate: (updates: Partial<SliderConfig>) => void;
}

export default function SliderControls({ config, onUpdate }: SliderControlsProps) {
    const [isAstragalModalOpen, setIsAstragalModalOpen] = useState(false);
    const [selectedPane, setSelectedPane] = useState(0);
    const [selectedBar, setSelectedBar] = useState(0);

    return (
        <>
            {/* Number of Panes */}
            <SectionCard title="Number of Panes">
                <div className="flex justify-center gap-2">
                    {[2].map((num) => (
                        <button
                            key={num}
                            onClick={() =>
                                onUpdate({
                                    panels: num,
                                } as any)
                            }
                            className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all min-w-28 ${config.panels === num
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
                                onUpdate({ slideDirection: opt.value } as any)
                            }
                            className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${config.slideDirection === opt.value
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
                                <rect x="12" y="12" width="24" height="56" rx="1" opacity="0.3" />
                                {/* Right pane */}
                                <rect x="44" y="12" width="24" height="56" rx="1" opacity="0.3" />
                                {/* Arrows based on direction */}
                                {(opt.value === "left" || opt.value === "both") && (
                                    <>
                                        <line x1="32" y1="40" x2="18" y2="40" strokeWidth="2.5" />
                                        <polyline points="22,36 18,40 22,44" strokeWidth="2.5" />
                                    </>
                                )}
                                {(opt.value === "right" || opt.value === "both") && (
                                    <>
                                        <line x1="48" y1="40" x2="62" y2="40" strokeWidth="2.5" />
                                        <polyline points="58,36 62,40 58,44" strokeWidth="2.5" />
                                    </>
                                )}
                                {/* Handle indicators */}
                                {opt.value === "left" && (
                                    <rect x="34" y="36" width="3" height="8" rx="1" fill="currentColor" />
                                )}
                                {opt.value === "right" && (
                                    <rect x="43" y="36" width="3" height="8" rx="1" fill="currentColor" />
                                )}
                                {opt.value === "both" && (
                                    <>
                                        <rect x="34" y="36" width="3" height="8" rx="1" fill="currentColor" />
                                        <rect x="43" y="36" width="3" height="8" rx="1" fill="currentColor" />
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
                                { name: "White", value: "white", img: "white.jpg" },
                                { name: "Black", value: "black", img: "black.jpg" },
                                { name: "Grey", value: "grey", img: "grey.jpg" },
                            ].map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() =>
                                        onUpdate({
                                            outsideColor: c.value,
                                            color: c.value,
                                        } as any)
                                    }
                                    className={`group relative w-28 flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${config.outsideColor === c.value
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
                                        config.outsideColor?.startsWith("RAL")
                                            ? config.outsideColor.replace("RAL ", "")
                                            : ""
                                    }
                                    onChange={(e) => {
                                        if (e.target.value)
                                            onUpdate({
                                                outsideColor: `RAL ${e.target.value}`,
                                                color: `RAL ${e.target.value}`,
                                            } as any);
                                    }}
                                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded text-center focus:outline-none focus:border-orange-500"
                                />
                                <button
                                    onClick={() => {
                                        const input = config.outsideColor?.startsWith("RAL")
                                            ? config.outsideColor
                                            : "";
                                        if (input)
                                            onUpdate({
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
                                { name: "White", value: "white", img: "white.jpg" },
                                { name: "Black", value: "black", img: "black.jpg" },
                            ].map((c) => (
                                <button
                                    key={c.value}
                                    onClick={() =>
                                        onUpdate({ insideColor: c.value } as any)
                                    }
                                    className={`group relative w-28 flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${config.insideColor === c.value
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
                                        config.insideColor?.startsWith("RAL")
                                            ? config.insideColor.replace("RAL ", "")
                                            : ""
                                    }
                                    onChange={(e) => {
                                        if (e.target.value)
                                            onUpdate({
                                                insideColor: `RAL ${e.target.value}`,
                                            } as any);
                                    }}
                                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded text-center focus:outline-none focus:border-orange-500"
                                />
                                <button
                                    onClick={() => {
                                        const input = config.insideColor?.startsWith("RAL")
                                            ? config.insideColor
                                            : "";
                                        if (input)
                                            onUpdate({ insideColor: input } as any);
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
                            { name: "180mm", value: "180mm", img: "cill_150.png" },
                            { name: "230mm", value: "230mm", img: "cill_230.png" },
                            { name: "250mm", value: "250mm", img: "cill_190.png" },
                        ].map((c) => (
                            <button
                                key={c.value}
                                onClick={() =>
                                    onUpdate({ cill: c.value } as any)
                                }
                                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all h-28 justify-between ${config.cill === c.value
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
                                if (e.target.checked) newExtras.add("lift_and_slide");
                                else newExtras.delete("lift_and_slide");
                                onUpdate({
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
                                    value={config.addons?.[sideKey] || "None"}
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
                                    onUpdate({ hardwareColor: h.value } as any)
                                }
                                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${config.hardwareColor === h.value
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
                                    onUpdate({ hardwareColor: h.value } as any)
                                }
                                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${config.hardwareColor === h.value
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
                            checked={config.pas24 || false}
                            onChange={(e) =>
                                onUpdate({ pas24: e.target.checked } as any)
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
                            checked={!!config.glassThickness}
                            onChange={(e) =>
                                onUpdate({
                                    glassThickness: e.target.checked ? 28 : undefined,
                                } as any)
                            }
                            className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-slate-700 font-medium">
                            Specify Glass Thickness (if not 28mm)
                        </span>
                    </label>
                    {config.glassThickness && (
                        <input
                            type="number"
                            value={config.glassThickness || 28}
                            onChange={(e) =>
                                onUpdate({
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
                            { label: "Toughened Obscured", value: "toughened_obscure" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    let defaultPattern: string | null = null;
                                    if (opt.value === "toughened") defaultPattern = "Clear";
                                    if (opt.value === "toughened_obscure") defaultPattern = "Satin";
                                    onUpdate({
                                        glassType: opt.value as any,
                                        glassPattern: defaultPattern,
                                        blinds: undefined,
                                        blindsColour: undefined,
                                    } as any);
                                }}
                                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${config.glassType === opt.value
                                    ? "bg-sky-50 border-sky-300"
                                    : "bg-white border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {opt.value === "unglazed" && (
                                    <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                {opt.value === "toughened" && (
                                    <svg className="w-12 h-12 text-slate-500 mb-2" fill="none" viewBox="0 0 40 40">
                                        <rect x="6" y="4" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <rect x="10" y="8" width="20" height="24" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
                                        <circle cx="17" cy="26" r="1.5" fill="currentColor" />
                                        <circle cx="23" cy="26" r="1.5" fill="currentColor" />
                                        <circle cx="20" cy="29" r="1.5" fill="currentColor" />
                                    </svg>
                                )}
                                {opt.value === "toughened_obscure" && (
                                    <svg className="w-12 h-12 text-slate-500 mb-2" fill="none" viewBox="0 0 40 40">
                                        <rect x="6" y="4" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <rect x="10" y="8" width="20" height="24" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
                                        <line x1="10" y1="12" x2="30" y2="28" stroke="currentColor" strokeWidth="0.8" />
                                        <line x1="10" y1="16" x2="26" y2="28" stroke="currentColor" strokeWidth="0.8" />
                                        <line x1="10" y1="20" x2="22" y2="28" stroke="currentColor" strokeWidth="0.8" />
                                        <line x1="14" y1="12" x2="30" y2="24" stroke="currentColor" strokeWidth="0.8" />
                                        <line x1="18" y1="12" x2="30" y2="20" stroke="currentColor" strokeWidth="0.8" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium text-slate-700">
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Blinds - when Toughened */}
                    {config.glassType === "toughened" && (
                        <div className="flex flex-col gap-3 pt-2">
                            <span className="text-sm text-slate-600 font-medium">
                                Blinds
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() =>
                                        onUpdate({
                                            blinds: "none",
                                            blindsColour: undefined,
                                        } as any)
                                    }
                                    className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${!config.blinds || config.blinds === "none"
                                        ? "bg-sky-50 border-sky-300"
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">
                                        No Blinds
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        onUpdate({
                                            blinds: "mechanical",
                                            blindsColour: (config as any).blindsColour || "White",
                                        } as any)
                                    }
                                    className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all ${config.blinds === "mechanical"
                                        ? "bg-sky-50 border-sky-300"
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <svg className="w-10 h-10 text-slate-500 mb-2" fill="none" viewBox="0 0 40 40">
                                        <rect x="6" y="4" width="28" height="32" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
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

                            {config.blinds === "mechanical" && (
                                <div className="flex flex-col gap-2 mt-2">
                                    <span className="text-sm text-slate-600 font-medium">
                                        Blinds Colour
                                    </span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            "White", "Yellow", "Agate Grey", "Beige",
                                            "Green", "Light Blue", "Cream", "Light Grey",
                                            "Metallic Silver", "Silver", "Slate Grey",
                                            "Anthracite", "Black",
                                        ].map((colour) => (
                                            <button
                                                key={colour}
                                                onClick={() =>
                                                    onUpdate({
                                                        blindsColour: colour,
                                                    } as any)
                                                }
                                                className={`py-2 px-2 text-sm rounded-lg border transition-all ${config.blindsColour === colour
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
                                            onUpdate({ glassPattern: opt } as any)
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
                                    "Arctic (L5)", "Autumn (L3)", "Contora (L4)",
                                    "Cotswold (L5)", "Reeded (L2)", "Stippolyte (L4)",
                                    "Cassini (L5)", "Chantilly (L2)", "Charcoal Sticks (L4)",
                                    "Digital (L3)", "Everglade (L5)", "Flemish (L1)",
                                    "Florielle (L4)", "Mayflower (L4)", "Minster (L2)",
                                    "Oak (L4)", "Pelerine (L4)", "Sycamore (L2)",
                                    "Taffeta (L3)", "Warwick (L1)", "Satin",
                                ].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() =>
                                            onUpdate({ glassPattern: opt } as any)
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

            {/* Astragal Bars */}
            <SectionCard title="Astragal Bars">
                <div className="flex flex-col items-center gap-2">
                    <button
                        className="px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors shadow-sm"
                        onClick={() => setIsAstragalModalOpen(true)}
                    >
                        Edit Astragal Bars
                    </button>
                    {(config.astragalBars || 0) > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                            {config.astragalBars} vertical bar(s) configured
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
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                                    value={config.transomBars || 0}
                                    onChange={(e) =>
                                        onUpdate({
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
                                    value={config.astragalBars || 0}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        onUpdate({ astragalBars: val } as any);
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
                                        disabled={(config.astragalBars || 0) === 0}
                                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className="text-sm text-slate-600 min-w-[100px] text-center">
                                        {(config.astragalBars || 0) > 0
                                            ? `Bar ${selectedBar + 1} of ${config.astragalBars}`
                                            : "No bars to show"}
                                    </span>
                                    <button
                                        onClick={() =>
                                            setSelectedBar(
                                                Math.min(
                                                    (config.astragalBars || 1) - 1,
                                                    selectedBar + 1,
                                                ),
                                            )
                                        }
                                        disabled={(config.astragalBars || 0) === 0}
                                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-300 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Evenly space */}
                            <button
                                disabled={(config.astragalBars || 0) === 0}
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
                                        (selectedPane + 1) % (config.panels || 2),
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
                                        {Array.from({ length: config.panels || 2 }).map((_, i) => (
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
                                                    (config.astragalBars || 0) > 0 &&
                                                    Array.from({ length: config.astragalBars || 0 }).map((_, barIdx) => {
                                                        const spacing = 100 / ((config.astragalBars || 0) + 1);
                                                        return (
                                                            <div
                                                                key={barIdx}
                                                                className={`absolute top-0 bottom-0 w-0.5 ${barIdx === selectedBar ? "bg-orange-500" : "bg-slate-600"}`}
                                                                style={{ left: `${spacing * (barIdx + 1)}%` }}
                                                            />
                                                        );
                                                    })}
                                                {/* Horizontal transom bars */}
                                                {(config.transomBars || 0) > 0 &&
                                                    Array.from({ length: config.transomBars || 0 }).map((_, barIdx) => {
                                                        const spacing = 100 / ((config.transomBars || 0) + 1);
                                                        return (
                                                            <div
                                                                key={`h-${barIdx}`}
                                                                className="absolute left-0 right-0 h-0.5 bg-slate-600"
                                                                style={{ top: `${spacing * (barIdx + 1)}%` }}
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
                            onUpdate({ notes: e.target.value } as any)
                        }
                        placeholder="Add any notes to the item here"
                        className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y"
                    />
                </div>
            </SectionCard>
        </>
    );
}
