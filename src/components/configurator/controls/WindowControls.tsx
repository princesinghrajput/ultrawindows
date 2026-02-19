import React from "react";
import { WindowConfig } from "../../../types/product";
import SectionCard from "../sections/SectionCard";
import ColourSection from "../sections/ColourSection";
import HardwareSection from "../sections/HardwareSection";
import CillSection from "../sections/CillSection";
import WindowStyleSelector from "../sections/WindowStyleSelector";

interface WindowControlsProps {
    config: WindowConfig;
    onUpdate: (updates: Partial<WindowConfig>) => void;
}

export default function WindowControls({ config, onUpdate }: WindowControlsProps) {
    return (
        <>
            {/* Frame System */}
            <SectionCard title="Frame System">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {["standard", "flush"].map((sys) => (
                        <button
                            key={sys}
                            onClick={() => onUpdate({ frameSystem: sys } as any)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${config.frameSystem === sys
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
                    value={config.windowStyle || "style-21"}
                    onChange={(styleId) => onUpdate({ windowStyle: styleId } as any)}
                />
            </SectionCard>

            {/* Colours */}
            <SectionCard title="Frame Colour">
                <ColourSection
                    config={config as any}
                    onChange={onUpdate as any}
                />
            </SectionCard>

            {/* Hardware */}
            <SectionCard title="Hardware Colour">
                <HardwareSection
                    config={config as any}
                    onChange={(updates) => onUpdate({ ...updates } as any)}
                />
            </SectionCard>

            {/* Cill */}
            <SectionCard title="Cill">
                <CillSection
                    config={config as any}
                    onChange={onUpdate as any}
                />
            </SectionCard>

            {/* Trickle Vents */}
            <SectionCard title="Trickle Vents">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Number of Trickle Vents</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                const current = typeof config.trickleVents === "number"
                                    ? (config.trickleVents as number)
                                    : config.trickleVents ? 1 : 0;
                                if (current > 0) onUpdate({ trickleVents: current - 1 } as any);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                            -
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                            {typeof config.trickleVents === "number"
                                ? config.trickleVents
                                : config.trickleVents ? 1 : 0}
                        </span>
                        <button
                            onClick={() => {
                                const current = typeof config.trickleVents === "number"
                                    ? (config.trickleVents as number)
                                    : config.trickleVents ? 1 : 0;
                                onUpdate({ trickleVents: current + 1 } as any);
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
                                checked={config.pas24 || false}
                                onChange={(e) => onUpdate({ pas24: e.target.checked } as any)}
                                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-500"
                            />
                            <span className="text-sm font-medium text-slate-700">PAS 24 Certified</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {["Clear", "Obscure", "Laminated"].map((type) => (
                            <button
                                key={type}
                                onClick={() => onUpdate({ glassType: type.toLowerCase() as any })}
                                className={`px-3 py-2 text-sm border rounded-lg transition-all ${config.glassType === type.toLowerCase()
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
                                    value={config.addons?.[sideKey] || "None"}
                                    onChange={(e) => {
                                        const val = e.target.value === "None" ? null : e.target.value;
                                        const currentAddons = config.addons || { left: null, right: null, top: null };
                                        onUpdate({ addons: { ...currentAddons, [sideKey]: val } } as any);
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
    );
}
