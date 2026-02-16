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

                // Construct path
                // If view is inside, try 'i' prefix first.
                // We'll try to fetch. If fail, fall back.
                let path: string | null = null;
                let usedInsideAsset = false;

                // 1. Try specific asset (e.g. i3+0.svg or 3+0.svg)
                const specificFilename = view === 'inside' ? `i${configStr}.svg` : `${configStr}.svg`;
                const specificPath = `/images/aluminium_bifolf/doors/${specificFilename}`;

                const response1 = await fetch(specificPath);
                if (response1.ok) {
                    path = specificPath;
                    usedInsideAsset = (view === 'inside');
                } else if (view === 'inside') {
                    // 2. If inside view specific failed, try standard view
                    const standardPath = `/images/aluminium_bifolf/doors/${configStr}.svg`;
                    const response2 = await fetch(standardPath);
                    if (response2.ok) {
                        path = standardPath;
                    }
                }

                if (!path) {
                    // If still no path (e.g. 4+0.svg doesn't exist), we stop here and let fallback render.
                    setSvgContent(null);
                    return;
                }

                const response = await fetch(path);
                let svgText = await response.text();

                // ... (rest of manipulation logic) ...

                // Mark if we used the inside asset so we don't flip it again
                if (usedInsideAsset) {
                    // Inject a marker ID so we interpret it later
                    svgText = svgText.replace('<svg ', '<svg id="inside-view-marker" ');
                }

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

            {/* 2. The Door Asset (Inline SVG) or Fallback */}
            <div
                className="absolute inset-0 pointer-events-none"
            >
                {svgContent ? (
                    <div
                        className="w-full h-full [&>svg]:w-full [&>svg]:h-full drop-shadow-2xl"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        style={{
                            // Flip if we used a standard asset for inside view to simulate reverse
                            transform: (view === 'inside' && !svgContent.includes('id="inside-view-marker"')) ? 'scaleX(-1)' : 'none'
                        }}
                    />
                ) : (
                    // PROCEDURAL FALLBACK (for 4/5 panels or missing files)
                    <div className="w-full h-full flex items-end justify-center">
                        {/* Frame */}
                        <div className="w-full h-full border-t-[8px] border-x-[8px] border-b-[8px] border-gray-800 bg-transparent flex shadow-2xl relative">
                            {/* Panels */}
                            {Array.from({ length: panels }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 h-full border-r-[2px] border-l-[2px] border-gray-700 relative bg-blue-900/10 backdrop-blur-[0.5px] first:border-l-0 last:border-r-0"
                                >
                                    {/* Glass Inner Shadow/Highlight */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                                    {/* Simple Handle (approximate placement) */}
                                    {/* Place handle on odd panels for simple logic, or based on config if we parsed it properly */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gray-900 rounded-full shadow-sm ${
                                        // Logic for handle placement:
                                        // Usually on the meeting stiles. 
                                        // For now, put on right of odd panels, left of even?
                                        // Simpler: Just put somewhat realistically.
                                        (i % 2 === 0) ? 'right-1' : 'left-1'
                                        } ${view === 'inside' ? 'bg-gray-700' : 'bg-black'}`} />
                                </div>
                            ))}
                        </div>
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
