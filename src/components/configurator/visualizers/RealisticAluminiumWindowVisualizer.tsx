import React from "react";
import { WindowConfig } from "../../../types/product";

interface RealisticAluminiumWindowVisualizerProps {
    config: WindowConfig;
    width: number;
    height: number;
    view: "inside" | "outside";
}

const RealisticAluminiumWindowVisualizer: React.FC<
    RealisticAluminiumWindowVisualizerProps
> = ({ config, width, height, view }) => {
    // Helper to get frame styles (same as French Door)
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
        if (name.includes("gold")) return "bg-yellow-500 shadow-yellow-900/20";
        return "bg-gradient-to-b from-slate-100 to-slate-300 border border-slate-300 shadow-black/20"; // Chrome
    };

    const frameColor =
        view === "outside" ? config.outsideColor : config.insideColor;
    const {
        bg: frameBg,
        borderColor: frameBorderColor,
        sashBorder,
    } = getFrameStyles(frameColor);
    const handleClass = getHandleStyle(config.hardwareColor);

    // Layout Logic
    const layout = React.useMemo(() => {
        // Fallback to legacy or default
        const styleId = config.windowStyle || "style-21";
        const { getLayoutForStyle } = require("../../../utils/windowLayouts");
        return getLayoutForStyle(styleId);
    }, [config.windowStyle]);

    const renderNode = (node: any, index: number, path: string = "0") => {
        if (node.type === "container") {
            return (
                <div
                    key={path}
                    className={`flex ${node.direction === "column" ? "flex-col" : "flex-row"} w-full h-full`}
                    style={{ flex: node.flex || 1 }}
                >
                    {node.children.map((child: any, i: number) =>
                        renderNode(child, i, `${path}-${i}`)
                    )}
                </div>
            );
        }

        // It's a pane
        const paneType = node.defaultType; // In future, check config.paneConfigurations[path]
        const isOpener = paneType === "opener" || paneType === "top-hung";
        const isTopHung = paneType === "top-hung" || paneType === "transom"; // Transoms often top hung or fixed? 
        // For Style 22 (transom), usually fixed or top opener.
        // Let's assume transom default is fixed for now, unless specified.
        // Actually, let's treat "transom" as a specific fixed small pane behavior if needed, 
        // but physically it's just a pane.

        // Refined Opener Logic:
        // If config says it's fixed, override.
        // For now, use defaultType.
        // Transoms in schemas are usually top-hung openers or fixed. 
        // Let's assume Fixed for "transom" type unless we add specific opener controls.
        // Actually, user wants "Opener" configuration.
        // For now, hardcode: 'transom' -> Fixed (visually small), 'opener' -> Opener.

        const isActualOpener = paneType === "opener" || paneType === "top-hung";

        return (
            <div
                key={path}
                className={`
                relative 
                ${frameBorderColor}
                border-[2px] 
                bg-blue-300/5 backdrop-blur-[1px]
                overflow-hidden z-10
                flex flex-col
            `}
                style={{ flex: node.flex || 1 }}
            >
                {/* Glass Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />

                {/* Sash Frame for Openers */}
                {isActualOpener && (
                    <div className={`absolute inset-0 border-[6px] ${frameBorderColor} z-20`}>
                        <div className={`absolute inset-0 border-[1px] ${sashBorder} opacity-50 pointer-events-none`} />
                    </div>
                )}

                {/* Fixed Frame inside */}
                {!isActualOpener && (
                    <div className={`absolute inset-0 border-[1px] ${sashBorder} opacity-30 pointer-events-none`} />
                )}

                {/* Handle */}
                {isActualOpener && (
                    <div
                        className={`
                absolute 
                ${isTopHung ? "bottom-2 left-1/2 -translate-x-1/2 w-16 h-3" : "top-1/2 -translate-y-1/2 right-2 w-[6px] h-16"}
                rounded-[2px] z-30 transition-colors duration-300
                ${handleClass}
                shadow-sm
            `}
                    />
                )}
            </div>
        );
    };

    return (
        <div
            className="relative w-full h-full mx-auto shadow-2xl group flex flex-col justify-end overflow-hidden rounded-md bg-white"
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

            {/* 2. The Window Assembly Container */}
            <div className="absolute inset-0 p-8 flex flex-col pointer-events-none">
                {/* Top Section: Top Addon + Trickle Vents */}
                <div className="flex flex-col w-full mx-auto" style={{ width: "100%" }}>
                    {/* Top Addon */}
                    {config.addons?.top && (
                        <div
                            className={`w-full ${config.addons.top.includes("38") ? "h-5" : "h-3"} bg-blue-500 border-x border-t border-blue-600 relative z-10`}
                            style={{ width: "100%" }}
                        />
                    )}

                    {/* Trickle Vents (Top Addon) */}
                    {(typeof config.trickleVents === "number"
                        ? config.trickleVents > 0
                        : config.trickleVents) && (
                            <div
                                className={`w-full h-4 mb-[1px] ${frameBg} relative shadow-sm z-20 shrink-0 mx-auto ${!config.addons?.top ? "rounded-t-sm" : ""
                                    }`}
                                style={{ width: "99%" }}
                            >
                                {typeof config.trickleVents === "number" &&
                                    config.trickleVents > 0 ? (
                                    Array.from({ length: config.trickleVents }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-1 h-1.5 bg-black/40 border border-white/10 rounded-full shadow-inner"
                                            style={{
                                                left: `${(100 / (config.trickleVents as number)) * (i + 0.5)}%`,
                                                width: `${Math.min(20, 80 / (config.trickleVents as number))}%`,
                                                transform: "translateX(-50%)",
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div className="absolute inset-x-4 top-1 h-1.5 bg-black/40 border border-white/10 rounded-full shadow-inner" />
                                )}
                            </div>
                        )}
                </div>

                {/* Middle Section: Left Addon + Frame + Right Addon */}
                <div className="flex-1 flex w-full relative min-h-0">
                    {/* Left Addon */}
                    {config.addons?.left && (
                        <div
                            className={`
                    ${config.addons.left.includes("38") ? "w-5" : "w-3"} 
                    h-full bg-blue-500 border-y border-l border-blue-600
                    relative z-20 shrink-0
                `}
                        />
                    )}

                    {/* Main Outer Frame */}
                    <div
                        className={`
                relative flex-1 w-full 
                border-8 
                ${frameBorderColor} 
                bg-transparent 
                flex shadow-2xl overflow-hidden
                ${!config.trickleVents && !config.addons?.top ? "rounded-t-sm" : ""}
                ${config.cill === "none" ? "rounded-b-sm" : ""}
            `}
                    >
                        {/* Recursive Layout Rendering */}
                        <div className="flex-1 flex w-full h-full relative">
                            {renderNode(layout, 0)}
                        </div>
                    </div>

                    {/* Right Addon */}
                    {config.addons?.right && (
                        <div
                            className={`
                    ${config.addons.right.includes("38") ? "w-5" : "w-3"} 
                    h-full bg-blue-500 border-y border-r border-blue-600
                    relative z-20 shrink-0
                `}
                        />
                    )}
                </div>

                {/* Cill (Bottom Addon) */}
                {config.cill !== "none" && (
                    <div
                        className={`
                w-full h-6 mt-[1px] 
                ${frameBg} 
                relative shadow-md transform-gpu 
                shrink-0 z-20
                border-t border-white/10
            `}
                    >
                        {/* Cill Nose */}
                        <div className="absolute bottom-0 w-full h-2 bg-black/10" />
                    </div>
                )}
            </div>

            {/* Footer Label */}
            <div className="absolute bottom-2 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded text-[10px] font-bold shadow-sm flex gap-2 z-50 text-slate-700 border border-slate-200">
                <span>
                    {width}x{height}mm
                </span>
                <span className="text-slate-300">•</span>
                <span>Aluminium Window</span>
                <span className="text-slate-300">•</span>
                <span className="uppercase text-blue-600">{view} View</span>
            </div>
        </div>
    );
};

export default RealisticAluminiumWindowVisualizer;
