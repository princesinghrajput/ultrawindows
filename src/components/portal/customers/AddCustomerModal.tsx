"use client";

import { useState } from "react";
import { X, Save, Building2, User, Phone, Mail, MapPin, Calculator, Settings } from "lucide-react";
import FormInput from "@/components/portal/FormInput";
import GlassPricesModal from "./GlassPricesModal";
import PriceOverridesModal from "./PriceOverridesModal";

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export default function AddCustomerModal({
    isOpen,
    onClose,
    onSave,
}: AddCustomerModalProps) {
    const [activeTab, setActiveTab] = useState<"details" | "pricing">("details");
    const [loading, setLoading] = useState(false);

    // Basic Details
    const [formData, setFormData] = useState({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        postcode: "",
    });

    // Pricing Details
    const [pricingData, setPricingData] = useState({
        pricingType: "Trade",
        markups: {
            allProducts: 0,
            aluminium: 0,
            roofProducts: 0,
            glass: 0,
        },
    });

    const [customGlassPrices, setCustomGlassPrices] = useState<{ name: string; price: number }[]>([]);
    const [priceOverrides, setPriceOverrides] = useState<{ key: string; value: number }[]>([]);

    // Sub-modals state
    const [showGlassModal, setShowGlassModal] = useState(false);
    const [showOverridesModal, setShowOverridesModal] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                ...pricingData,
                customGlassPrices,
                priceOverrides,
            };
            await onSave(payload);
            onClose();
        } catch (error) {
            console.error("Failed to save customer", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 h-[85vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Create Customer</h2>
                            <p className="text-sm text-slate-500">Add a new customer profile</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-2 bg-slate-50 border-b border-slate-100">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "details"
                                    ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                        >
                            <Building2 className="w-4 h-4" />
                            Company Details
                        </button>
                        <button
                            onClick={() => setActiveTab("pricing")}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "pricing"
                                    ? "bg-white text-orange-600 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                }`}
                        >
                            <Calculator className="w-4 h-4" />
                            Pricing & Markups
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === "details" ? (
                            <div className="space-y-4">
                                <FormInput
                                    label="Company Name"
                                    icon={<Building2 className="w-4 h-4" />}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Acme Windows Ltd"
                                />
                                <FormInput
                                    label="Contact Name"
                                    icon={<User className="w-4 h-4" />}
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    placeholder="John Smith"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        label="Phone"
                                        icon={<Phone className="w-4 h-4" />}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+44 7700 900000"
                                    />
                                    <FormInput
                                        label="Email"
                                        icon={<Mail className="w-4 h-4" />}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="info@acme.com"
                                    />
                                </div>
                                <FormInput
                                    label="Address"
                                    icon={<MapPin className="w-4 h-4" />}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 High Street"
                                />
                                <FormInput
                                    label="Postcode"
                                    icon={<MapPin className="w-4 h-4" />}
                                    value={formData.postcode}
                                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                    placeholder="SW1A 1AA"
                                />
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* Pricing Type */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Pricing Type</label>
                                    <select
                                        value={pricingData.pricingType}
                                        onChange={(e) => setPricingData({ ...pricingData, pricingType: e.target.value })}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="Trade">Trade</option>
                                        <option value="Partner">Partner</option>
                                        <option value="Retailer">Retailer</option>
                                    </select>
                                </div>

                                {/* Markups */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Markups</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            label="All Products Markup %"
                                            type="number"
                                            value={pricingData.markups.allProducts}
                                            onChange={(e) => setPricingData({
                                                ...pricingData,
                                                markups: { ...pricingData.markups, allProducts: Number(e.target.value) }
                                            })}
                                        />
                                        <FormInput
                                            label="Aluminium Markup %"
                                            type="number"
                                            value={pricingData.markups.aluminium}
                                            onChange={(e) => setPricingData({
                                                ...pricingData,
                                                markups: { ...pricingData.markups, aluminium: Number(e.target.value) }
                                            })}
                                        />
                                        <FormInput
                                            label="Roof Products Markup %"
                                            type="number"
                                            value={pricingData.markups.roofProducts}
                                            onChange={(e) => setPricingData({
                                                ...pricingData,
                                                markups: { ...pricingData.markups, roofProducts: Number(e.target.value) }
                                            })}
                                        />
                                        <FormInput
                                            label="Glass Markup %"
                                            type="number"
                                            value={pricingData.markups.glass}
                                            onChange={(e) => setPricingData({
                                                ...pricingData,
                                                markups: { ...pricingData.markups, glass: Number(e.target.value) }
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Advanced Config Buttons */}
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">Advanced Configuration</h4>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-medium text-slate-700 text-sm">Custom Glass Prices</p>
                                            <p className="text-xs text-slate-500">{customGlassPrices.length} configured</p>
                                        </div>
                                        <button
                                            onClick={() => setShowGlassModal(true)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                                        >
                                            Configure
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <p className="font-medium text-slate-700 text-sm">Price Overrides</p>
                                            <p className="text-xs text-slate-500">{priceOverrides.length} configured</p>
                                        </div>
                                        <button
                                            onClick={() => setShowOverridesModal(true)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Customer
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <GlassPricesModal
                isOpen={showGlassModal}
                onClose={() => setShowGlassModal(false)}
                initialPrices={customGlassPrices}
                onSave={setCustomGlassPrices}
            />

            <PriceOverridesModal
                isOpen={showOverridesModal}
                onClose={() => setShowOverridesModal(false)}
                initialOverrides={priceOverrides}
                onSave={setPriceOverrides}
            />
        </>
    );
}
