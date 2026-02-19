import React from "react";
import { MapPin } from "lucide-react";
import { ProductType, ProductConfig } from "../../../types/product";
import { ValidationResult } from "../../../utils/validation";
import SectionCard from "./SectionCard";
import SidelightModal from "./SidelightModal";

interface DimensionsSectionProps {
    config: ProductConfig;
    onUpdate: (updates: Partial<ProductConfig>) => void;
    validation: ValidationResult;
    isSidelightModalOpen: boolean;
    onOpenSidelightModal: () => void;
    onCloseSidelightModal: () => void;
}

export default function DimensionsSection({
    config,
    onUpdate,
    validation,
    isSidelightModalOpen,
    onOpenSidelightModal,
    onCloseSidelightModal,
}: DimensionsSectionProps) {
    return (
        <SectionCard title="Dimensions">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Overall Width
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={config.width}
                            onChange={(e) =>
                                onUpdate({ width: Number(e.target.value) })
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-12 text-sm font-medium text-slate-800 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                            mm
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Overall Height
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={config.height}
                            onChange={(e) =>
                                onUpdate({ height: Number(e.target.value) })
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-12 text-sm font-medium text-slate-800 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-colors"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                            mm
                        </span>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="mt-4">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Location
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={(config as any).location || ""}
                        onChange={(e) =>
                            onUpdate({ location: e.target.value } as any)
                        }
                        placeholder="e.g. Kitchen, Living Room"
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-600 placeholder:text-slate-300 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* Sidelights button for French Door & Single Door */}
            {(config.type === ProductType.FrenchDoor ||
                config.type === ProductType.SingleDoor) && (
                    <div className="mt-4">
                        <button
                            onClick={onOpenSidelightModal}
                            className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg shadow-sm hover:bg-orange-600 transition-colors text-sm font-medium"
                        >
                            Edit Sidelights
                        </button>
                        <SidelightModal
                            isOpen={isSidelightModalOpen}
                            onClose={onCloseSidelightModal}
                            config={config as any}
                            onChange={onUpdate as any}
                        />
                    </div>
                )}

            {/* Validation */}
            {!validation.isValid && (
                <div className="mt-3 text-red-600 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="flex-shrink-0">⚠</span>
                    {validation.message}
                </div>
            )}
        </SectionCard>
    );
}
