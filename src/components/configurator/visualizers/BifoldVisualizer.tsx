
import React from 'react';

interface BifoldVisualizerProps {
    width: number;
    height: number;
    panels: number;
    openingDirection: 'left' | 'right' | 'both';
    color: string;
}

const BifoldVisualizer: React.FC<BifoldVisualizerProps> = ({
    width,
    height,
    panels,
    openingDirection,
    color,
}) => {
    // Scale factor to fit the SVG in the container
    const scale = 0.2; // Adjust as needed
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const panelWidth = scaledWidth / panels;

    return (
        <div className="flex flex-col items-center">
            <svg
                width={scaledWidth}
                height={scaledHeight}
                viewBox={`0 0 ${scaledWidth} ${scaledHeight}`}
                className="border border-gray-300 shadow-lg bg-gray-100" // Background for context
            >
                {/* Frame */}
                <rect
                    x={0}
                    y={0}
                    width={scaledWidth}
                    height={scaledHeight}
                    fill="none"
                    stroke={color}
                    strokeWidth={4}
                />

                {/* Panels */}
                {Array.from({ length: panels }).map((_, index) => (
                    <g key={index}>
                        {/* Panel Outline */}
                        <rect
                            x={index * panelWidth}
                            y={0}
                            width={panelWidth}
                            height={scaledHeight}
                            fill="rgba(200, 230, 255, 0.3)" // Light blue glass tint
                            stroke={color}
                            strokeWidth={2}
                        />
                        {/* Handle (Approximate position) */}
                        {/* This is a simplification; real logic would depend on opening config */}
                        <circle
                            cx={index * panelWidth + (panelWidth - 10)}
                            cy={scaledHeight / 2}
                            r={3}
                            fill="#333"
                        />
                    </g>
                ))}

                {/* Dimensions Text */}
                <text x={scaledWidth / 2} y={scaledHeight + 20} textAnchor="middle" fill="#555" fontSize="12">
                    {width}mm
                </text>
                <text x={-20} y={scaledHeight / 2} textAnchor="middle" fill="#555" fontSize="12" transform={`rotate(-90, -20, ${scaledHeight / 2})`}>
                    {height}mm
                </text>

            </svg>
            <div className="mt-2 text-sm text-gray-600">
                {panels} Panel Bifold - {color}
            </div>
        </div>
    );
};

export default BifoldVisualizer;
