import React from "react";
import { BifoldConfig } from "../../../types/product";
import MiniBifoldVisualizer from "../visualizers/MiniBifoldVisualizer";

interface ConfigSectionProps {
  config: BifoldConfig;
  onChange: (updates: Partial<BifoldConfig>) => void;
}

const ConfigurationSection: React.FC<ConfigSectionProps> = ({
  config,
  onChange,
}) => {
  const panels = config.panels;

  const getOptions = () => {
    const opts = [];
    for (let i = panels; i >= 0; i--) {
      const left = i;
      const right = panels - i;
      opts.push({
        label: `${left} + ${right}`,
        id: `${left}+${right}`,
        left,
        right,
        hasAsset: false,
      });
    }
    return opts;
  };

  const options = getOptions();

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {options.map((opt) => {
          const isSelected = config.configuration === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange({ configuration: opt.id })}
              className="rounded-xl p-2.5 flex flex-col items-center justify-center transition-all duration-200 group"
              style={{
                border: isSelected ? "2px solid #f97316" : "1px solid #e2e8f0",
                background: isSelected ? "rgba(249,115,22,0.04)" : "#ffffff",
                boxShadow: isSelected
                  ? "0 2px 8px rgba(249,115,22,0.15)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div className="relative w-full h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <MiniBifoldVisualizer left={opt.left} right={opt.right} />
              </div>
              <span
                className="text-[11px] font-bold mt-1.5"
                style={{
                  color: isSelected ? "#ea580c" : "#475569",
                }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigurationSection;
