import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DoorConfig } from '../../../types/product';

interface SidelightModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: DoorConfig;
    onChange: (updates: Partial<DoorConfig>) => void;
}

const SidelightModal: React.FC<SidelightModalProps> = ({ isOpen, onClose, config, onChange }) => {
    if (!isOpen) return null;

    // Helper to toggle a sidelight
    const toggleSidelight = (side: 'left' | 'right' | 'top') => {
        const newSidelights = { ...config.sidelights };
        if (side === 'left') {
            newSidelights.left = { ...newSidelights.left, enabled: !newSidelights.left.enabled };
            // Use default width if enabling
            if (newSidelights.left.enabled && newSidelights.left.width === 0) newSidelights.left.width = 400;
        } else if (side === 'right') {
            newSidelights.right = { ...newSidelights.right, enabled: !newSidelights.right.enabled };
            if (newSidelights.right.enabled && newSidelights.right.width === 0) newSidelights.right.width = 400;
        } else if (side === 'top') {
            newSidelights.top = { ...newSidelights.top, enabled: !newSidelights.top.enabled };
            if (newSidelights.top.enabled && newSidelights.top.height === 0) newSidelights.top.height = 400;
        }
        onChange({ sidelights: newSidelights });
    };

    const updateWidth = (side: 'left' | 'right', width: number) => {
        const newSidelights = { ...config.sidelights };
        newSidelights[side] = { ...newSidelights[side], width: width };
        onChange({ sidelights: newSidelights });
    };

    const toggleFlag = (side: 'left' | 'right') => {
        // "Flag Window" usually implies a specific transom or panel style.
        // For visualizer simplicity, we might just toggle a 'transom' property if that's what it means visually
        // Or it could mean full height?
        // In the screenshot "Flag Window" is a checkbox. 
        // Let's assume it maps to our `transom` boolean in sidelight config for now
        const newSidelights = { ...config.sidelights };
        newSidelights[side] = { ...newSidelights[side], transom: !newSidelights[side].transom };
        onChange({ sidelights: newSidelights });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                {/* Left: Controls */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">Edit Sidelights</h2>
                        {/* Mobile close button if needed, but main close is bottom */}
                    </div>

                    <div className="space-y-6">
                        {/* Left Sidelight */}
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.sidelights.left.enabled}
                                    onChange={() => toggleSidelight('left')}
                                    className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                />
                                <span className="text-gray-700 font-medium">Left Sidelight</span>
                            </label>

                            {config.sidelights.left.enabled && (
                                <div className="ml-8 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-500">Width</span>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={config.sidelights.left.width}
                                                onChange={(e) => updateWidth('left', parseInt(e.target.value) || 0)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
                                            />
                                            <span className="absolute right-3 top-2 text-gray-400 text-sm">mm</span>
                                        </div>
                                    </div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={config.sidelights.left.transom || false}
                                            onChange={() => toggleFlag('left')}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-600">Flag Window</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Right Sidelight */}
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.sidelights.right.enabled}
                                    onChange={() => toggleSidelight('right')}
                                    className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                />
                                <span className="text-gray-700 font-medium">Right Sidelight</span>
                            </label>

                            {config.sidelights.right.enabled && (
                                <div className="ml-8 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-500">Width</span>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={config.sidelights.right.width}
                                                onChange={(e) => updateWidth('right', parseInt(e.target.value) || 0)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
                                            />
                                            <span className="absolute right-3 top-2 text-gray-400 text-sm">mm</span>
                                        </div>
                                    </div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={config.sidelights.right.transom || false}
                                            onChange={() => toggleFlag('right')}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-600">Flag Window</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Top Light */}
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.sidelights.top?.enabled || false}
                                    onChange={() => toggleSidelight('top')}
                                    className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                />
                                <span className="text-gray-700 font-medium">Top Light</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right: Visualizer Preview (Simplified) */}
                <div className="w-full md:w-1/2 bg-gray-100 p-8 flex items-center justify-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-gray-200 transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Reuse the logic from visualizer or a simplified wireframe for the modal */}
                    <div className="w-full h-64 bg-white shadow-lg border-8 border-gray-800 flex relative">
                        {/* Left */}
                        {config.sidelights.left.enabled && (
                            <div className="h-full border-r-4 border-gray-800 bg-blue-50" style={{ width: '20%' }} />
                        )}
                        {/* Center */}
                        <div className="flex-1 h-full bg-blue-100 flex">
                            <div className="flex-1 border-r border-gray-400 border-dashed" />
                            <div className="flex-1" />
                        </div>
                        {/* Right */}
                        {config.sidelights.right.enabled && (
                            <div className="h-full border-l-4 border-gray-800 bg-blue-50" style={{ width: '20%' }} />
                        )}
                    </div>

                    <div className="absolute bottom-8 text-center w-full">
                        <button
                            onClick={onClose}
                            className="bg-white px-6 py-2 rounded-lg shadow-sm border font-medium hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidelightModal;
