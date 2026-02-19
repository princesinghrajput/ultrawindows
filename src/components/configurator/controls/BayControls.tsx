import { ValidationResult } from "../../../utils/validation";
import { BayConfig } from "../../../types/product";
import SectionCard from "../sections/SectionCard";

interface BayControlsProps {
    config: BayConfig;
    onUpdate: (updates: Partial<BayConfig>) => void;
    validation: ValidationResult;
}

export default function BayControls({ config, onUpdate, validation }: BayControlsProps) {
    return (
        <>
            {/* Frame System */}
            <SectionCard title="Frame System">
                <div className="flex justify-center gap-3">
                    {[
                        { label: "Standard", value: "standard" },
                        { label: "Flush", value: "flush" },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                onUpdate({
                                    frameSystem: opt.value,
                                } as any)
                            }
                            className={`px-6 py-2.5 text-sm font-medium rounded-lg border-2 transition-all min-w-[120px] ${config.frameSystem === opt.value
                                ? "bg-sky-500 border-sky-500 text-white shadow-md"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Number of Panes */}
            <SectionCard title="Number Of Panes">
                <div className="flex flex-col items-center gap-3">
                    {/* Row 1: 2-6 */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {[2, 3, 4, 5, 6].map((n) => (
                            <button
                                key={n}
                                onClick={() => {
                                    const newLengths = Array(n)
                                        .fill(0)
                                        .map((_, i) =>
                                            i < (config.lengths?.length || 0)
                                                ? config.lengths[i]
                                                : 0
                                        );
                                    const newAngles = Array(n - 1)
                                        .fill(0)
                                        .map((_, i) =>
                                            i < (config.angles?.length || 0)
                                                ? config.angles[i]
                                                : 0
                                        );
                                    onUpdate({
                                        numberOfPanes: n,
                                        lengths: newLengths,
                                        angles: newAngles,
                                    } as any);
                                }}
                                className={`px-5 py-2 text-sm font-medium rounded-lg border-2 transition-all min-w-[90px] ${config.numberOfPanes === n
                                    ? "bg-sky-500 border-sky-500 text-white shadow-md"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                {n} Panes
                            </button>
                        ))}
                    </div>
                    {/* Row 2: 7-8 */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {[7, 8].map((n) => (
                            <button
                                key={n}
                                onClick={() => {
                                    const newLengths = Array(n)
                                        .fill(0)
                                        .map((_, i) =>
                                            i < (config.lengths?.length || 0)
                                                ? config.lengths[i]
                                                : 0
                                        );
                                    const newAngles = Array(n - 1)
                                        .fill(0)
                                        .map((_, i) =>
                                            i < (config.angles?.length || 0)
                                                ? config.angles[i]
                                                : 0
                                        );
                                    onUpdate({
                                        numberOfPanes: n,
                                        lengths: newLengths,
                                        angles: newAngles,
                                    } as any);
                                }}
                                className={`px-5 py-2 text-sm font-medium rounded-lg border-2 transition-all min-w-[90px] ${config.numberOfPanes === n
                                    ? "bg-sky-500 border-sky-500 text-white shadow-md"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                    }`}
                            >
                                {n} Panes
                            </button>
                        ))}
                    </div>
                </div>
            </SectionCard>

            {/* Height */}
            <SectionCard title="Height">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-semibold text-slate-700">
                            Height
                        </span>
                        <input
                            type="number"
                            value={config.bayHeight || ""}
                            onChange={(e) =>
                                onUpdate({
                                    bayHeight: parseInt(e.target.value) || 0,
                                    height: parseInt(e.target.value) || 0,
                                } as any)
                            }
                            placeholder="Height"
                            className="w-36 px-3 py-2 text-sm border border-slate-200 rounded-lg text-center focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </SectionCard>

            {/* Lengths */}
            <SectionCard title="Lengths">
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({
                        length: config.numberOfPanes,
                    }).map((_, i) => (
                        <div
                            key={`len-${i}`}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <span className="text-sm font-semibold text-slate-700">
                                Length{" "}
                                <span className="text-blue-500">
                                    {String.fromCharCode(97 + i)}
                                </span>
                            </span>
                            <input
                                type="number"
                                value={config.lengths?.[i] || ""}
                                onChange={(e) => {
                                    const newLengths = [
                                        ...(config.lengths || []),
                                    ];
                                    newLengths[i] =
                                        parseInt(e.target.value) || 0;
                                    onUpdate({
                                        lengths: newLengths,
                                    } as any);
                                }}
                                placeholder="Width"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-center focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Angles */}
            <SectionCard title="Angles">
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({
                        length: config.numberOfPanes - 1,
                    }).map((_, i) => (
                        <div
                            key={`ang-${i}`}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <span className="text-sm font-semibold text-slate-700">
                                Angle{" "}
                                <span className="text-red-500">
                                    {String.fromCharCode(65 + i)}
                                </span>
                            </span>
                            <input
                                type="number"
                                value={config.angles?.[i] || ""}
                                onChange={(e) => {
                                    const newAngles = [
                                        ...(config.angles || []),
                                    ];
                                    newAngles[i] =
                                        parseInt(e.target.value) || 0;
                                    onUpdate({
                                        angles: newAngles,
                                    } as any);
                                }}
                                placeholder="Angle"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg text-center focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    ))}
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
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.outsideColor === color.value &&
                                !config.outsideRAL
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div
                                className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`}
                            />
                            <span className="text-xs font-semibold text-slate-700 mt-2">
                                {color.label}
                            </span>
                        </button>
                    ))}

                    <div
                        className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.outsideRAL
                            ? "bg-sky-50 border-sky-400"
                            : "bg-white border-slate-200"
                            }`}
                    >
                        <span className="text-xs text-slate-500 mb-1">
                            RAL Colour
                        </span>
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
                        { label: "Black", value: "black", bg: "bg-black" },
                    ].map((color) => (
                        <button
                            key={color.value}
                            onClick={() =>
                                onUpdate({
                                    insideColor: color.value,
                                    insideRAL: undefined,
                                } as any)
                            }
                            className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.insideColor === color.value &&
                                !config.insideRAL
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <div
                                className={`w-full h-12 rounded-lg ${color.bg} border border-slate-300`}
                            />
                            <span className="text-xs font-semibold text-slate-700 mt-2">
                                {color.label}
                            </span>
                        </button>
                    ))}

                    <div
                        className={`flex flex-col items-center p-3 border-2 rounded-xl w-28 transition-all ${config.insideRAL
                            ? "bg-sky-50 border-sky-400"
                            : "bg-white border-slate-200"
                            }`}
                    >
                        <span className="text-xs text-slate-500 mb-1">
                            RAL Colour
                        </span>
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

            {/* Cill */}
            <SectionCard title="Cill">
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { label: "No Cill", value: "none", hasIcon: false },
                        { label: "90mm", value: "90mm", hasIcon: true },
                        { label: "150mm", value: "150mm", hasIcon: true },
                        { label: "180mm", value: "180mm", hasIcon: true },
                        { label: "230mm", value: "230mm", hasIcon: true },
                    ].map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() =>
                                onUpdate({ cill: opt.value } as any)
                            }
                            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl w-24 h-24 transition-all ${config.cill === opt.value
                                ? "bg-sky-50 border-sky-400"
                                : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            {opt.hasIcon ? (
                                <img
                                    src="/images/aluminium_bifolf/standard.png"
                                    className="w-12 h-8 object-contain mb-1"
                                    alt={opt.label}
                                />
                            ) : (
                                <svg
                                    className="w-8 h-8 text-slate-400 mb-1"
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
                            )}
                            <span className="text-xs font-semibold text-slate-700">
                                {opt.label}
                            </span>
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Glass Type */}
            <SectionCard title="Glass Type">
                <div className="space-y-4">
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

                    <div className="flex flex-col gap-3">
                        <span className="text-sm text-slate-600 font-medium">
                            Glass Type
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: "Unglazed", value: "unglazed" },
                                { label: "Toughened", value: "toughened" },
                                {
                                    label: "Toughened Obscured",
                                    value: "toughened_obscure",
                                },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        let defaultPattern: string | null = null;
                                        if (opt.value === "toughened")
                                            defaultPattern = "Low E (1.0 u-value)";
                                        if (opt.value === "toughened_obscure")
                                            defaultPattern = "Satin";
                                        onUpdate({
                                            glassType: opt.value as any,
                                            glassPattern: defaultPattern,
                                        } as any);
                                    }}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${config.glassType === opt.value
                                        ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
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
                            <span className="text-sm text-slate-600 font-medium">
                                Glass
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
                                            ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
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
                                            ? "bg-sky-50 border-sky-400 text-sky-700 font-medium"
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

            {/* Validation */}
            {!validation.isValid && (
                <div className="text-red-600 text-sm font-medium bg-red-50 px-4 py-3 rounded-lg border border-red-100">
                    <p className="font-semibold mb-1">
                        Invalid configuration, please go back and change the
                        options to satisfy this criteria
                    </p>
                    <ul className="list-disc ml-4">
                        <li>{validation.message}</li>
                    </ul>
                </div>
            )}
        </>
    );
}
