
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfiguratorLayout from '../../components/configurator/ConfiguratorLayout';
import ProductSelector from '../../components/configurator/ProductSelector';
import { ProductType, ProductConfig, BifoldConfig } from '../../types/product';
import BifoldVisualizer from '../../components/configurator/visualizers/RealisticBifoldVisualizer';
import { validateDimensions } from '../../utils/validation';
import ConfigurationSection from '../../components/configurator/sections/ConfigurationSection';
import ColourSection from '../../components/configurator/sections/ColourSection';
import CillSection from '../../components/configurator/sections/CillSection';
import HardwareSection from '../../components/configurator/sections/HardwareSection';

function ConfiguratorContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState<ProductConfig | null>(null);
    const [view, setView] = useState<'inside' | 'outside'>('outside');

    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam && step === 1) {
            // Map string param to ProductType enum if needed, or cast if values match
            // Assuming 'bifold' maps to ProductType.Bifold
            if (typeParam === 'bifold') {
                handleProductSelect(ProductType.Bifold);
            }
            // Add other mappings as needed
        }
    }, [searchParams]);

    const handleProductSelect = (type: ProductType) => {
        // Initialize default config based on type
        const baseConfig = {
            id: crypto.randomUUID(),
            width: 2400,
            height: 2100,
            color: 'white',
            outsideColor: 'white',
            insideColor: 'white',
            glass: 'clear',
            handleColor: 'chrome',
            cill: '150mm',
            threshold: 'standard',
            trickleVents: true,
            transom: false,
        };

        if (type === ProductType.Bifold) {
            setConfig({
                ...baseConfig,
                type: ProductType.Bifold,
                panels: 3,
                configuration: '3+0', // Default
                openingDirection: 'left',
                trafficDoor: true,
            } as BifoldConfig);
        } else {
            // Placeholder for other types
            setConfig({ ...baseConfig, type } as any);
        }

        setStep(2);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Helper to update config safely
    const updateConfig = (updates: Partial<ProductConfig>) => {
        if (!config) return;
        setConfig({ ...config, ...updates } as ProductConfig);
    };

    const renderContent = () => {
        switch (step) {
            case 1:
                return <ProductSelector onSelect={handleProductSelect} />;
            case 2:
                if (!config) return null;

                const validation = validateDimensions(config);

                return (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Visualizer Column (Left - Sticky) */}
                        <div className="w-full lg:w-2/3 lg:sticky lg:top-24 z-10">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {config.type === ProductType.Bifold ? (
                                    <BifoldVisualizer
                                        width={config.width}
                                        height={config.height}
                                        panels={(config as BifoldConfig).panels}
                                        openingDirection={(config as BifoldConfig).openingDirection}
                                        configuration={(config as BifoldConfig).configuration}
                                        color={view === 'outside'
                                            ? (config as BifoldConfig).outsideColor || config.color
                                            : (config as BifoldConfig).insideColor || config.color
                                        }
                                        view={view}
                                    />
                                ) : (
                                    <div className="aspect-video flex items-center justify-center text-gray-400 bg-gray-50">
                                        Visualizer for {config.type} coming soon
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setView(v => v === 'outside' ? 'inside' : 'outside')}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <span>{view === 'outside' ? 'View From Inside' : 'View From Outside'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Controls Column (Right - Scrollable) */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-10 pb-24">

                            {/* Dimensions Section */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-center">Dimensions</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Overall Width</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={config.width}
                                                onChange={(e) => updateConfig({ width: Number(e.target.value) })}
                                                className="w-full border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pr-8 text-center"
                                            />
                                            <span className="absolute right-3 top-2 text-gray-400 text-sm">mm</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Overall Height</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={config.height}
                                                onChange={(e) => updateConfig({ height: Number(e.target.value) })}
                                                className="w-full border-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 pr-8 text-center"
                                            />
                                            <span className="absolute right-3 top-2 text-gray-400 text-sm">mm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Location</label>
                                    <input type="text" className="w-full border p-2 rounded-md border-gray-200" placeholder="e.g. Kitchen" />
                                </div>
                                {!validation.isValid && (
                                    <div className="mt-2 text-red-600 text-sm text-center">
                                        {validation.message}
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Product Controls */}
                            {config.type === ProductType.Bifold && (
                                <>
                                    {/* Number of Panes */}
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-center">Number Of Panes</h2>
                                        <div className="flex justify-center flex-wrap gap-2">
                                            {[3, 4, 5].map(num => (
                                                <button
                                                    key={num}
                                                    // When panels change, reset configuration to all-left (e.g. "3+0")
                                                    onClick={() => updateConfig({ panels: num, configuration: `${num}+0`, type: ProductType.Bifold } as any)}
                                                    className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all ${(config as BifoldConfig).panels === num
                                                        ? 'bg-sky-100 text-sky-700 border-sky-300'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {num} Panes
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Configuration Diagrams */}
                                    <ConfigurationSection
                                        config={config as BifoldConfig}
                                        onChange={updateConfig}
                                    />

                                    {/* Opening Direction */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-center">Opening Direction</h3>
                                        <div className="flex justify-center gap-4">
                                            <button className="px-6 py-2 border rounded-lg bg-sky-100 border-sky-300 text-sky-800 text-sm font-medium">Open In</button>
                                            <button className="px-6 py-2 border rounded-lg bg-white border-gray-200 text-gray-600 text-sm font-medium">Open Out</button>
                                        </div>
                                    </div>

                                    {/* Colours */}
                                    <ColourSection
                                        config={config as BifoldConfig}
                                        onChange={updateConfig}
                                    />

                                    {/* Cills */}
                                    <CillSection
                                        config={config as BifoldConfig}
                                        onChange={updateConfig}
                                    />

                                    {/* Threshold */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-center">Threshold</h3>
                                        <div className="flex justify-center gap-4">
                                            {/* Standard */}
                                            <button className="flex flex-col items-center p-2 border rounded-lg bg-sky-50 border-sky-300 w-32">
                                                <div className="h-12 w-full mb-2 relative">
                                                    <img src="/images/aluminium_bifolf/standard.png" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xs font-semibold">Standard 55mm</span>
                                            </button>
                                            {/* Low */}
                                            <button className="flex flex-col items-center p-2 border rounded-lg bg-white border-gray-200 w-32">
                                                <div className="h-12 w-full mb-2 relative">
                                                    <img src="/images/aluminium_bifolf/low.png" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xs font-semibold">Low 20mm</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Addons */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-center">Addons</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Trickle Vents</span>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1 border rounded bg-white">No</button>
                                                    <button className="px-3 py-1 border rounded bg-orange-400 text-white border-orange-500">Yes</button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 text-right">4000mm Trickle Vent</div>
                                        </div>
                                    </div>

                                    {/* Hardware */}
                                    <HardwareSection
                                        config={config as BifoldConfig}
                                        onChange={updateConfig}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                );
            default:
                return null; // Quote summary step
        }
    };

    return (
        <ConfiguratorLayout
            title={step === 1 ? 'Select a Product' : 'Configure Product'}
            step={step}
            totalSteps={3}
            onBack={step > 1 ? handleBack : undefined}
        >
            {renderContent()}
        </ConfiguratorLayout>
    );
}

export default function ConfiguratorPage() {
    return (
        <React.Suspense fallback={<div className="flex h-[50vh] items-center justify-center">Loading configurator...</div>}>
            <ConfiguratorContent />
        </React.Suspense>
    );
}
