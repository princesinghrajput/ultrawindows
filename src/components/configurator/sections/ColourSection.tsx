import React from "react";
import { BifoldConfig } from "../../../types/product";

interface ColourSectionProps {
  config: BifoldConfig;
  onChange: (updates: Partial<BifoldConfig>) => void;
}

const colors = [
  { name: "White", value: "white", img: "white.jpg" },
  { name: "Black", value: "black", img: "black.jpg" },
  { name: "Grey", value: "grey", img: "grey.jpg" },
  { name: "Anthracite", value: "#333333", hex: "#333333" },
];

const ColourSection: React.FC<ColourSectionProps> = ({ config, onChange }) => {
  const renderSwatches = (
    selectedValue: string | undefined,
    onSelect: (value: string) => void,
  ) => (
    <div className="flex justify-center flex-wrap gap-3">
      {colors.map((c) => {
        const isSelected = selectedValue === c.value;
        return (
          <button
            key={c.value}
            onClick={() => onSelect(c.value)}
            className="group relative flex flex-col items-center gap-2 p-1.5 rounded-xl transition-all duration-200"
            style={{
              width: 96,
              outline: isSelected
                ? "2px solid #f97316"
                : "2px solid transparent",
              outlineOffset: 2,
              background: isSelected ? "rgba(249,115,22,0.06)" : "transparent",
            }}
          >
            <div
              className="w-20 h-14 rounded-lg overflow-hidden transition-transform duration-200 group-hover:scale-105"
              style={{
                border: "1px solid #e2e8f0",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(249,115,22,0.2)"
                  : "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {c.img ? (
                <img
                  src={`/images/aluminium_bifolf/${c.img}`}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  style={{ backgroundColor: c.hex }}
                  className="w-full h-full"
                />
              )}
            </div>
            {/* Selected check */}
            {isSelected && (
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  boxShadow: "0 1px 4px rgba(249,115,22,0.4)",
                }}
              >
                ✓
              </div>
            )}
            <span className="text-xs font-semibold text-slate-700">
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Outside Colour */}
      <div>
        <h3 className="text-sm font-bold mb-4 text-center text-slate-700 uppercase tracking-wide">
          Outside Frame Colour
        </h3>
        {renderSwatches(config.outsideColor, (v) =>
          onChange({ outsideColor: v, color: v }),
        )}
      </div>

      <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

      {/* Inside Colour */}
      <div>
        <h3 className="text-sm font-bold mb-4 text-center text-slate-700 uppercase tracking-wide">
          Inside Frame Colour
        </h3>
        {renderSwatches(config.insideColor, (v) =>
          onChange({ insideColor: v }),
        )}
      </div>
    </div>
  );
};

export default ColourSection;
