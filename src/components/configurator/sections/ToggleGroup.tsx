import React from "react";

interface ToggleGroupProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}

export default function ToggleGroup({
  options,
  value,
  onChange,
}: ToggleGroupProps) {
  return (
    <div
      className="inline-flex rounded-xl overflow-hidden"
      style={{
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {options.map((opt, idx) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="relative px-5 py-2.5 text-sm font-semibold transition-all duration-200"
          style={{
            background:
              value === opt.value
                ? "linear-gradient(135deg, #f97316, #ea580c)"
                : "#ffffff",
            color: value === opt.value ? "#fff" : "#64748b",
            borderLeft: idx > 0 ? "1px solid #e2e8f0" : "none",
            boxShadow:
              value === opt.value
                ? "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(249,115,22,0.3)"
                : "none",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
