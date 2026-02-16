
import React from 'react';
import { BifoldConfig } from '../../types/product';

interface ColourSectionProps {
    config: BifoldConfig;
    onChange: (updates: Partial<BifoldConfig>) => void;
}

const colors = [
    { name: 'White', value: 'white', img: 'white.jpg' },
    { name: 'Black', value: 'black', img: 'black.jpg' },
    { name: 'Grey', value: 'grey', img: 'grey.jpg' },
    { name: 'Anthracite', value: '#333333', hex: '#333333' }, // Fallback if no image
];

const ColourSection: React.FC<ColourSectionProps> = ({ config, onChange }) => {
    return (
        <div className="space-y-6">
            {/* Outside Colour */}
            <div>
                <h3 className="text-lg font-bold mb-4 text-center">Outside Frame Colour</h3>
                <div className="flex justify-center flex-wrap gap-4">
                    {colors.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => onChange({ outsideColor: c.value, color: c.value })}
                            className={`
                            group relative w-24 flex flex-col items-center gap-2 p-1 rounded-lg border-2 transition-all
                            ${config.outsideColor === c.value ? 'border-sky-300 bg-sky-50' : 'border-transparent hover:border-gray-200'}
                        `}
                        >
                            <div className="w-20 h-12 rounded border border-gray-200 overflow-hidden shadow-sm">
                                {c.img ? (
                                    <img src={`/images/aluminium_bifolf/${c.img}`} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div style={{ backgroundColor: c.hex }} className="w-full h-full" />
                                )}
                            </div>
                            <span className="text-xs font-medium text-gray-700">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Inside Colour */}
            <div>
                <h3 className="text-lg font-bold mb-4 text-center">Inside Frame Colour</h3>
                <div className="flex justify-center flex-wrap gap-4">
                    {colors.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => onChange({ insideColor: c.value })}
                            className={`
                            group relative w-24 flex flex-col items-center gap-2 p-1 rounded-lg border-2 transition-all
                            ${config.insideColor === c.value ? 'border-sky-300 bg-sky-50' : 'border-transparent hover:border-gray-200'}
                        `}
                        >
                            <div className="w-20 h-12 rounded border border-gray-200 overflow-hidden shadow-sm">
                                {c.img ? (
                                    <img src={`/images/aluminium_bifolf/${c.img}`} alt={c.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div style={{ backgroundColor: c.hex }} className="w-full h-full" />
                                )}
                            </div>
                            <span className="text-xs font-medium text-gray-700">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColourSection;
