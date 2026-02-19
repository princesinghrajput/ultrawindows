import React from "react";

interface RooflightVisualizerProps {
    width: number;
    height: number;
    outsideColor: string;
}

const COLOR_MAP: Record<string, { frame: string; frameDark: string }> = {
    white: { frame: "#e5e7eb", frameDark: "#d1d5db" },
    black: { frame: "#1f2937", frameDark: "#111827" },
    grey: { frame: "#6b7280", frameDark: "#4b5563" },
};

const RooflightVisualizer: React.FC<RooflightVisualizerProps> = ({
    width,
    height,
    outsideColor,
}) => {
    const colors = COLOR_MAP[outsideColor] || COLOR_MAP.white;

    // Isometric projection of a flat rooflight panel
    const svgW = 420;
    const svgH = 320;

    // Outer frame corners (isometric perspective, viewed from above-left)
    const outerFrame = {
        tl: { x: 120, y: 40 },
        tr: { x: 380, y: 80 },
        br: { x: 330, y: 260 },
        bl: { x: 50, y: 200 },
    };

    // Inner glass corners (inset from frame)
    const inset = 18;
    const innerGlass = {
        tl: { x: outerFrame.tl.x + inset, y: outerFrame.tl.y + inset * 0.6 },
        tr: { x: outerFrame.tr.x - inset, y: outerFrame.tr.y + inset * 0.6 },
        br: { x: outerFrame.br.x - inset, y: outerFrame.br.y - inset * 0.6 },
        bl: { x: outerFrame.bl.x + inset, y: outerFrame.bl.y - inset * 0.6 },
    };

    const toPath = (pts: { x: number; y: number }[]) =>
        `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;

    const outerPath = toPath([
        outerFrame.tl,
        outerFrame.tr,
        outerFrame.br,
        outerFrame.bl,
    ]);
    const innerPath = toPath([
        innerGlass.tl,
        innerGlass.tr,
        innerGlass.br,
        innerGlass.bl,
    ]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white p-4">
            <svg
                viewBox={`0 0 ${svgW} ${svgH}`}
                className="w-full"
                style={{ maxWidth: "400px", maxHeight: "300px" }}
            >
                <defs>
                    {/* Glass reflection gradient */}
                    <linearGradient
                        id="glassGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.6" />
                        <stop offset="30%" stopColor="#93c5fd" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#dbeafe" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.3" />
                    </linearGradient>

                    {/* Reflection shine */}
                    <linearGradient
                        id="shineGradient"
                        x1="0%"
                        y1="0%"
                        x2="80%"
                        y2="100%"
                    >
                        <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                        <stop offset="40%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>

                    {/* Shadow below the rooflight */}
                    <filter id="dropShadow" x="-10%" y="-10%" width="140%" height="140%">
                        <feDropShadow
                            dx="4"
                            dy="6"
                            stdDeviation="8"
                            floodColor="#000"
                            floodOpacity="0.15"
                        />
                    </filter>
                </defs>

                {/* Shadow */}
                <path d={outerPath} fill="#00000010" filter="url(#dropShadow)" />

                {/* Frame (outer body) */}
                <path d={outerPath} fill={colors.frame} stroke={colors.frameDark} strokeWidth="1" />

                {/* Frame edge highlight (top-left bevel) */}
                <line
                    x1={outerFrame.tl.x}
                    y1={outerFrame.tl.y}
                    x2={outerFrame.tr.x}
                    y2={outerFrame.tr.y}
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                />
                <line
                    x1={outerFrame.tl.x}
                    y1={outerFrame.tl.y}
                    x2={outerFrame.bl.x}
                    y2={outerFrame.bl.y}
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                />

                {/* Glass pane */}
                <path d={innerPath} fill="url(#glassGradient)" />

                {/* Glass reflection shine */}
                <path d={innerPath} fill="url(#shineGradient)" />

                {/* Glass edge */}
                <path
                    d={innerPath}
                    fill="none"
                    stroke={colors.frameDark}
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                />

                {/* Frame inner lip (subtle line around glass) */}
                <path
                    d={innerPath}
                    fill="none"
                    stroke={colors.frameDark}
                    strokeWidth="1.5"
                    strokeOpacity="0.2"
                />
            </svg>

            <div className="text-xs text-slate-500 mt-3 text-center">
                <span className="font-medium text-slate-700">{width}</span> ×{" "}
                <span className="font-medium text-slate-700">{height}</span> mm
            </div>
        </div>
    );
};

export default RooflightVisualizer;
