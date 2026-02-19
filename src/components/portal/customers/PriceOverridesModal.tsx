"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";

interface PriceOverridesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialOverrides: { key: string; value: number }[];
    onSave: (overrides: { key: string; value: number }[]) => void;
}

export default function PriceOverridesModal({
    isOpen,
    onClose,
    initialOverrides,
    onSave,
}: PriceOverridesModalProps) {
    const [overrides, setOverrides] = useState<{ key: string; value: string }[]>(
        []
    );
    const [newKey, setNewKey] = useState("");

    useEffect(() => {
        if (isOpen) {
            setOverrides(
                initialOverrides.map((o) => ({ key: o.key, value: o.value.toString() }))
            );
        }
    }, [isOpen, initialOverrides]);

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newKey && !overrides.find((o) => o.key === newKey)) {
            setOverrides([...overrides, { key: newKey, value: "" }]);
            setNewKey("");
        }
    };

    const handleRemove = (key: string) => {
        setOverrides(overrides.filter((o) => o.key !== key));
    };

    const handleChange = (key: string, val: string) => {
        setOverrides(
            overrides.map((o) => (o.key === key ? { ...o, value: val } : o))
        );
    };

    const handleSave = () => {
        const result = overrides
            .filter((o) => o.value !== "")
            .map((o) => ({ key: o.key, value: parseFloat(o.value) }));
        onSave(result);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Price Overrides</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-500">
                        Set custom prices by entering a key and value. Leave blank to remove
                        an override.
                    </p>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter item key (e.g. handle_gold)"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newKey}
                            className="px-3 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 border-t border-slate-100 pt-4">
                        {overrides.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">
                                No overrides configured
                            </p>
                        ) : (
                            overrides.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between gap-3 p-2 hover:bg-slate-50 rounded-lg group"
                                >
                                    <span className="text-sm font-medium text-slate-700 truncate flex-1">
                                        {item.key}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-24">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">£</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={item.value}
                                                onChange={(e) => handleChange(item.key, e.target.value)}
                                                className="w-full pl-5 pr-2 py-1 text-right text-sm border border-slate-200 rounded focus:outline-none focus:border-orange-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.key)}
                                            className="p-1 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
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
                        Save Overrides
                    </button>
                </div>
            </div>
        </div>
    );
}
