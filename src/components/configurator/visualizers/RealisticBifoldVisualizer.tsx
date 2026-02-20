import React from "react";

interface BifoldVisualizerProps {
  width: number;
  height: number;
  panels: number;
  openingDirection: "left" | "right" | "both";
  configuration?: string;
  color: string;
  handleColor?: string;
  cill?: string;
  trickleVents?: boolean | number;
  ventPositions?: number[];
  view?: "inside" | "outside";
  integralBlinds?: boolean;
  glassType?: string;
  glassPattern?: string;
  addonLeft?: string | null;
  addonRight?: string | null;
  addonTop?: string | null;
  transomBars?: number;
  transomBarPositions?: number[];
  astragalBars?: number;
  astragalBarPositions?: number[];
}

const BifoldVisualizer: React.FC<BifoldVisualizerProps> = ({
  width,
  height,
  panels,
  openingDirection,
  configuration = `${panels}+0`,
  color,
  handleColor = "chrome",
  cill = "none",
  trickleVents = 0,
  ventPositions,
  view = "outside",
  integralBlinds = false,
  glassType = "clear",
  glassPattern,
  addonLeft = null,
  addonRight = null,
  addonTop = null,
  transomBars = 0,
  transomBarPositions,
  astragalBars = 0,
  astragalBarPositions,
}) => {
  const [leftCount] = configuration
    ? configuration.split("+").map(Number)
    : [panels, 0];

  // ── colour helpers ──────────────────────────────────────────────

  const getFrameColor = (colorName: string) => {
    const c = colorName.toLowerCase();
    if (c.includes("white"))
      return { bg: "#ffffff", border: "#e2e8f0", sash: "#f1f5f9" };
    if (c.includes("black"))
      return { bg: "#1a1a1a", border: "#0a0a0a", sash: "#2d2d2d" };
    if (c.includes("anthracite") || c === "#333333")
      return { bg: "#3a3a3a", border: "#2a2a2a", sash: "#484848" };
    if (c.includes("grey"))
      return { bg: "#4a5568", border: "#3d4555", sash: "#5a6578" };
    // RAL / custom hex fallback
    if (c.startsWith("#")) return { bg: c, border: c, sash: c };
    return { bg: "#4a5568", border: "#3d4555", sash: "#5a6578" };
  };

  const getHandleGradient = (c: string) => {
    const n = c.toLowerCase();
    if (n.includes("black"))
      return "linear-gradient(180deg, #3a3a3a 0%, #111 50%, #222 100%)";
    if (n.includes("white"))
      return "linear-gradient(180deg, #fff 0%, #e8e8e8 50%, #f5f5f5 100%)";
    if (n.includes("gold"))
      return "linear-gradient(180deg, #f0d060 0%, #c8951a 40%, #daa520 80%, #f0d060 100%)";
    if (n.includes("satin"))
      return "linear-gradient(180deg, #d4d4d8 0%, #a1a1aa 50%, #c0c0c0 100%)";
    if (n.includes("stainless"))
      return "linear-gradient(180deg, #c8c8cc 0%, #8a8a90 40%, #b0b0b4 80%, #d0d0d4 100%)";
    // chrome default
    return "linear-gradient(180deg, #e8eaed 0%, #9aa0a8 35%, #c0c4c8 65%, #dfe1e4 100%)";
  };

  const getGlassStyle = () => {
    if (glassType === "unglazed") return { background: "transparent" };

    const isObscure =
      glassType === "obscure" ||
      glassType === "toughened_obscure" ||
      glassPattern === "Satin" ||
      glassPattern?.includes("Stippolyte");
    const isBlue = glassPattern?.includes("Blue");
    const isBronze = glassPattern?.includes("Bronze");
    const isGrey = glassPattern?.includes("Grey");

    if (isObscure)
      return {
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(4px)",
      };
    if (isBlue) return { background: "rgba(147,197,253,0.2)" };
    if (isBronze) return { background: "rgba(120,70,20,0.08)" };
    if (isGrey) return { background: "rgba(30,41,59,0.08)" };
    // default clear — light sky tint
    return { background: "rgba(186,220,255,0.12)" };
  };

  const frame = getFrameColor(color);
  const handleBg = getHandleGradient(handleColor);
  const glassStyle = getGlassStyle();

  // ── derived values ──────────────────────────────────────────────

  const hasVents =
    typeof trickleVents === "number" ? trickleVents > 0 : trickleVents;
  const ventCount =
    typeof trickleVents === "number" ? trickleVents : trickleVents ? 1 : 0;

  return (
    <div
      className="relative w-full h-full mx-auto group overflow-hidden rounded-lg"
      style={{
        boxShadow:
          "0 25px 60px -12px rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.2)",
      }}
    >
      {/* ── Background ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundImage:
            "url(/images/aluminium_bifolf/backgrounds/garden.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter:
            view === "inside"
              ? "brightness(1.05)"
              : "brightness(1.02) contrast(1.05) saturate(1.05)",
        }}
      />
      {/* ambient light overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(135,206,250,0.06) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      {/* Floor Shadow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-14 w-[85%] rounded-[100%] blur-2xl bg-black/40 opacity-50" />

      {/* ── Door Assembly ─────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative flex flex-col"
          style={{
            aspectRatio: `${width} / ${height}`,
            width: "100%",
            maxHeight: "100%",
          }}
        >
          {/* Top Section */}
          <div className="flex flex-col w-full">
            {/* Top Addon */}
            {addonTop && (
              <div
                className="w-full relative z-10"
                style={{
                  height: addonTop.includes("38") ? 22 : 14,
                  backgroundColor: frame.bg,
                  borderLeft: `2px solid ${frame.border}`,
                  borderRight: `2px solid ${frame.border}`,
                  borderTop: `2px solid ${frame.border}`,
                  boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.1)`,
                }}
              />
            )}

            {/* Trickle Vents */}
            {hasVents && (
              <div
                className="w-full relative z-20 flex-shrink-0 flex items-center justify-center"
                style={{
                  height: 18,
                  backgroundColor: frame.bg,
                  marginBottom: 1,
                  borderRadius: !addonTop ? "3px 3px 0 0" : 0,
                  width: "99%",
                  alignSelf: "center",
                  boxShadow: `0 2px 6px rgba(0,0,0,0.12)`,
                }}
              >
                {ventCount > 0 &&
                  (ventPositions && ventPositions.length > 0
                    ? ventPositions
                    : Array.from({ length: ventCount }, (_, i) =>
                        (100 / (ventCount + 1)) * (i + 1)
                      )
                  ).map((pos: number, i: number) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        top: 5,
                        height: 7,
                        left: `${pos}%`,
                        width: `${Math.min(20, 80 / ventCount)}%`,
                        transform: "translateX(-50%)",
                        background: "#ef4444",
                      }}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Middle Section */}
          <div className="flex-1 flex w-full relative min-h-0">
            {/* Left Addon */}
            {addonLeft && (
              <div
                className="relative z-20 flex-shrink-0"
                style={{
                  width: addonLeft.includes("38") ? 22 : 14,
                  backgroundColor: frame.bg,
                  borderLeft: `2px solid ${frame.border}`,
                  borderTop: `2px solid ${frame.border}`,
                  borderBottom: `2px solid ${frame.border}`,
                  boxShadow: `inset -3px 0 6px rgba(0,0,0,0.1)`,
                }}
              />
            )}

            {/* Main Frame */}
            <div
              className="relative flex-1 w-full flex overflow-hidden transition-colors duration-500"
              style={{
                borderWidth: 8,
                borderStyle: "solid",
                borderColor: frame.border,
                backgroundColor: "transparent",
                borderRadius:
                  (!hasVents && !addonTop ? "3px " : "0 ") +
                  (!hasVents && !addonTop ? "3px " : "0 ") +
                  (cill === "none" ? "3px " : "0 ") +
                  (cill === "none" ? "3px" : "0"),
                boxShadow: `
                inset 0 0 0 1px rgba(255,255,255,0.08),
                0 20px 50px -15px rgba(0,0,0,0.4),
                0 4px 16px -4px rgba(0,0,0,0.2)
              `,
              }}
            >
              {/* Panels */}
              <div className="flex-1 flex h-full relative">
                {Array.from({ length: panels }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full relative overflow-hidden transition-all duration-500"
                    style={{
                      borderWidth: 3,
                      borderStyle: "solid",
                      borderColor: frame.border,
                      marginLeft: i > 0 ? -3 : 0,
                      zIndex: 10,
                    }}
                  >
                    {/* Glass base tint */}
                    {glassType !== "unglazed" && (
                      <div
                        className="absolute transition-all duration-500"
                        style={{
                          inset: 3,
                          ...glassStyle,
                        }}
                      >
                        {/* Primary diagonal sheen */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%)",
                          }}
                        />
                        {/* Vertical light streak */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent 15%, rgba(255,255,255,0.06) 25%, transparent 35%)",
                          }}
                        />
                        {/* Bottom edge shadow */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1/4"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.04), transparent)",
                          }}
                        />
                      </div>
                    )}

                    {/* Integral Blinds */}
                    {integralBlinds && (
                      <div
                        className="absolute z-20 opacity-85 pointer-events-none"
                        style={{
                          inset: 6,
                          backgroundImage:
                            "url(/images/aluminium_bifolf/blinds.png)",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    )}

                    {/* Inner sash definition */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        border: `1px solid ${frame.sash}`,
                        opacity: 0.4,
                      }}
                    />

                    {/* Transom Bars */}
                    {transomBars > 0 &&
                      (transomBarPositions && transomBarPositions.length > 0
                        ? transomBarPositions
                        : Array.from(
                            { length: transomBars },
                            (_, bi) => (100 / (transomBars + 1)) * (bi + 1),
                          )
                      ).map((pos, barIndex) => (
                        <div
                          key={`tbar-${barIndex}`}
                          className="absolute w-full z-20"
                          style={{
                            height: 12,
                            backgroundColor: frame.bg,
                            top: `${pos}%`,
                            transform: "translateY(-50%)",
                            boxShadow: `0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)`,
                            borderTop: "1px solid rgba(0,0,0,0.08)",
                            borderBottom: "1px solid rgba(0,0,0,0.08)",
                          }}
                        />
                      ))}

                    {/* Astragal Bars */}
                    {astragalBars > 0 &&
                      (astragalBarPositions && astragalBarPositions.length > 0
                        ? astragalBarPositions
                        : Array.from(
                            { length: astragalBars },
                            (_, bi) => (100 / (astragalBars + 1)) * (bi + 1),
                          )
                      ).map((pos, barIndex) => (
                        <div
                          key={`abar-${barIndex}`}
                          className="absolute h-full z-20"
                          style={{
                            width: 12,
                            backgroundColor: frame.bg,
                            left: `${pos}%`,
                            transform: "translateX(-50%)",
                            boxShadow: `1px 0 3px rgba(0,0,0,0.15), inset 1px 0 0 rgba(255,255,255,0.1)`,
                            borderLeft: "1px solid rgba(0,0,0,0.08)",
                            borderRight: "1px solid rgba(0,0,0,0.08)",
                          }}
                        />
                      ))}

                    {/* Handle */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300"
                      style={{
                        width: 7,
                        height: 80,
                        borderRadius: 3,
                        background: handleBg,
                        [i % 2 === 0 ? "right" : "left"]: 8,
                        boxShadow: `
                        0 2px 6px rgba(0,0,0,0.25),
                        inset 0 1px 0 rgba(255,255,255,0.3)
                      `,
                      }}
                    />

                    {/* Direction Arrow */}
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                      <div
                        className="flex items-center"
                        style={{
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                        }}
                      >
                        {i < leftCount ? (
                          <>
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "6px solid transparent",
                                borderBottom: "6px solid transparent",
                                borderRight: "9px solid #ef4444",
                              }}
                            />
                            <div
                              style={{
                                width: 22,
                                height: 2,
                                background: "#ef4444",
                                borderRadius: 1,
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                width: 22,
                                height: 2,
                                background: "#ef4444",
                                borderRadius: 1,
                              }}
                            />
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "6px solid transparent",
                                borderBottom: "6px solid transparent",
                                borderLeft: "9px solid #ef4444",
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Addon */}
            {addonRight && (
              <div
                className="relative z-20 flex-shrink-0"
                style={{
                  width: addonRight.includes("38") ? 22 : 14,
                  backgroundColor: frame.bg,
                  borderRight: `2px solid ${frame.border}`,
                  borderTop: `2px solid ${frame.border}`,
                  borderBottom: `2px solid ${frame.border}`,
                  boxShadow: `inset 3px 0 6px rgba(0,0,0,0.1)`,
                }}
              />
            )}
          </div>

          {/* Cill */}
          {cill !== "none" && (
            <div
              className="w-full flex-shrink-0 z-20 transition-colors duration-500"
              style={{
                height: 26,
                marginTop: 1,
                backgroundColor: frame.bg,
                boxShadow: `
                0 4px 12px rgba(0,0,0,0.2),
                inset 0 1px 0 rgba(255,255,255,0.1),
                0 1px 0 rgba(255,255,255,0.05)
              `,
                borderTop: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              {/* Cill nose / drip edge */}
              <div
                className="absolute bottom-0 w-full"
                style={{
                  height: 6,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Footer badge ──────────────────────────────────────── */}
      <div
        className="absolute bottom-3 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          color: "#334155",
        }}
      >
        <span>
          {width}×{height}mm
        </span>
        <span style={{ color: "#cbd5e1" }}>•</span>
        <span>{panels} Panels</span>
        <span style={{ color: "#cbd5e1" }}>•</span>
        <span style={{ color: "#f97316", textTransform: "uppercase" }}>
          {view} View
        </span>
      </div>
    </div>
  );
};

export default BifoldVisualizer;
