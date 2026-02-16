import React from 'react';

interface BifoldVisualizerProps {
    width: number;
    height: number;
    panels: number;
    openingDirection: 'left' | 'right' | 'both';
    configuration?: string; // "3+0", "2+1", etc.
    color: string;
    view?: 'inside' | 'outside';
}

const BifoldVisualizer: React.FC<BifoldVisualizerProps> = ({
    width,
    height,
    panels,
    openingDirection,
    configuration = `${panels}+0`,
    color,
    view = 'outside' // 'outside' | 'inside'
}) => {
    // Fixed aspect ratio for the container
    const containerAspect = 1.6;
    const scaledWidth = 800;
    const scaledHeight = scaledWidth / containerAspect;

    // Parse configuration "L+R"
    const [leftCount, rightCount] = configuration ? configuration.split('+').map(Number) : [panels, 0];
    const validConfig = !isNaN(leftCount) && !isNaN(rightCount) && (leftCount + rightCount === panels);

    // State for the loaded and processed SVG content
    const [svgContent, setSvgContent] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchSvg = async () => {
            try {
                // Determine raw filename first
                const configStr = validConfig ? configuration : `${panels}+0`;
                // Try to use the specific View asset if possible, else standard
                // Note: We'll apply transparency regardless
                const filename = view === 'inside' ? `i${configStr}.svg` : `${configStr}.svg`;
                const path = `/images/aluminium_bifolf/doors/${filename}`;

                const response = await fetch(path);
                if (!response.ok) throw new Error('Failed to load SVG');

                let svgText = await response.text();

                // --- Dynamic Manipulation ---

                // 1. Fix Glass Transparency
                // The assets use #4e9cea (approx blue) for glass. We want it transparent taking on a slight tint.
                // We'll replace the fill color with rgba.
                svgText = svgText.replace(/fill:#4e9cea/gi, 'fill: rgba(200, 230, 255, 0.15); stroke: rgba(255,255,255,0.4); stroke-width: 0.5px');
                svgText = svgText.replace(/fill="#4e9cea"/gi, 'fill="rgba(200, 230, 255, 0.15)" stroke="rgba(255,255,255,0.4)" stroke-width="0.5"');

                // 2. Dynamic Frame Coloring
                // Base colors seen in SVG: #565656, #3d3c3e (Dark Greys)
                // We want to map these to the selected 'color' prop.

                let targetColor = '#3d3c3e'; // Default Anthracite
                if (color.toLowerCase().includes('white')) targetColor = '#ffffff';
                if (color.toLowerCase().includes('black')) targetColor = '#1a1a1a';
                if (color.toLowerCase().includes('cream')) targetColor = '#f5f5dc';

                // If the user wants specific RALs, we'd need a mapper. For now, basic mapping:
                if (targetColor !== '#3d3c3e') {
                    // Replace the standard dark grey profiles with target color
                    svgText = svgText.replace(/fill:#565656/gi, `fill:${targetColor}`);
                    svgText = svgText.replace(/fill="#565656"/gi, `fill="${targetColor}"`);
                    svgText = svgText.replace(/fill:#3d3c3e/gi, `fill:${targetColor}`);
                    svgText = svgText.replace(/fill="#3d3c3e"/gi, `fill="${targetColor}"`);
                }

                setSvgContent(svgText);
            } catch (err) {
                console.error("Error loading SVG asset:", err);
                setSvgContent(null);
            }
        };

        fetchSvg();
    }, [configuration, panels, view, color, validConfig]);


    // Door dimensions relative to the container
    // We want the door to fill the width as requested ("very corner")
    // We use CSS percentages and aspect-ratio to maintain responsiveness

    // Calculate aspect ratio string for CSS
    const aspectRatio = `${width} / ${height}`;

    // Floor position relative to container height (approximate perspective)
    // The background image implies a floor at the bottom
    const bottomOffset = '0px';

    return (
        <div
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-2xl group flex flex-col justify-end"
            style={{ aspectRatio: `${width} / ${height}` }}
        >
            {/* 1. Realistic Background */}
            <div
                className="absolute inset-0 bg-no-repeat bg-center transition-all duration-500"
                style={{
                    backgroundImage: 'url(/images/aluminium_bifolf/backgrounds/garden.webp)',
                    backgroundSize: '100% 100%', // Force fit to container (which is now door aspect ratio)
                    filter: view === 'inside' ? 'blur(0px)' : 'brightness(1.0) contrast(1.05)',
                    transform: view === 'inside' ? 'scale(1.0)' : 'scale(1)'
                }}
            />

            {/* Floor Shadow */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 bg-black/40 blur-md rounded-[100%] w-full opacity-50"
            />

            {/* 2. The Door Asset (Inline SVG) */}
            <div
                className="absolute inset-0 pointer-events-none"
            >
                {svgContent ? (
                    <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full drop-shadow-2xl"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                ) : (
                    // Fallback or loading
                    <div className="w-full h-full flex items-center justify-center text-gray-500 animate-pulse">
                        Loading Visual...
                    </div>
                )}
            </div>

            {/* 3. Overlays (Arrows) - Positioned on top of the image */}
            <div
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-500 ease-out"
                style={{
                    width: '100%',
                    aspectRatio: aspectRatio,
                    bottom: bottomOffset,
                    maxHeight: '100%'
                }}
            >
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <defs>
                        <marker id="arrowhead-right" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                        </marker>
                        <marker id="arrowhead-left" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                        </marker>
                    </defs>
                    {Array.from({ length: panels }).map((_, index) => {
                        const isLeftStack = index < leftCount;
                        const arrowDirection = isLeftStack ? 'left' : 'right';
                        const pW = width / panels;

                        // Center of panel
                        const pCx = index * pW + pW / 2;
                        const pCy = height / 2; // Mid-height

                        return (
                            <g key={index}>
                                {arrowDirection === 'right' ? (
                                    <line
                                        x1={pCx - pW / 3} y1={pCy} x2={pCx + pW / 3} y2={pCy}
                                        stroke="#ef4444" strokeWidth={height * 0.005} markerEnd="url(#arrowhead-right)"
                                        style={{ filter: 'drop-shadow(0px 1px 2px rgba(255,255,255,0.8))' }}
                                    />
                                ) : (
                                    <line
                                        x1={pCx + pW / 3} y1={pCy} x2={pCx - pW / 3} y2={pCy}
                                        stroke="#ef4444" strokeWidth={height * 0.005} markerEnd="url(#arrowhead-left)"
                                        style={{ filter: 'drop-shadow(0px 1px 2px rgba(255,255,255,0.8))' }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>


            {/* Footer Label */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded text-xs font-semibold shadow-sm flex gap-2">
                <span>{width}x{height}mm</span>
                <span>•</span>
                <span>{panels} Panels</span>
                <span>•</span>
                <span className="uppercase">{view} View</span>
            </div>
        </div>
    );
};

export default BifoldVisualizer;
