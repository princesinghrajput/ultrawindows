import React from 'react';
import { BifoldConfig } from '../../../types/product';
import MiniBifoldVisualizer from '../visualizers/MiniBifoldVisualizer';

interface ConfigSectionProps {
    config: BifoldConfig;
    onChange: (updates: Partial<BifoldConfig>) => void;
}

const ConfigurationSection: React.FC<ConfigSectionProps> = ({ config, onChange }) => {
    const panels = config.panels;

    // Helper to generate options based on panel count
    const getOptions = () => {
        const opts = [];
        // Generate all combinations: i left, (total-i) right
        // e.g. 3 panels -> 3+0, 2+1, 1+2, 0+3
        for (let i = panels; i >= 0; i--) {
            const left = i;
            const right = panels - i;
            opts.push({
                label: `${left} + ${right}`,
                id: `${left}+${right}`,
                left,
                right,
                // Check if we have an asset for this specific combo (mostly 3 panels)
                hasAsset: false
            });
        }
        return opts;
    };

    const options = getOptions();

    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange({ configuration: opt.id })}
                        className={`
                        border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all
                        ${config.configuration === opt.id
                                ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-300'
                                : 'border-gray-100 hover:border-gray-200 bg-white'}
                    `}
                    >
                        <div className="relative w-full h-10 flex items-center justify-center">
                            <MiniBifoldVisualizer left={opt.left} right={opt.right} />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-600 mt-1">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ConfigurationSection;
