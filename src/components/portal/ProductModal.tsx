"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search } from "lucide-react";
import clsx from "clsx";

const products = [
    { id: "bifold", name: "Aluminium Bifold", image: "/images/bifold.webp" },
    { id: "french", name: "Aluminium French Door", image: "/images/french.webp" },
    { id: "single", name: "Aluminium Single Door", image: "/images/single.webp" },
    { id: "patio", name: "Ultra Patio 47mm Interlock", image: "/images/patio.webp" },
    { id: "cortizo-patio", name: "Cortizo Patio Door", image: "/images/cortizo_patio.webp" },
    { id: "window", name: "Aluminium Window", image: "/images/window.webp" },
    { id: "shaped", name: "Aluminium Shaped Frame", image: "/images/shaped.webp" },
    { id: "fixed", name: "Aluminium Fixed Frame", image: "/images/fixed.webp" },
    { id: "bay", name: "Aluminium Bay Window", image: "/images/bay.webp" },
    { id: "rooflight", name: "Aluna+ Rooflight", image: "/images/rooflight_grey.webp" },
    { id: "lantern", name: "Roof Lantern", image: "/images/lantern.webp" },
];

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: { id: string; name: string; image: string }) => void;
}

export default function ProductModal({
    isOpen,
    onClose,
    onSelect,
}: ProductModalProps) {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (product: typeof products[0]) => {
        setSelectedId(product.id);
        onSelect(product);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-heading font-bold text-slate-900">
                            Choose a Product
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Select a product to create a new quote
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleSelect(product)}
                                className={clsx(
                                    "group relative bg-white border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50",
                                    selectedId === product.id
                                        ? "border-orange-500 ring-2 ring-orange-500/20"
                                        : "border-slate-200 hover:border-orange-300"
                                )}
                            >
                                {/* Image */}
                                <div className="aspect-square relative bg-slate-50 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>

                                {/* Label */}
                                <div className="p-3 text-left">
                                    <p className="text-sm font-medium text-slate-900 line-clamp-2 leading-tight">
                                        {product.name}
                                    </p>
                                </div>

                                {/* Selected Indicator */}
                                {selectedId === product.id && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500">
                                No products found matching &quot;{search}&quot;
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
