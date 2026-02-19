import React from "react";
import { FixedConfig } from "../../../types/product";

interface RealisticFixedFrameVisualizerProps {
    config: FixedConfig;
    width: number;
    height: number;
    view: "inside" | "outside";
}

const RealisticFixedFrameVisualizer: React.FC<
    RealisticFixedFrameVisualizerProps
> = ({ config, width, height, view }) => {
    const frameColor =
        view === "outside" ? config.outsideColor : config.insideColor;

    const getFrameStyles = (colorName: string) => {
        const c = colorName?.toLowerCase() || "white";
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

    const {
        bg: frameBg,
        borderColor: frameBorderColor,
        sashBorder,
    } = getFrameStyles(frameColor);

    // Transom/astragal bar rendering
    const renderTransomBars = () => {
        if (!config.transomBars || config.transomBars === 0) return null;
        return Array.from({ length: config.transomBars }).map((_, i) => {
            const spacing = 100 / (config.transomBars + 1);
            return (
                <div
                    key={`transom-${i}`}
                    className={`absolute left-0 right-0 h-1 ${frameBorderColor} bg-current z-20`}
                    style={{
                        top: `${spacing * (i + 1)}%`,
                        backgroundColor:
                            frameColor?.toLowerCase().includes("white")
                                ? "#e5e7eb"
                                : frameColor?.toLowerCase().includes("black")
                                    ? "#1c1917"
                                    : "#475569",
                    }}
                />
            );
        });
    };

    const renderAstragalBars = () => {
        if (!config.astragalBars || config.astragalBars === 0) return null;
        return Array.from({ length: config.astragalBars }).map((_, i) => {
            const spacing = 100 / (config.astragalBars + 1);
            return (
                <div
                    key={`astragal-${i}`}
                    className={`absolute top-0 bottom-0 w-1 z-20`}
                    style={{
                        left: `${spacing * (i + 1)}%`,
                        backgroundColor:
                            frameColor?.toLowerCase().includes("white")
                                ? "#e5e7eb"
                                : frameColor?.toLowerCase().includes("black")
                                    ? "#1c1917"
                                    : "#475569",
                    }}
                />
            );
        });
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
                    transform: view === "inside" ? "scale(1.0)" : "scale(1)",
                }}
            />

            {/* Floor Shadow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-12 bg-black/50 blur-xl rounded-[100%] w-[90%] opacity-40" />

            {/* Frame Assembly */}
            <div className="absolute inset-0 p-8 flex flex-col pointer-events-none">
                {/* Top Addon */}
                {config.addons?.top && (
                    <div
                        className={`w-full ${config.addons.top.includes("38") ? "h-5" : "h-3"} bg-blue-500 border-x border-t border-blue-600 relative z-10`}
                    />
                )}

                {/* Middle: Left Addon + Frame + Right Addon */}
                <div className="flex-1 flex w-full relative min-h-0">
                    {/* Left Addon */}
                    {config.addons?.left && (
                        <div
                            className={`${config.addons.left.includes("38") ? "w-5" : "w-3"} h-full bg-blue-500 border-y border-l border-blue-600 relative z-20 shrink-0`}
                        />
                    )}

                    {/* Main Outer Frame */}
                    <div
                        className={`relative flex-1 w-full border-8 ${frameBorderColor} bg-transparent flex shadow-2xl overflow-hidden ${!config.addons?.top ? "rounded-t-sm" : ""} ${config.cill === "none" ? "rounded-b-sm" : ""}`}
                    >
                        {/* Fixed Glass Pane */}
                        <div className="flex-1 relative bg-blue-300/5 backdrop-blur-[1px] overflow-hidden">
                            {/* Glass Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />

                            {/* Inner frame line */}
                            <div
                                className={`absolute inset-0 border-[1px] ${sashBorder} opacity-30 pointer-events-none`}
                            />

                            {/* Transom & Astragal bars */}
                            {renderTransomBars()}
                            {renderAstragalBars()}
                        </div>
                    </div>

                    {/* Right Addon */}
                    {config.addons?.right && (
                        <div
                            className={`${config.addons.right.includes("38") ? "w-5" : "w-3"} h-full bg-blue-500 border-y border-r border-blue-600 relative z-20 shrink-0`}
                        />
                    )}
                </div>

                {/* Cill */}
                {config.cill !== "none" && (
                    <div
                        className={`w-full h-6 mt-[1px] ${frameBg} relative shadow-md transform-gpu shrink-0 z-20 border-t border-white/10`}
                    >
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
                <span>Fixed Frame</span>
                <span className="text-slate-300">•</span>
                <span className="uppercase text-blue-600">{view} View</span>
            </div>
        </div>
    );
};

export default RealisticFixedFrameVisualizer;
