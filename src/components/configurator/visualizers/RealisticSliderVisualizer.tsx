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
    if (name.includes("gold")) return "bg-yellow-500 shadow-yellow-900/20";
    return "bg-gradient-to-b from-slate-100 to-slate-300 border border-slate-300 shadow-black/20"; // Chrome
  };

  const frameColor =
    view === "outside"
      ? config.outsideColor
      : config.insideColor || config.color;
  const { bg: frameBg, borderColor: frameBorderColor } =
    getFrameStyles(frameColor);
  const handleClass = getHandleStyle(config.handleColor);

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

      {/* 2. The Slider Assembly */}
      <div className="absolute inset-0 p-4 flex flex-col pointer-events-none">
        {/* Main Frame */}
        <div
          className={`
            relative flex-1 w-full 
            border-8 ${frameBorderColor} 
            bg-transparent 
            flex shadow-2xl overflow-hidden rounded-sm
          `}
        >
          {/* Panels Container */}
          <div className="flex-1 flex w-full relative h-full">
            {Array.from({ length: config.panels }).map((_, i) => (
              <div
                key={i}
                className={`
                  flex-1 h-full relative 
                  border-2 ${frameBorderColor}
                  bg-blue-300/5 backdrop-blur-[1px]
                  overflow-hidden z-10
                  ${i > 0 ? "-ml-0.5" : ""}
                `}
              >
                {/* Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none opacity-60" />

                {/* Interlock Stile (if applicable) */}
                {/* Simulating interlock thickness visually based on config */}
                {i < config.panels - 1 && (
                  <div
                    className={`absolute right-0 top-0 bottom-0 ${config.interlock === "47mm" ? "w-0.75" : "w-0.5"} bg-black/20 z-20`}
                  />
                )}

                {/* Handle - Visual placement logic */}
                {(() => {
                  let showHandle = false;
                  let handlePos = "right-4";

                  if (config.panels === 2) {
                    if (i === 0) {
                      showHandle = true;
                      handlePos = "right-4";
                    }
                    if (i === 1) {
                      showHandle = true;
                      handlePos = "left-4";
                    }
                  } else if (config.panels === 4) {
                    if (i === 1) {
                      showHandle = true;
                      handlePos = "right-4";
                    }
                    if (i === 2) {
                      showHandle = true;
                      handlePos = "left-4";
                    }
                  } else {
                    // Fallback for 3 or others: handles on outer edges
                    if (i === 0) {
                      showHandle = true;
                      handlePos = "right-4";
                    }
                    if (i === config.panels - 1) {
                      showHandle = true;
                      handlePos = "left-4";
                    }
                  }

                  return (
                    showHandle && (
                      <div
                        className={`
                          absolute top-1/2 -translate-y-1/2 w-1.5 h-20 rounded-sm z-30 
                          ${handleClass}
                          ${handlePos}
                          shadow-sm
                        `}
                      />
                    )
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Cill */}
        {config.cill !== "none" && (
          <div
            className={`
              w-full h-6 mt-[1px] ${frameBg} 
              relative shadow-md shrink-0 z-20 border-t border-white/10
            `}
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
        <span>{config.panels} Panel Slider</span>
        <span className="text-slate-300">•</span>
        <span className="uppercase text-blue-600">{view} View</span>
      </div>
    </div>
  );
};

export default RealisticSliderVisualizer;
