'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { PriceBreakdown } from '../../utils/pricing';

interface PriceSummaryProps {
  breakdown: PriceBreakdown;
  actions?: React.ReactNode;
}

const GBP_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatCurrency = (value?: number) => GBP_FORMATTER.format(typeof value === 'number' ? value : 0);

const PriceSummary: React.FC<PriceSummaryProps> = ({ breakdown, actions }) => {
  const [expanded, setExpanded] = useState(false);
  const taxValue = Math.max(breakdown.total - breakdown.subtotal, 0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full relative flex items-center justify-between" ref={containerRef}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full">
        {/* Estimated Price Main */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estimated Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                {formatCurrency(breakdown.total)}
              </span>
              <span className="text-xs font-medium text-slate-400">inc. VAT</span>
            </div>
          </div>
        </div>

        {/* Breakdown Summary (Hidden on very small screens) */}
        <div className="hidden md:flex items-center gap-6 border-l border-slate-200 pl-6">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Net</span>
            <span className="text-sm font-semibold text-slate-700 tabular-nums">{formatCurrency(breakdown.subtotal)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Tax</span>
            <span className="text-sm font-semibold text-slate-700 tabular-nums">{formatCurrency(taxValue)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">Items</span>
            <span className="text-sm font-semibold text-slate-700 tabular-nums">{breakdown.lineItems.length}</span>
          </div>
        </div>

        {/* Toggle detailed breakdown */}
        <div className="flex items-center mt-2 sm:mt-0 md:ml-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${expanded
                ? 'bg-orange-100 text-orange-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{expanded ? 'Hide Details' : 'View Details'}</span>
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 ml-4">
          {actions}
        </div>
      )}

      {/* Popover for Detailed Breakdown */}
      {expanded && (
        <div className="absolute bottom-full left-0 sm:left-auto sm:right-0 md:right-auto md:left-1/3 mb-6 w-full sm:w-[400px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 overflow-hidden z-50 transform origin-bottom animate-in fade-in slide-in-from-bottom-4">
          <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
            <h4 className="font-semibold text-slate-900">Price Breakdown</h4>
            <p className="text-xs text-slate-500 mt-0.5">Includes {breakdown.lineItems.length} cost drivers</p>
          </div>

          <div className="max-h-[50vh] overflow-y-auto px-5 py-2 hover:bg-transparent">
            <div className="divide-y divide-slate-100">
              {breakdown.lineItems.map((item, index) => (
                <div key={`${item.label}-${index}`} className="py-3 flex items-start justify-between">
                  <div className="pr-4">
                    <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 tabular-nums shrink-0">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Prices shown in GBP</span>
              <span>Excludes installation &amp; delivery</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceSummary;
