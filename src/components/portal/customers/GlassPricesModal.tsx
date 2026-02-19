"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface GlassPricesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPrices: { name: string; price: number }[];
    onSave: (prices: { name: string; price: number }[]) => void;
}

const GLASS_TYPES = [
    "Clear",
    "Obscure",
    "Laminated",
    "Tough",
    "Acoustic",
    "Low E",
];

export default function GlassPricesModal({
    isOpen,
    onClose,
    initialPrices,
    onSave,
}: GlassPricesModalProps) {
    const [prices, setPrices] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            const priceMap: Record<string, string> = {};
            initialPrices.forEach((p) => {
                priceMap[p.name] = p.price.toString();
            });
            setPrices(priceMap);
        }
    }, [isOpen, initialPrices]);

    if (!isOpen) return null;

    const handleSave = () => {
        const result = Object.entries(prices)
            .filter(([_, value]) => value !== "")
            .map(([name, value]) => ({
                name,
                price: parseFloat(value),
            }));
        onSave(result);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Custom Glass Pricing</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">
                        Set your own square metre prices for glass. Leave blank to use the default portal pricing.
                    </p>
                    <div className="space-y-3">
                        {GLASS_TYPES.map((type) => (
                            <div key={type} className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">
                                    {type}
                                </label>
                                <div className="relative w-32">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Default"
                                        value={prices[type] || ""}
                                        onChange={(e) =>
                                            setPrices({ ...prices, [type]: e.target.value })
                                        }
                                        className="w-full pl-7 pr-3 py-1.5 text-right bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" />
                        Save Prices
                    </button>
                </div>
            </div>
        </div>
    );
}
