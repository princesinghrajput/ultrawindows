import React from "react";
import { BifoldConfig } from "../../../types/product";

interface CillSectionProps {
  config: BifoldConfig;
  onChange: (updates: Partial<BifoldConfig>) => void;
}

const cills = [
  { name: "No Cill", value: "none", img: null },
  { name: "85mm", value: "85mm", img: "cill_90.png" },
  { name: "150mm", value: "150mm", img: "cill_150.png" },
  { name: "190mm", value: "190mm", img: "cill_190.png" },
  { name: "225mm", value: "225mm", img: "cill_230.png" },
];

const CillSection: React.FC<CillSectionProps> = ({ config, onChange }) => {
  return (
    <div>
      <h3 className="text-sm font-bold mb-4 text-center text-slate-700 uppercase tracking-wide">
        Cill
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {cills.map((c) => {
          const isSelected = config.cill === c.value;
          return (
            <button
              key={c.value}
              onClick={() => onChange({ cill: c.value as any })}
              className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 justify-between group"
              style={{
                height: 120,
                border: isSelected ? "2px solid #f97316" : "1px solid #e2e8f0",
                background: isSelected
                  ? "linear-gradient(180deg, rgba(249,115,22,0.06), rgba(249,115,22,0.02))"
                  : "#ffffff",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(249,115,22,0.15)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex-1 flex items-center justify-center w-full transition-transform duration-200 group-hover:scale-105">
                {c.img ? (
                  <img
                    src={`/images/aluminium_bifolf/${c.img}`}
                    alt={c.name}
                    className="max-w-full max-h-14 object-contain"
                  />
                ) : (
                  <div className="text-slate-300 text-2xl">✕</div>
                )}
              </div>
              <span
                className="text-xs font-semibold mt-2"
                style={{
                  color: isSelected ? "#ea580c" : "#475569",
                }}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CillSection;
