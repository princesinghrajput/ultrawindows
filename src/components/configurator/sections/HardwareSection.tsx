
import React from 'react';
import { BifoldConfig } from '../../../types/product';

interface HardwareSectionProps {
    config: BifoldConfig;
    onChange: (updates: Partial<BifoldConfig>) => void;
}

const handles = [
    { name: 'White', value: 'white', img: 'white.jpg' }, // Assuming handles use same style images roughly
    { name: 'Black', value: 'black', img: 'black.jpg' }, // Placeholder - check assets if dedicated handle images exist
    { name: 'Chrome', value: 'chrome', img: 'chrome.jpg' },
    { name: 'Gold', value: 'gold', img: 'gold.png' },
    { name: 'Satin', value: 'satin', img: 'satin.jpg' },
    { name: 'Stainless', value: 'stainless', img: 'coastal_stainless_steel.jpg' },
];

const HardwareSection: React.FC<HardwareSectionProps> = ({ config, onChange }) => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4 text-center">Hardware Colour</h3>
            <div className="grid grid-cols-3 gap-4">
                {handles.map((h) => (
                    <button
                        key={h.value}
                        onClick={() => onChange({ handleColor: h.value })}
                        className={`
                        flex flex-col items-center p-3 rounded-xl border transition-all
                        ${config.handleColor === h.value
                                ? 'border-sky-400 bg-sky-50 shadow-sm'
                                : 'border-gray-200 hover:border-gray-300 bg-white'}
                    `}
                    >
                        <div className="h-16 w-16 mb-3 relative flex items-center justify-center">
                            {/* 
                            Note: The user's screenshot shows tall handle images.
                            We'll use object-contain to fit them nicely.
                        */}
                            <img
                                src={`/images/aluminium_bifolf/${h.img}`}
                                alt={h.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{h.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HardwareSection;
