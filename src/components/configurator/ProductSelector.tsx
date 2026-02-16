
import React from 'react';
import { ProductType } from '../../types/product';
import {
    LayoutGrid,
    DoorOpen,
    Square,
    Columns,
    Maximize,
    Grid3X3,
} from 'lucide-react';

interface ProductSelectorProps {
    onSelect: (type: ProductType) => void;
}

interface ProductOption {
    type: ProductType;
    label: string;
    description: string;
    icon: React.ElementType;
}

const products: ProductOption[] = [
    {
        type: ProductType.Bifold,
        label: 'Aluminium Bifold',
        description: 'Fold your doors away to create a seamless transition to the outdoors.',
        icon: LayoutGrid,
    },
    {
        type: ProductType.FrenchDoor,
        label: 'French Door',
        description: 'Classic double doors perfect for smaller openings.',
        icon: DoorOpen,
    },
    {
        type: ProductType.Slider,
        label: 'Sliding Patio Door',
        description: 'Large glass panes for maximum light and views.',
        icon: Columns,
    },
    {
        type: ProductType.Window,
        label: 'Aluminium Window',
        description: 'Casement, tilt & turn, and fixed frames.',
        icon: Square,
    },
    {
        type: ProductType.Rooflight,
        label: 'Rooflight / Lantern',
        description: 'Add light from above with our roof solutions.',
        icon: Maximize, // Just a placeholder icon
    },
    {
        type: ProductType.Shaped,
        label: 'Shaped Frame',
        description: 'Gables and custom shapes.',
        icon: Grid3X3,
    }
];

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <button
                    key={product.type}
                    onClick={() => onSelect(product.type)}
                    className="group flex flex-col text-left bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                        <product.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.label}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                </button>
            ))}
        </div>
    );
};

export default ProductSelector;
