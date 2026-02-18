import React from "react";
import { SliderConfig } from "../../../types/product";

interface RealisticSliderVisualizerProps {
    config: SliderConfig;
    width: number;
    height: number;
    view: "inside" | "outside";
}

const RealisticSliderVisualizer: React.FC<RealisticSliderVisualizerProps> = ({
    config,
    width,
    height,
    view,
}) => {
    const panels = config.panels || 2;
    const slideDirection = config.slideDirection || "both";
    const color = config.color || "black";
    const handleColor = config.hardwareColor || "chrome";
    const cill = config.cill || "none";
    const trickleVents = config.trickleVents || 0;
    const addonLeft = config.addons?.left || null;
    const addonRight = config.addons?.right || null;
    const addonTop = config.addons?.top || null;
    const transomBars = config.transomBars || 0;
    const astragalBars = config.astragalBars || 0;
    const glassType = config.glassType || "toughened";
    const glassPattern = config.glassPattern;
    const blinds = config.blinds;

    // Helper to get frame styles
    const getFrameStyles = (colorName: string) => {
        const c = colorName.toLowerCase();
        if (c.includes("white"))
            return {
                bg: "bg-white",
                borderColor: "border-white",
                sashBorder: "border-gray-200",
            };
        if (c.includes("black"))
            return {
                bg: "bg-zinc-900",
                borderColor: "border-zinc-900",
                sashBorder: "border-zinc-700",
            };
        if (c.includes("grey") || c.includes("anthracite") || c.includes("#333"))
            return {
                bg: "bg-slate-700",
                borderColor: "border-slate-700",
                sashBorder: "border-slate-600",
            };
        return {
            bg: "bg-slate-700",
            borderColor: "border-slate-700",
            sashBorder: "border-slate-600",
        };
    };

    const getHandleStyle = (c: string) => {
        const name = c.toLowerCase();
        if (name.includes("black")) return "bg-black shadow-black/20";
        if (name.includes("white"))
            return "bg-white border border-gray-300 shadow-black/10";
        if (name.includes("gold"))
            return "bg-yellow-500 shadow-yellow-900/20";
        return "bg-gradient-to-b from-slate-100 to-slate-300 border border-slate-300 shadow-black/20"; // Chrome
    };

    const {
        bg: frameBg,
        borderColor: frameBorderColor,
        sashBorder,
    } = getFrameStyles(color);
    const handleClass = getHandleStyle(handleColor);

    // For a slider, the key visual difference is:
    // - Panels overlap slightly (one slides over/behind the other)
    // - A visible interlock rail between panels
    // - Arrows show slide direction
    // - Handles are vertical bars near the interlock

    return (
        <div
            className="relative w-full h-full max-h-full mx-auto shadow-2xl group flex flex-col justify-end overflow-hidden rounded-md bg-white"
            style={{
                aspectRatio: `${width} / ${height}`,
                maxHeight: "100%",
                maxWidth: "100%",
            }}
        >
            {/* 1. Realistic Background */}
            <div
                className="absolute inset-0 bg-no-repeat bg-center transition-all duration-500"
                style={{
                    backgroundImage:
                        "url(/images/aluminium_bifolf/backgrounds/garden.webp)",
                    backgroundSize: "cover",
                    filter:
                        view === "inside" ? "blur(0px)" : "brightness(1.0) contrast(1.05)",
                    transform: view === "inside" ? "scale(1.0)" : "scale(1)",
                }}
            />

            {/* Floor Shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-12 bg-black/50 blur-xl rounded-[100%] w-[90%] opacity-40" />

            {/* 2. The Slider Assembly Container */}
            <div className="absolute inset-0 p-4 flex flex-col pointer-events-none">
                {/* Top Section: Top Addon + Trickle Vents */}
                <div className="flex flex-col w-full mx-auto" style={{ width: "100%" }}>
                    {/* Top Addon */}
                    {addonTop && (
                        <div
                            className={`w-full ${addonTop.includes("38") ? "h-5" : "h-3"} bg-blue-500 border-x border-t border-blue-600 relative z-10`}
                            style={{ width: "100%" }}
                        />
                    )}

                    {/* Trickle Vents */}
                    {(typeof trickleVents === "number"
                        ? trickleVents > 0
                        : trickleVents) && (
                            <div
                                className={`w-full h-4 mb-[1px] ${frameBg} relative shadow-sm z-20 flex-shrink-0 mx-auto ${!addonTop ? "rounded-t-sm" : ""
                                    }`}
                                style={{ width: "99%" }}
                            >
                                {typeof trickleVents === "number" && trickleVents > 0 ? (
                                    Array.from({ length: trickleVents }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-1 h-1.5 bg-black/10 rounded-full"
                                            style={{
                                                left: `${(100 / (trickleVents + 1)) * (i + 1)}%`,
                                                width: `${Math.min(20, 80 / trickleVents)}%`,
                                                transform: "translateX(-50%)",
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div className="absolute inset-x-4 top-1 h-1.5 bg-black/10 rounded-full" />
                                )}
                            </div>
                        )}
                </div>

                {/* Middle Section: Left Addon + Frame + Right Addon */}
                <div className="flex-1 flex w-full relative min-h-0">
                    {/* Left Addon */}
                    {addonLeft && (
                        <div
                            className={`
                    ${addonLeft.includes("38") ? "w-5" : "w-3"} 
                    h-full bg-blue-500 border-y border-l border-blue-600
                    relative z-20 flex-shrink-0
                `}
                        />
                    )}

                    {/* Main Outer Frame */}
                    <div
                        className={`
                        relative flex-1 w-full 
                        border-t-[8px] border-x-[8px] border-b-[8px] 
                        ${frameBorderColor} 
                        bg-transparent 
                        flex shadow-2xl overflow-hidden
                        ${!trickleVents && !addonTop ? "rounded-t-sm" : ""}
                        ${cill === "none" ? "rounded-b-sm" : ""}
                    `}
                    >
                        {/* Slider Panels Container */}
                        <div className="flex-1 flex h-full relative">
                            {Array.from({ length: panels }).map((_, i) => {
                                // Determine if this panel slides and which direction
                                const isLeftPanel = i === 0;
                                const isRightPanel = i === panels - 1;

                                // Handle position: place handles at the interlock (center meeting point)
                                const showHandle =
                                    (slideDirection === "left" && isLeftPanel) ||
                                    (slideDirection === "right" && isRightPanel) ||
                                    (slideDirection === "both");

                                // Handle side within the panel
                                const handleOnRight =
                                    (slideDirection === "left" && isLeftPanel) ||
                                    (slideDirection === "both" && isLeftPanel);
                                const handleOnLeft =
                                    (slideDirection === "right" && isRightPanel) ||
                                    (slideDirection === "both" && isRightPanel);

                                return (
                                    <div
                                        key={i}
                                        className={`
                      flex-1 h-full relative 
                      border-[3px]
                      ${frameBorderColor}
                      ${i > 0 ? "-ml-[3px]" : ""}
                      bg-blue-300/5 backdrop-blur-[1px]
                      overflow-hidden
                      z-10
                    `}
                                    >
                                        {/* Integral Blinds */}
                                        {blinds === "mechanical" && (
                                            <div
                                                className="absolute inset-2 top-2 bottom-2 z-20 opacity-90 pointer-events-none"
                                                style={{
                                                    backgroundImage:
                                                        "url(/images/aluminium_bifolf/blinds.png)",
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                }}
                                            />
                                        )}

                                        {/* Glass Sheen / Reflection */}
                                        {glassType !== "unglazed" && (
                                            <div
                                                className={`absolute inset-2 ${glassType === "toughened_obscure" ||
                                                        glassPattern === "Satin" ||
                                                        glassPattern?.includes("Stippolyte")
                                                        ? "bg-white/40 backdrop-blur-[2px]"
                                                        : glassPattern?.includes("Blue")
                                                            ? "bg-blue-100/30"
                                                            : glassPattern?.includes("Bronze")
                                                                ? "bg-amber-900/10"
                                                                : glassPattern?.includes("Grey")
                                                                    ? "bg-slate-900/10"
                                                                    : "bg-sky-100/20"
                                                    }`}
                                            >
                                                {/* Diagonal Sheen */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-50" />
                                            </div>
                                        )}

                                        {/* Inner Sash Definition */}
                                        <div
                                            className={`absolute inset-0 border-[1px] ${sashBorder} opacity-50 pointer-events-none`}
                                        />

                                        {/* Interlock Rail - thick vertical rail at the meeting point */}
                                        {i < panels - 1 && (
                                            <div
                                                className={`absolute right-0 top-0 bottom-0 w-[5px] ${frameBg} z-30 shadow-sm`}
                                                style={{ boxShadow: "inset 0 0 2px rgba(0,0,0,0.3)" }}
                                            />
                                        )}
                                        {i > 0 && (
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 w-[5px] ${frameBg} z-30 shadow-sm`}
                                                style={{ boxShadow: "inset 0 0 2px rgba(0,0,0,0.3)" }}
                                            />
                                        )}

                                        {/* Transom Bars (Horizontal Dividers) */}
                                        {transomBars > 0 &&
                                            Array.from({ length: transomBars }).map(
                                                (_, barIndex) => (
                                                    <div
                                                        key={`tbar-${barIndex}`}
                                                        className={`absolute w-full h-3 ${frameBg} z-20 shadow-sm border-y border-black/10`}
                                                        style={{
                                                            top: `${(100 / (transomBars + 1)) * (barIndex + 1)
                                                                }%`,
                                                            transform: "translateY(-50%)",
                                                        }}
                                                    />
                                                )
                                            )}

                                        {/* Astragal Bars (Vertical Dividers) */}
                                        {astragalBars > 0 &&
                                            Array.from({ length: astragalBars }).map(
                                                (_, barIndex) => (
                                                    <div
                                                        key={`abar-${barIndex}`}
                                                        className={`absolute h-full w-3 ${frameBg} z-20 shadow-sm border-x border-black/10`}
                                                        style={{
                                                            left: `${(100 / (astragalBars + 1)) * (barIndex + 1)
                                                                }%`,
                                                            transform: "translateX(-50%)",
                                                        }}
                                                    />
                                                )
                                            )}

                                        {/* Handle Placement - vertical bar near the interlock */}
                                        {showHandle && handleOnRight && (
                                            <div
                                                className={`
                          absolute top-1/2 -translate-y-1/2 right-3 w-[6px] h-20 rounded-[2px] z-30 transition-colors duration-300
                          ${handleClass}
                          shadow-sm
                        `}
                                            />
                                        )}
                                        {showHandle && handleOnLeft && (
                                            <div
                                                className={`
                          absolute top-1/2 -translate-y-1/2 left-3 w-[6px] h-20 rounded-[2px] z-30 transition-colors duration-300
                          ${handleClass}
                          shadow-sm
                        `}
                                            />
                                        )}
                                        {/* For single-direction, place handle at interlock side */}
                                        {showHandle && !handleOnRight && !handleOnLeft && (
                                            <div
                                                className={`
                          absolute top-1/2 -translate-y-1/2 w-[6px] h-20 rounded-[2px] z-30 transition-colors duration-300
                          ${handleClass}
                          ${i === 0 ? "right-3" : "left-3"}
                          shadow-sm
                        `}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Addon */}
                    {addonRight && (
                        <div
                            className={`
                    ${addonRight.includes("38") ? "w-5" : "w-3"} 
                    h-full bg-blue-500 border-y border-r border-blue-600
                    relative z-20 flex-shrink-0
                `}
                        />
                    )}
                </div>

                {/* Cill (Bottom Addon) */}
                {cill !== "none" && (
                    <div
                        className={`
                        w-full h-6 mt-[1px] 
                        ${frameBg} 
                        relative shadow-md transform-gpu 
                        flex-shrink-0 z-20
                        border-t border-white/10
                    `}
                    >
                        {/* Cill Nose */}
                        <div className="absolute bottom-0 w-full h-2 bg-black/10" />
                    </div>
                )}
            </div>

            {/* 3. Slide Direction Arrows */}
            <div className="absolute inset-0 p-4 pointer-events-none z-40">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    style={{ overflow: "visible" }}
                >
                    <defs>
                        <marker
                            id="slider-arrow-right"
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                        </marker>
                        <marker
                            id="slider-arrow-left"
                            markerWidth="10"
                            markerHeight="7"
                            refX="1"
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="10 0, 0 3.5, 10 7" fill="#3b82f6" />
                        </marker>
                    </defs>

                    {Array.from({ length: panels }).map((_, index) => {
                        const pW = width / panels;
                        const pCx = index * pW + pW / 2;
                        const pCy = height / 2;
                        const isLeftPanel = index === 0;
                        const isRightPanel = index === panels - 1;

                        // Show arrow based on slide direction
                        let showArrow = false;
                        let arrowDir: "left" | "right" = "right";
                        if (slideDirection === "left" && isLeftPanel) {
                            showArrow = true;
                            arrowDir = "left";
                        } else if (slideDirection === "right" && isRightPanel) {
                            showArrow = true;
                            arrowDir = "right";
                        } else if (slideDirection === "both") {
                            showArrow = true;
                            arrowDir = isLeftPanel ? "left" : "right";
                        }

                        if (!showArrow) return null;

                        return (
                            <g key={index}>
                                {arrowDir === "right" ? (
                                    <line
                                        x1={pCx - pW / 4}
                                        y1={pCy}
                                        x2={pCx + pW / 4}
                                        y2={pCy}
                                        stroke="#3b82f6"
                                        strokeWidth={Math.max(2, height * 0.002)}
                                        markerEnd="url(#slider-arrow-right)"
                                        style={{ filter: "drop-shadow(0px 1px 2px white)" }}
                                    />
                                ) : (
                                    <line
                                        x1={pCx + pW / 4}
                                        y1={pCy}
                                        x2={pCx - pW / 4}
                                        y2={pCy}
                                        stroke="#3b82f6"
                                        strokeWidth={Math.max(2, height * 0.002)}
                                        markerEnd="url(#slider-arrow-left)"
                                        style={{ filter: "drop-shadow(0px 1px 2px white)" }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Footer Label */}
            <div className="absolute bottom-2 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded text-[10px] font-bold shadow-sm flex gap-2 z-50 text-slate-700 border border-slate-200">
                <span>
                    {width}x{height}mm
                </span>
                <span className="text-slate-300">•</span>
                <span>{panels} Panes</span>
                <span className="text-slate-300">•</span>
                <span className="capitalize">{slideDirection} Slide</span>
                <span className="text-slate-300">•</span>
                <span className="uppercase text-blue-600">{view} View</span>
            </div>
        </div>
    );
};

export default RealisticSliderVisualizer;
