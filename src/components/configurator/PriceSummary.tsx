'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PoundSterling } from 'lucide-react';
import { PriceBreakdown } from '../../utils/pricing';

interface PriceSummaryProps {
    breakdown: PriceBreakdown;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ breakdown }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            {/* Collapsed bar — always visible */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between py-3 group cursor-pointer"
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-orange-50 flex items-center justify-center">
                        <PoundSterling className="w-3.5 h-3.5 text-orange-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Estimated Price</span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">({breakdown.lineItems.length} items)</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-slate-900">
                        £{breakdown.total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {expanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    )}
                </div>
            </button>

            {/* Expanded breakdown — slides up */}
            {expanded && (
                <div className="pb-3 border-t border-slate-100 pt-3 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                        {breakdown.lineItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm py-0.5">
                                <span className="text-slate-500 truncate mr-4">{item.label}</span>
                                <span className="font-medium text-slate-700 tabular-nums whitespace-nowrap">
                                    £{item.total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400">
                        Prices excl. VAT. Final price confirmed at order stage.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PriceSummary;
