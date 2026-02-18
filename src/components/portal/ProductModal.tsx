"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Search } from "lucide-react";
import clsx from "clsx";

const products = [
  {
    id: "bifold",
    name: "Aluminium Bifold",
    image: "/images/bifold.webp",
    category: "doors",
  },
  {
    id: "french_door",
    name: "Aluminium French Door",
    image: "/images/french.webp",
    category: "doors",
  },
  {
    id: "single",
    name: "Aluminium Single Door",
    image: "/images/single.webp",
    category: "doors",
  },
  {
    id: "aluminium-slider",
    name: "Aluminium Slider 25mm Interlock",
    image: "/images/cortizo_patio.webp",
    category: "doors",
  },
  {
    id: "patio",
    name: "Ultra Patio 47mm Interlock",
    image: "/images/patio.webp",
    category: "doors",
  },
  {
    id: "window",
    name: "Aluminium Window",
    image: "/images/window.webp",
    category: "windows",
  },
  {
    id: "shaped",
    name: "Aluminium Shaped Frame",
    image: "/images/shaped.webp",
    category: "windows",
  },
  {
    id: "fixed",
    name: "Aluminium Fixed Frame",
    image: "/images/fixed.webp",
    category: "windows",
  },
  {
    id: "bay",
    name: "Aluminium Bay Window",
    image: "/images/bay.webp",
    category: "windows",
  },
  {
    id: "rooflight",
    name: "Aluna+ Rooflight",
    image: "/images/rooflight_grey.webp",
    category: "rooflights",
  },
  {
    id: "lantern",
    name: "Roof Lantern",
    image: "/images/lantern.webp",
    category: "rooflights",
  },
];

const categories = [
  { id: "all", label: "All Products" },
  { id: "doors", label: "Doors" },
  { id: "windows", label: "Windows" },
  { id: "rooflights", label: "Rooflights" },
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
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setActiveCategory("all");
    }
  }, [isOpen]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (product: (typeof products)[0]) => {
    onSelect(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Choose a Product
            </h2>
            <p className="text-sm text-slate-500">
              Select a product to start building your quote
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
              autoFocus
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="group bg-white border border-slate-200 rounded-lg overflow-hidden text-left hover:border-orange-400 transition-colors"
              >
                <div className="aspect-square relative bg-slate-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium text-slate-900 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">
                    {product.category}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No products found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <p className="text-sm text-slate-500">
            {filteredProducts.length} products available
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
