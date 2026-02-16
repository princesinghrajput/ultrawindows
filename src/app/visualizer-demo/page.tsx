
"use client";

import React, { useState } from 'react';
import BifoldVisualizer from '../../components/configurator/visualizers/BifoldVisualizer';

const VisualizerDemo = () => {
    const [width, setWidth] = useState(3000);
    const [height, setHeight] = useState(2100);
    const [panels, setPanels] = useState(3);
    const [color, setColor] = useState('#333333'); // Anthracite Grey

    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold mb-4">Procedural Door Visualizer (POC)</h1>
            <p className="mb-6 text-gray-600">
                This demonstrates how we can generate product images *without* needing assets.
                Trying changing the values below.
            </p>

            <div className="flex gap-8">
                {/* Controls */}
                <div className="flex flex-col gap-4 w-1/3 p-4 border rounded-lg bg-white shadow-sm">
                    <label className="flex flex-col">
                        <span className="text-sm font-semibold">Width (mm)</span>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="border p-2 rounded"
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-semibold">Height (mm)</span>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="border p-2 rounded"
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-semibold">Number of Panels</span>
                        <input
                            type="range"
                            min="2"
                            max="7"
                            value={panels}
                            onChange={(e) => setPanels(Number(e.target.value))}
                            className="w-full"
                        />
                        <span className="text-right text-xs">{panels} Panels</span>
                    </label>
                    <label className="flex flex-col">
                        <span className="text-sm font-semibold">Frame Color</span>
                        <select
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="#333333">Anthracite Grey</option>
                            <option value="#000000">Jet Black</option>
                            <option value="#FFFFFF">Traffic White</option>
                        </select>
                    </label>
                </div>

                {/* Visualizer Output */}
                <div className="flex-1 flex justify-center items-center bg-gray-50 border rounded-lg p-8">
                    <BifoldVisualizer
                        width={width}
                        height={height}
                        panels={panels}
                        openingDirection="left"
                        color={color}
                    />
                </div>
            </div>
        </div>
    );
};

export default VisualizerDemo;
