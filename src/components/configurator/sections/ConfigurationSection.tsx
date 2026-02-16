import React from 'react';
import { BifoldConfig } from '../../types/product';
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
                hasAsset: (panels === 3)
            });
        }
        return opts;
    };

    const options = getOptions();

    return (
        <div>
            <h3 className="text-lg font-bold mb-4 text-center">Configuration</h3>
            <div className="grid grid-cols-4 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange({ configuration: opt.id })}
                        className={`
                        border-2 rounded-xl p-2 flex flex-col items-center justify-between transition-all aspect-square
                        ${config.configuration === opt.id
                                ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200'
                                : 'border-gray-100 hover:border-gray-200 bg-white'}
                    `}
                    >
                        <div className="relative w-full h-12 mb-2 flex items-center justify-center">
                            {opt.hasAsset ? (
                                <img
                                    src={`/images/aluminium_bifolf/i${opt.id}.svg`}
                                    alt={opt.label}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                // Fallback to procedural mini-visualizer for 4, 5+ panels
                                <MiniBifoldVisualizer left={opt.left} right={opt.right} />
                            )}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ConfigurationSection;
