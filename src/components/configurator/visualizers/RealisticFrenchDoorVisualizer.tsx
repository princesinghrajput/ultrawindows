import React from "react";
import { DoorConfig } from "../../../types/product";

interface RealisticFrenchDoorVisualizerProps {
  config: DoorConfig;
  width: number;
  height: number;
  view: "inside" | "outside";
}

const RealisticFrenchDoorVisualizer: React.FC<
  RealisticFrenchDoorVisualizerProps
> = ({ config, width, height, view }) => {
  // Helper to get frame styles (same as Bifold)
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

  // Calculate sidelight dimensions
  const totalWidth = width;
  const leftSidelightWidth = config.sidelights.left.enabled
    ? config.sidelights.left.width
    : 0;
  const rightSidelightWidth = config.sidelights.right.enabled
    ? config.sidelights.right.width
    : 0;
  const doorWidth = totalWidth - leftSidelightWidth - rightSidelightWidth;

  // Percentages for flex layout
  const leftPct = (leftSidelightWidth / totalWidth) * 100;
  const rightPct = (rightSidelightWidth / totalWidth) * 100;
  const doorPct = (doorWidth / totalWidth) * 100;

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

      {/* 2. The Door Assembly Container */}
      <div className="absolute inset-0 p-4 flex flex-col pointer-events-none">
        {/* Trickle Vents (Top Addon) */}
        {/* Trickle Vents (Top Addon) */}
        {(typeof config.trickleVents === "number"
          ? config.trickleVents > 0
          : config.trickleVents) && (
          <div
            className={`w-full h-4 mb-[1px] ${frameBg} relative shadow-sm z-20 flex-shrink-0 mx-auto rounded-t-sm`}
            style={{ width: "99%" }}
          >
            {typeof config.trickleVents === "number" &&
            config.trickleVents > 0 ? (
              Array.from({ length: config.trickleVents }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1 h-1.5 bg-black/10 rounded-full"
                  style={{
                    left: `${(100 / ((config.trickleVents as number) + 1)) * (i + 1)}%`,
                    width: `${Math.min(20, 80 / (config.trickleVents as number))}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              ))
            ) : (
              <div className="absolute inset-x-4 top-1 h-1.5 bg-black/10 rounded-full" />
            )}
          </div>
        )}

        {/* Main Outer Frame */}
        <div
          className={`
                    relative flex-1 w-full 
                    border-t-[8px] border-x-[8px] border-b-[8px] 
                    ${frameBorderColor} 
                    bg-transparent 
                    flex shadow-2xl overflow-hidden
                    ${!config.trickleVents ? "rounded-t-sm" : ""}
                    ${config.cill === "none" ? "rounded-b-sm" : ""}
                `}
        >
          {/* Threshold Visual (Bottom Line) */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-[4px] z-50 ${config.threshold === "low" ? "bg-gray-300" : "bg-transparent"} border-t border-white/20`}
          />

          {/* Panels Flex Container */}
          <div className="flex-1 flex h-full relative">
            {/* Left Sidelight */}
            {config.sidelights.left.enabled && (
              <div
                style={{ width: `${leftPct}%` }}
                className={`
                                    h-full relative 
                                    border-[3px]
                                    ${frameBorderColor}
                                    bg-blue-300/5 backdrop-blur-[1px]
                                    overflow-hidden z-10
                                `}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />
                <div
                  className={`absolute inset-0 border-[1px] ${sashBorder} opacity-50 pointer-events-none`}
                />
                {config.sidelights.left.transom && (
                  <div
                    className={`absolute top-1/3 w-full h-[8px] ${frameBg}`}
                  />
                )}
              </div>
            )}

            {/* Door 1 (Left Panel) */}
            <div
              className={`
                            flex-1 h-full relative 
                            border-[3px]
                            ${frameBorderColor}
                            ${config.sidelights.left.enabled ? "-ml-[3px]" : ""}
                            bg-blue-300/5 backdrop-blur-[1px]
                            overflow-hidden z-10
                        `}
            >
              {/* Glass Reflection / Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />
              {/* Inner Sash Definition */}
              <div
                className={`absolute inset-0 border-[1px] ${sashBorder} opacity-50 pointer-events-none`}
              />

              {/* Handle on left door — always near the center (right side of left panel) */}
              <div
                className={`
                                absolute top-1/2 -translate-y-1/2 w-[6px] h-24 rounded-[2px] z-30 transition-colors duration-300
                                ${handleClass}
                                right-2
                                shadow-sm
                            `}
              />
            </div>

            {/* Door 2 (Right Panel) */}
            <div
              className={`
                            flex-1 h-full relative 
                            border-[3px]
                            ${frameBorderColor}
                            -ml-[3px]
                            bg-blue-300/5 backdrop-blur-[1px]
                            overflow-hidden z-10
                        `}
            >
              {/* Glass Reflection / Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />
              {/* Inner Sash Definition */}
              <div
                className={`absolute inset-0 border-[1px] ${sashBorder} opacity-50 pointer-events-none`}
              />

              {/* Handle on right door — always near the center (left side of right panel) */}
              <div
                className={`
                                absolute top-1/2 -translate-y-1/2 w-[6px] h-24 rounded-[2px] z-30 transition-colors duration-300
                                ${handleClass}
                                left-2
                                shadow-sm
                            `}
              />
            </div>

            {/* Right Sidelight */}
            {config.sidelights.right.enabled && (
              <div
                style={{ width: `${rightPct}%` }}
                className={`
                                    h-full relative 
                                    border-[3px]
                                    ${frameBorderColor}
                                    -ml-[3px]
                                    bg-blue-300/5 backdrop-blur-[1px]
                                    overflow-hidden z-10
                                `}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />
                <div
                  className={`absolute inset-0 border-[1px] ${sashBorder} opacity-50 pointer-events-none`}
                />
                {config.sidelights.right.transom && (
                  <div
                    className={`absolute top-1/3 w-full h-[8px] ${frameBg}`}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cill (Bottom Addon) */}
        {config.cill !== "none" && (
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

      {/* 3. Overlays (Direction Arrows) */}
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
              id="fd-arrowhead-right"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
            <marker
              id="fd-arrowhead-left"
              markerWidth="10"
              markerHeight="7"
              refX="1"
              refY="3.5"
              orient="auto"
            >
              <polygon points="10 0, 0 3.5, 10 7" fill="#ef4444" />
            </marker>
          </defs>

          {(() => {
            // Calculate door area positions (excluding sidelights)
            const lW = config.sidelights.left.enabled
              ? config.sidelights.left.width
              : 0;
            const rW = config.sidelights.right.enabled
              ? config.sidelights.right.width
              : 0;
            const dW = width - lW - rW;
            const singleDoorW = dW / 2;

            const d1Cx = lW + singleDoorW / 2;
            const d2Cx = lW + singleDoorW + singleDoorW / 2;
            const cy = height / 2;
            const arrowLen = singleDoorW / 3;
            const strokeW = Math.max(2, height * 0.002);

            return (
              <>
                {/* Left Door Arrow (Points Left — towards hinge) */}
                <line
                  x1={d1Cx + arrowLen}
                  y1={cy}
                  x2={d1Cx - arrowLen}
                  y2={cy}
                  stroke="#ef4444"
                  strokeWidth={strokeW}
                  markerEnd="url(#fd-arrowhead-left)"
                  style={{ filter: "drop-shadow(0px 1px 2px white)" }}
                />

                {/* Right Door Arrow (Points Right — towards hinge) */}
                <line
                  x1={d2Cx - arrowLen}
                  y1={cy}
                  x2={d2Cx + arrowLen}
                  y2={cy}
                  stroke="#ef4444"
                  strokeWidth={strokeW}
                  markerEnd="url(#fd-arrowhead-right)"
                  style={{ filter: "drop-shadow(0px 1px 2px white)" }}
                />
              </>
            );
          })()}
        </svg>
      </div>

      {/* Footer Label */}
      <div className="absolute bottom-2 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded text-[10px] font-bold shadow-sm flex gap-2 z-50 text-slate-700 border border-slate-200">
        <span>
          {width}x{height}mm
        </span>
        <span className="text-slate-300">•</span>
        <span>French Door</span>
        <span className="text-slate-300">•</span>
        <span className="uppercase text-blue-600">{view} View</span>
      </div>
    </div>
  );
};

export default RealisticFrenchDoorVisualizer;
