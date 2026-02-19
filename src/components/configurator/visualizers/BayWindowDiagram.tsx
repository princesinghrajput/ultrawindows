import React from "react";

interface BayWindowDiagramProps {
    numberOfPanes: number;
}

const BayWindowDiagram: React.FC<BayWindowDiagramProps> = ({
    numberOfPanes,
}) => {
    const svgWidth = 500;
    const svgHeight = 340;
    const cx = svgWidth / 2;
    const topY = 55;
    const depth = 200;
    const halfWidth = 195;

    // Generate points along an arc (bay projects downward from the wall)
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= numberOfPanes; i++) {
        const t = i / numberOfPanes;
        const angle = Math.PI * t; // 0 to PI
        const x = cx - halfWidth * Math.cos(angle);
        const y = topY + depth * Math.sin(angle);
        points.push({ x, y });
    }

    const segmentLetters = "abcdefgh";
    const angleLetters = "ABCDEFG";

    // Wall extension lines direction (extend outward along first/last segment direction)
    const wallLen = 45;

    const firstDir = {
        x: points[0].x - points[1].x,
        y: points[0].y - points[1].y,
    };
    const firstDirLen = Math.sqrt(firstDir.x ** 2 + firstDir.y ** 2);
    const leftWallEnd = {
        x: points[0].x + (firstDir.x / firstDirLen) * wallLen,
        y: points[0].y + (firstDir.y / firstDirLen) * wallLen,
    };

    const lastIdx = numberOfPanes;
    const lastDir = {
        x: points[lastIdx].x - points[lastIdx - 1].x,
        y: points[lastIdx].y - points[lastIdx - 1].y,
    };
    const lastDirLen = Math.sqrt(lastDir.x ** 2 + lastDir.y ** 2);
    const rightWallEnd = {
        x: points[lastIdx].x + (lastDir.x / lastDirLen) * wallLen,
        y: points[lastIdx].y + (lastDir.y / lastDirLen) * wallLen,
    };

    // Get the midpoint of a segment and offset outward for label placement
    const getSegmentLabelPos = (i: number) => {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        // Normal perpendicular to segment
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const segLen = Math.sqrt(dx * dx + dy * dy);

        // Two possible normals: (-dy, dx) and (dy, -dx)
        const nx1 = -dy / segLen;
        const ny1 = dx / segLen;

        // Choose the one pointing AWAY from arc center (outward)
        const toCenterX = cx - midX;
        const toCenterY = topY - 30 - midY;
        const dot = nx1 * toCenterX + ny1 * toCenterY;

        const sign = dot < 0 ? 1 : -1;
        const offset = 16;

        return {
            x: midX + sign * nx1 * offset,
            y: midY + sign * ny1 * offset,
        };
    };

    // Get angle label position (offset inward toward wall/center)
    const getAngleLabelPos = (i: number) => {
        const p = points[i + 1]; // joint point (skip first point)
        const toCenterX = cx - p.x;
        const toCenterY = topY - 40 - p.y;
        const dist = Math.sqrt(toCenterX ** 2 + toCenterY ** 2) || 1;
        const offset = 20;

        return {
            x: p.x + (toCenterX / dist) * offset,
            y: p.y + (toCenterY / dist) * offset,
        };
    };

    // Draw small angle arc at joint
    const getAngleArc = (jointIdx: number) => {
        const joint = points[jointIdx];
        const prev = points[jointIdx - 1];
        const next = points[jointIdx + 1];
        const r = 10;

        const dir1 = Math.atan2(prev.y - joint.y, prev.x - joint.x);
        const dir2 = Math.atan2(next.y - joint.y, next.x - joint.x);

        const x1 = joint.x + r * Math.cos(dir1);
        const y1 = joint.y + r * Math.sin(dir1);
        const x2 = joint.x + r * Math.cos(dir2);
        const y2 = joint.y + r * Math.sin(dir2);

        // Determine sweep flag (we want the arc on the inside/top side)
        const cross =
            (prev.x - joint.x) * (next.y - joint.y) -
            (prev.y - joint.y) * (next.x - joint.x);
        const sweepFlag = cross > 0 ? 0 : 1;

        return `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweepFlag} ${x2} ${y2}`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
            <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full"
                style={{ maxWidth: "480px", maxHeight: "320px" }}
            >
                {/* Background */}
                <rect
                    x="0"
                    y="0"
                    width={svgWidth}
                    height={svgHeight}
                    fill="white"
                />

                {/* Wall extension lines (dashed) */}
                <line
                    x1={leftWallEnd.x}
                    y1={leftWallEnd.y}
                    x2={points[0].x}
                    y2={points[0].y}
                    stroke="#9ca3af"
                    strokeWidth="1"
                    strokeDasharray="5,4"
                />
                <line
                    x1={rightWallEnd.x}
                    y1={rightWallEnd.y}
                    x2={points[lastIdx].x}
                    y2={points[lastIdx].y}
                    stroke="#9ca3af"
                    strokeWidth="1"
                    strokeDasharray="5,4"
                />

                {/* Bay segments */}
                {points.slice(0, -1).map((p, i) => (
                    <line
                        key={`seg-${i}`}
                        x1={p.x}
                        y1={p.y}
                        x2={points[i + 1].x}
                        y2={points[i + 1].y}
                        stroke="#4b5563"
                        strokeWidth="1.5"
                    />
                ))}

                {/* Small angle arcs at joints */}
                {points.slice(1, -1).map((_, i) => (
                    <path
                        key={`arc-${i}`}
                        d={getAngleArc(i + 1)}
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="0.8"
                    />
                ))}

                {/* Joint dots */}
                {points.map((p, i) => (
                    <circle
                        key={`dot-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r="2"
                        fill="#6b7280"
                    />
                ))}

                {/* Segment labels (blue, lowercase) */}
                {points.slice(0, -1).map((_, i) => {
                    const pos = getSegmentLabelPos(i);
                    return (
                        <text
                            key={`lbl-${i}`}
                            x={pos.x}
                            y={pos.y}
                            fill="#3b82f6"
                            fontSize="15"
                            fontWeight="700"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="Inter, system-ui, sans-serif"
                        >
                            {segmentLetters[i]}
                        </text>
                    );
                })}

                {/* Angle labels (red, uppercase) */}
                {points.slice(1, -1).map((_, i) => {
                    const pos = getAngleLabelPos(i);
                    return (
                        <text
                            key={`angle-${i}`}
                            x={pos.x}
                            y={pos.y}
                            fill="#ef4444"
                            fontSize="13"
                            fontWeight="700"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontFamily="Inter, system-ui, sans-serif"
                        >
                            {angleLetters[i]}
                        </text>
                    );
                })}
            </svg>

            <p className="text-xs text-slate-500 italic text-center mt-4 max-w-md leading-relaxed">
                All bay widths and angles are viewed externally but internal widths are
                required when surveying bay windows.
            </p>
        </div>
    );
};

export default BayWindowDiagram;
