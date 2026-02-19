import React from "react";
import { ShapedConfig } from "../../../types/product";

interface RealisticShapedFrameVisualizerProps {
    config: ShapedConfig;
    width: number;
    height: number;
    view: "inside" | "outside";
}

const RealisticShapedFrameVisualizer: React.FC<
    RealisticShapedFrameVisualizerProps
> = ({ config, width, height, view }) => {
    const frameColor =
        view === "outside" ? config.outsideColor : config.insideColor;

    const getFrameColor = (colorName: string) => {
        const c = colorName?.toLowerCase() || "white";
        if (c.includes("white")) return "#e5e7eb";
        if (c.includes("black")) return "#1c1917";
        if (c.includes("grey") || c.includes("anthracite")) return "#475569";
        return "#475569";
    };

    const getGlassGradient = () => {
        if (config.glassType === "unglazed") return "#94a3b8";
        if (config.glassType === "toughened_obscure") return "#cbd5e1";
        return "#bfdbfe"; // toughened / clear
    };

    const frameStroke = getFrameColor(frameColor);
    const frameStrokeWidth = 14;
    const glassColor = getGlassGradient();

    // SVG dimensions
    const svgWidth = 500;
    const svgHeight = 300;
    const padding = 30;

    // Compute the shape polygon points based on shapeType
    const getShapePath = () => {
        const left = padding;
        const right = svgWidth - padding;
        const bottom = svgHeight - padding;
        const top = padding;
        const midX = svgWidth / 2;

        switch (config.shapeType) {
            case "gable":
                // Triangle (gable)
                return `${left},${bottom} ${midX},${top} ${right},${bottom}`;

            case "shaped_left":
                // Pentagon: flat top-left corner, peak on right-ish area
                return `${left},${bottom} ${left},${top + 60} ${right - 80},${top} ${right},${bottom}`;

            case "shaped_right":
                // Pentagon: peak on left-ish area, flat top-right corner
                return `${left},${bottom} ${left + 80},${top} ${right},${top + 60} ${right},${bottom}`;

            case "gable_upstand":
                // Gable with upstand: triangle on top of a rectangle
                const upstandHeight = 40;
                const rectTop = bottom - upstandHeight;
                return `${left},${bottom} ${left},${rectTop} ${midX},${top} ${right},${rectTop} ${right},${bottom}`;

            default:
                return `${left},${bottom} ${midX},${top} ${right},${bottom}`;
        }
    };

    // Compute inner path (inset for glass)
    const getInnerPath = () => {
        const inset = frameStrokeWidth / 2 + 8;
        const left = padding + inset;
        const right = svgWidth - padding - inset;
        const bottom = svgHeight - padding - inset;
        const top = padding + inset;
        const midX = svgWidth / 2;

        switch (config.shapeType) {
            case "gable":
                return `${left},${bottom} ${midX},${top + 5} ${right},${bottom}`;

            case "shaped_left":
                return `${left},${bottom} ${left},${top + 60 + inset / 2} ${right - 80},${top + inset} ${right},${bottom}`;

            case "shaped_right":
                return `${left},${bottom} ${left + 80},${top + inset} ${right},${top + 60 + inset / 2} ${right},${bottom}`;

            case "gable_upstand": {
                const upstandHeight = 40;
                const rectTop = svgHeight - padding - upstandHeight - inset + 4;
                return `${left},${bottom} ${left},${rectTop} ${midX},${top + 5} ${right},${rectTop} ${right},${bottom}`;
            }

            default:
                return `${left},${bottom} ${midX},${top + 5} ${right},${bottom}`;
        }
    };

    // Parse polygon points string for transom bar rendering
    const parsePoints = (pointsStr: string) => {
        return pointsStr.split(" ").map((p) => {
            const [x, y] = p.split(",").map(Number);
            return { x, y };
        });
    };

    // Render transom bars (horizontal lines across the shape)
    const renderTransomBars = () => {
        if (!config.transomBars || config.transomBars === 0) return null;

        const innerPoints = parsePoints(getInnerPath());
        // Find the bounding box of inner shape
        const minY = Math.min(...innerPoints.map((p) => p.y));
        const maxY = Math.max(...innerPoints.map((p) => p.y));

        const bars = [];
        for (let i = 1; i <= config.transomBars; i++) {
            const fraction = i / (config.transomBars + 1);
            const y = minY + (maxY - minY) * fraction;

            // Find the left and right intersection points at this Y
            // Simple approach: interpolate along the polygon edges
            const intersections = getXIntersectionsAtY(innerPoints, y);
            if (intersections.length >= 2) {
                const leftX = Math.min(...intersections);
                const rightX = Math.max(...intersections);
                bars.push(
                    <line
                        key={`transom-${i}`}
                        x1={leftX}
                        y1={y}
                        x2={rightX}
                        y2={y}
                        stroke={frameStroke}
                        strokeWidth={4}
                    />
                );
            }
        }
        return bars;
    };

    // Render astragal bars (vertical lines across the shape)
    const renderAstragalBars = () => {
        if (!config.astragalBars || config.astragalBars === 0) return null;

        const innerPoints = parsePoints(getInnerPath());
        const minX = Math.min(...innerPoints.map((p) => p.x));
        const maxX = Math.max(...innerPoints.map((p) => p.x));

        const bars = [];
        for (let i = 1; i <= config.astragalBars; i++) {
            const fraction = i / (config.astragalBars + 1);
            const x = minX + (maxX - minX) * fraction;

            // Find top and bottom intersection at this X
            const intersections = getYIntersectionsAtX(innerPoints, x);
            if (intersections.length >= 2) {
                const topY = Math.min(...intersections);
                const bottomY = Math.max(...intersections);
                bars.push(
                    <line
                        key={`astragal-${i}`}
                        x1={x}
                        y1={topY}
                        x2={x}
                        y2={bottomY}
                        stroke={frameStroke}
                        strokeWidth={4}
                    />
                );
            }
        }
        return bars;
    };

    // Helper: find X intersections at a given Y for a polygon
    const getXIntersectionsAtY = (
        points: { x: number; y: number }[],
        y: number
    ): number[] => {
        const intersections: number[] = [];
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            const p1 = points[i];
            const p2 = points[j];

            if (
                (p1.y <= y && p2.y > y) ||
                (p2.y <= y && p1.y > y)
            ) {
                const t = (y - p1.y) / (p2.y - p1.y);
                intersections.push(p1.x + t * (p2.x - p1.x));
            }
        }
        return intersections;
    };

    // Helper: find Y intersections at a given X for a polygon
    const getYIntersectionsAtX = (
        points: { x: number; y: number }[],
        x: number
    ): number[] => {
        const intersections: number[] = [];
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            const p1 = points[i];
            const p2 = points[j];

            if (
                (p1.x <= x && p2.x > x) ||
                (p2.x <= x && p1.x > x)
            ) {
                const t = (x - p1.x) / (p2.x - p1.x);
                intersections.push(p1.y + t * (p2.y - p1.y));
            }
        }
        return intersections;
    };

    return (
        <div
            className="relative w-full h-full mx-auto flex flex-col items-center justify-center overflow-hidden rounded-md bg-white"
            style={{
                maxHeight: "100%",
                maxWidth: "100%",
            }}
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-no-repeat bg-center transition-all duration-500"
                style={{
                    backgroundImage:
                        "url(/images/aluminium_bifolf/backgrounds/garden.webp)",
                    backgroundSize: "cover",
                    filter:
                        view === "inside"
                            ? "blur(0px)"
                            : "brightness(1.0) contrast(1.05)",
                }}
            />

            {/* SVG Shaped Frame */}
            <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="relative z-10 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
                <defs>
                    {/* Glass gradient */}
                    <linearGradient id="glassGrad" x1="0" y1="0" x2="0.3" y2="1">
                        <stop offset="0%" stopColor={glassColor} stopOpacity="0.5" />
                        <stop offset="50%" stopColor={glassColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={glassColor} stopOpacity="0.4" />
                    </linearGradient>
                    {/* Clip path for background visibility through glass */}
                    <clipPath id="glassClip">
                        <polygon points={getInnerPath()} />
                    </clipPath>
                    {/* Frame shadow filter */}
                    <filter id="frameShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow
                            dx="2"
                            dy="4"
                            stdDeviation="6"
                            floodColor="#000"
                            floodOpacity="0.35"
                        />
                    </filter>
                </defs>

                {/* Glass fill (inner area) */}
                <polygon
                    points={getInnerPath()}
                    fill="url(#glassGrad)"
                    stroke="none"
                />

                {/* Glass reflection effect */}
                <polygon
                    points={getInnerPath()}
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    opacity="0.3"
                />

                {/* Outer frame */}
                <polygon
                    points={getShapePath()}
                    fill="none"
                    stroke={frameStroke}
                    strokeWidth={frameStrokeWidth}
                    strokeLinejoin="miter"
                    filter="url(#frameShadow)"
                />

                {/* Inner frame border */}
                <polygon
                    points={getInnerPath()}
                    fill="none"
                    stroke={frameStroke}
                    strokeWidth={3}
                    strokeLinejoin="miter"
                />

                {/* Transom and astragal bars */}
                {renderTransomBars()}
                {renderAstragalBars()}

                {/* Highlighted transom bar positions (yellow) */}
                {config.transomBarPositions &&
                    config.transomBarPositions.map((pos, idx) => {
                        const innerPoints = parsePoints(getInnerPath());
                        const minY = Math.min(...innerPoints.map((p) => p.y));
                        const maxY = Math.max(...innerPoints.map((p) => p.y));
                        const y = minY + (maxY - minY) * pos;
                        const intersections = getXIntersectionsAtY(innerPoints, y);
                        if (intersections.length >= 2) {
                            return (
                                <line
                                    key={`transom-pos-${idx}`}
                                    x1={Math.min(...intersections)}
                                    y1={y}
                                    x2={Math.max(...intersections)}
                                    y2={y}
                                    stroke="#eab308"
                                    strokeWidth={4}
                                />
                            );
                        }
                        return null;
                    })}
            </svg>

            {/* Footer Label */}
            <div className="absolute bottom-2 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded text-[10px] font-bold shadow-sm flex gap-2 z-50 text-slate-700 border border-slate-200">
                <span>
                    {width}x{height}mm
                </span>
                <span className="text-slate-300">•</span>
                <span>Shaped Frame</span>
                <span className="text-slate-300">•</span>
                <span className="uppercase text-blue-600">{view} View</span>
            </div>
        </div>
    );
};

export default RealisticShapedFrameVisualizer;
