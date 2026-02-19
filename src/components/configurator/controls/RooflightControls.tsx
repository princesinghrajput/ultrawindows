import React from "react";
import { MapPin } from "lucide-react";
import { RoofConfig } from "../../../types/product";
import SectionCard from "../sections/SectionCard";

interface RooflightControlsProps {
    config: RoofConfig;
    onUpdate: (updates: Partial<RoofConfig>) => void;
}

export default function RooflightControls({ config, onUpdate }: RooflightControlsProps) {
    return (
        <>
            {/* Location */}
            <SectionCard title="Location">
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={config.location || ""}
                        onChange={(e) => onUpdate({ location: e.target.value } as any)}
                        placeholder="e.g. Extension, Kitchen"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
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
                                onUpdate({
                                    outsideColor: color.value,
                                    outsideRAL: undefined,
                                } as any)
                            }
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.outsideColor === color.value && !config.outsideRAL
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`} />
                            <span className="text-xs font-semibold text-slate-700 mt-2">{color.label}</span>
                        </button>
                    ))}

                    {/* RAL Colour Input */}
                    <div
                        className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.outsideRAL
                            ? "bg-sky-50 border-sky-400"
                            : "bg-white border-slate-200"
                            }`}
                    >
                        <span className="text-xs text-slate-500 mb-1">RAL Colour</span>
                        <input
                            type="text"
                            value={config.outsideRAL || "0000"}
                            onChange={(e) =>
                                onUpdate({
                                    outsideRAL: e.target.value,
                                    outsideColor: `RAL ${e.target.value}`,
                                } as any)
                            }
                            className="w-full text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-orange-500"
                        />
                        <button
                            onClick={() => {
                                const ral = config.outsideRAL || "0000";
                                onUpdate({
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
                    ].map((color) => (
                        <button
                            key={color.value}
                            onClick={() =>
                                onUpdate({
                                    insideColor: color.value,
                                    insideRAL: undefined,
                                } as any)
                            }
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.insideColor === color.value && !config.insideRAL
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`} />
                            <span className="text-xs font-semibold text-slate-700 mt-2">{color.label}</span>
                        </button>
                    ))}

                    {/* RAL Colour Input */}
                    <div
                        className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.insideRAL
                            ? "bg-sky-50 border-sky-400"
                            : "bg-white border-slate-200"
                            }`}
                    >
                        <span className="text-xs text-slate-500 mb-1">RAL Colour</span>
                        <input
                            type="text"
                            value={config.insideRAL || "0000"}
                            onChange={(e) =>
                                onUpdate({
                                    insideRAL: e.target.value,
                                    insideColor: `RAL ${e.target.value}`,
                                } as any)
                            }
                            className="w-full text-center border border-slate-200 rounded px-1 py-1 text-sm focus:outline-none focus:border-orange-500"
                        />
                        <button
                            onClick={() => {
                                const ral = config.insideRAL || "0000";
                                onUpdate({
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

            {/* Notes */}
            <SectionCard title="Notes">
                <div>
                    <textarea
                        value={config.notes || ""}
                        onChange={(e) => onUpdate({ notes: e.target.value } as any)}
                        placeholder="Add any notes to the item here"
                        className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y"
                    />
                </div>
            </SectionCard>
        </>
    );
}
