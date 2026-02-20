import React from "react";
import { BifoldConfig } from "../../../types/product";

interface HardwareSectionProps {
  config: BifoldConfig;
  onChange: (updates: Partial<BifoldConfig>) => void;
}

const handles = [
  { name: "White", value: "white", img: "white.jpg" },
  { name: "Black", value: "black", img: "black.jpg" },
  { name: "Chrome", value: "chrome", img: "chrome.jpg" },
  { name: "Gold", value: "gold", img: "gold.png" },
  { name: "Satin", value: "satin", img: "satin.jpg" },
  { name: "Stainless", value: "stainless", img: "coastal_stainless_steel.jpg" },
];

const HardwareSection: React.FC<HardwareSectionProps> = ({
  config,
  onChange,
}) => {
  return (
    <div>
      <h3 className="text-sm font-bold mb-4 text-center text-slate-700 uppercase tracking-wide">
        Hardware Colour
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {handles.map((h) => {
          const isSelected = config.handleColor === h.value;
          return (
            <button
              key={h.value}
              onClick={() => onChange({ handleColor: h.value })}
              className="group relative flex flex-col items-center p-3 rounded-xl transition-all duration-200"
              style={{
                border: isSelected ? "2px solid #f97316" : "1px solid #e2e8f0",
                background: isSelected ? "rgba(249,115,22,0.04)" : "#ffffff",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(249,115,22,0.15)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div className="h-16 w-16 mb-2 relative flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <img
                  src={`/images/aluminium_bifolf/${h.img}`}
                  alt={h.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {/* Selected check */}
              {isSelected && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    boxShadow: "0 1px 4px rgba(249,115,22,0.4)",
                  }}
                >
                  ✓
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700">
                {h.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HardwareSection;
