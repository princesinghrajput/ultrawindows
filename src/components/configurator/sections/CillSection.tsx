
import React from 'react';
import { BifoldConfig } from '../../../types/product';

interface CillSectionProps {
    config: BifoldConfig;
    onChange: (updates: Partial<BifoldConfig>) => void;
}

const cills = [
    { name: 'No Cill', value: 'none', img: null },
    { name: '85mm', value: '85mm', img: 'cill_90.png' }, // Closest match in assets
    { name: '150mm', value: '150mm', img: 'cill_150.png' },
    { name: '190mm', value: '190mm', img: 'cill_190.png' },
    { name: '225mm', value: '225mm', img: 'cill_230.png' },
];

const CillSection: React.FC<CillSectionProps> = ({ config, onChange }) => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4 text-center">Cill</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {cills.map((c) => (
                    <button
                        key={c.value}
                        onClick={() => onChange({ cill: c.value as any })}
                        className={`
                        flex flex-col items-center p-2 rounded-lg border transition-all h-28 justify-between
                        ${config.cill === c.value
                              ? "bg-orange-50 border-orange-300 ring-1 ring-orange-200"
                              : "bg-white border-slate-200 hover:border-slate-300"}
                    `}
                    >
                        <div className="flex-1 flex items-center justify-center w-full">
                            {c.img ? (
                                <img src={`/images/aluminium_bifolf/${c.img}`} alt={c.name} className="max-w-full max-h-12 object-contain" />
                            ) : (
                                <div className="text-gray-400 text-2xl">✕</div>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-600 mt-2">{c.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CillSection;
