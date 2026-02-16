
import React from 'react';

interface MiniVisualizerProps {
    left: number;
    right: number;
}



const MiniBifoldVisualizer: React.FC<MiniVisualizerProps> = ({ left, right }) => {
    const total = left + right;

    return (
        <svg viewBox={`0 0 ${total * 20} 30`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Draw Left Panels */}
            {Array.from({ length: left }).map((_, i) => (
                <g key={`l-${i}`}>
                    <rect x={i * 20 + 2} y={2} width={16} height={26} fill="none" stroke="#64748b" strokeWidth={1.5} />
                    {/* Arrow Left */}
                    <path d={`M ${i * 20 + 14} 15 L ${i * 20 + 6} 15 L ${i * 20 + 9} 12 M ${i * 20 + 6} 15 L ${i * 20 + 9} 18`} stroke="#ef4444" strokeWidth={1} fill="none" />
                </g>
            ))}

            {/* Draw Right Panels */}
            {Array.from({ length: right }).map((_, i) => (
                <g key={`r-${i}`}>
                    <rect x={(left + i) * 20 + 2} y={2} width={16} height={26} fill="none" stroke="#64748b" strokeWidth={1.5} />
                    {/* Arrow Right */}
                    <path d={`M ${(left + i) * 20 + 6} 15 L ${(left + i) * 20 + 14} 15 L ${(left + i) * 20 + 11} 12 M ${(left + i) * 20 + 14} 15 L ${(left + i) * 20 + 11} 18`} stroke="#ef4444" strokeWidth={1} fill="none" />
                </g>
            ))}
        </svg>
    );
};

export default MiniBifoldVisualizer;
