import React from "react";

interface ToggleGroupProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (v: string) => void;
}

export default function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
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
